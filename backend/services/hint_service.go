package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/kc3hack/2026_team10/backend/dto"
	"github.com/kc3hack/2026_team10/backend/models"
	"github.com/kc3hack/2026_team10/backend/repositories"
	"google.golang.org/genai"
)

const MinRoundAnswerRevealDuration = 90 * time.Second

var (
	ErrRoundNotFound    = errors.New("round not found")
	ErrRoundNotFinished = errors.New("round is not finished yet")
	ErrRoundTooEarly    = errors.New("game has not been played long enough")
	ErrBookmarkNotFound = errors.New("bookmark not found")
)

type IHintService interface {
	StartGame() (*dto.StartGameResult, error)
	GetAnswer(id uint) (string, error)
	CheckAnswer(id uint, answer string) (bool, error)
	GetFinishedRoundByID(id uint) (*dto.RoundResponse, error)
	BookmarkRound(id uint) (*dto.RoundResponse, error)
	GetRandomBookmark() (*dto.RoundResponse, error)
	GetBookmarkedList() ([]dto.RoundResponse, error)
}

type HintService struct {
	repository repositories.IHintRepository
}

func NewHintService(repository repositories.IHintRepository) IHintService {
	return &HintService{repository: repository}
}

func (s *HintService) StartGame() (*dto.StartGameResult, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY が設定されていません")
	}
	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}

	const prompt = `
		# Role
		あなたは京都(上品・皮肉)と大阪(効率・本音)の個性を完璧に描き分ける脚本家であり、厳密なJSONデータを出力するシステムです。

		# Task
		ある お題 に関する偏見とリスペクトが入り混じった会話劇(10文)を ヒント として作成し、JSON形式で出力してください。

		# Constraints
		- お題を当てるクイズ形式にする。
		- お題 そのものの単語は絶対にセリフに含めない。
		- 具体的な 商品名 は避け、一般名詞を正解とする。

		- "answers" 配列には、正解判定を網羅するため以下のパターンを全て含めること。
            - 漢字、ひらがな、カタカナ。
            - 英語（全て小文字）。
            - 一般的な略称や通称（例：「自動販売機」なら「自販機」、「スマートフォン」なら「スマホ」）。
            - 例：お題が自転車なら ["自転車", "じてんしゃ", "ジテンシャ", "bicycle", "チャリ"]

		- ヒント(セリフ)は10個程度で。京都のターン → 大阪のターン の順番で交互にループさせる。
		- 1つのセリフはできるだけ短くする。

		- 最優先事項：正解の推測難易度を段階的に下げること。
            - 前半（1〜3文目）：抽象的な表現や概念的な「いじり」に留め、正解を特定しにくくする。直接的に関連する単語(例：お題が傘なら、雨)は出さないようにしてください。
            - 中盤（4〜7文目）：その物体の形状や具体的な利用シーンに触れ、絞り込めるようにする。
            - 終盤（8〜10文目）：誰もが知る決定的な特徴を出し、最後は最大級のリスペクト（褒め）で締める。
        - ストーリー構成の指針：
            - 「最初は近寄りがたい・理解しがたい存在として扱い（いじり）、最後はなくてはならない存在として認める（オチ）」という感情曲線を守ってください。

		- 各地域のキャラ付け(※出力には地名を書かないこと):
			- 京都(奇数番目): 丁寧な言葉遣いの中に鋭い皮肉を込める(例：〜しはる、〜してはりますなぁ)。
			- 大阪(偶数番目): 直感的で、お金や効率を重視する(例：〜やん、〜知らんけど)。

		- セリフに カギかっこ や 発言者名(京都：等) は絶対に含めない。セリフの文章のみを記述すること。
		- 出力は以下のJSONフォーマットのみとし、他の文章は一切含めないこと。

		# JSON Format
		{
			"answers": [],
			"hints": [
				"1つ目のセリフ(京都：難易度 高)",
				"2つ目のセリフ(大阪)",
				"3つ目のセリフ(京都)",
				"4つ目のセリフ(大阪)",
				"5つ目のセリフ(京都)",
				"6つ目のセリフ(大阪)",
				"7つ目のセリフ(京都)",
				"8つ目のセリフ(大阪)",
				"9つ目のセリフ(京都)",
				"10個目のセリフ(大阪：難易度 低)"
			]
		}
	`

	// 生成パラメータ設定。
	// 「かなりランダムにしたいけど、日本語が崩れるのはイヤ」という前提で、
	// そこそこ攻めつつも壊れにくいラインを狙っている。
	temp := float32(1.3)
	// temperature: 出力のランダムさ（0.0〜2.0）
	// ・0 に近い      : ほぼ毎回同じ＝堅い・安定
	// ・1.0（デフォ）: Google公式が推奨している標準値
	// ・1.0〜1.3      : そこそこ多様で、普通の文章タスクならまだ破綻しにくいゾーン
	// ・1.6 以上       : 研究や実験でも「一気に破綻しやすくなる」ことが報告されている

	topP := float32(0.95)
	// topP: nucleus sampling（確率質量）のカットオフ（0.0〜1.0）
	// ・高いほど（0.9〜0.95）: 候補トークンを広く残す → バリエーションが増える
	// ・低いほど（0.4〜0.6）: 高確率な単語だけ使う → 安定・保守的
	// 0.95 は「創造性寄りにしつつも、あまりに変な単語は落とす」バランスの良い値。

	topK := float32(40)
	// topK: 各ステップで「確率の高い上位K個のトークン」だけを候補にする制限。
	// ・小さい値（1〜10）  : かなり保守的、ほぼ同じ文になりがち
	// ・大きい値（40〜100）: バリエーション増えるが、変な言い回しも増えやすい
	// 一部の Gemini モデルは nucleus sampling（topP）だけを使っていて、
	// その場合は topK は無視される（ドキュメントにそう明記されている）。
	// ここでは「効けばラッキー」程度で 40 にしておく。

	// seed := int32(46)
	// seed: 乱数シード（同じプロンプト＋同じ設定＋同じ seed なら、
	//       ベストエフォートで同じ出力になりやすくするためのもの）。
	// ・テストやデバッグで「同じ出力を再現したい」ときに固定する
	// ・毎回違う出力がほしいときは、あえて設定しないか、毎回変える
	// ランダムさを優先したい本番ゲーム用途では、基本は設定しない方がよいので
	// 実際の config には渡さずコメントアウトしておく:

	config := &genai.GenerateContentConfig{
		Temperature: &temp, // ランダムさ
		TopP:        &topP, // nucleus sampling の範囲
		TopK:        &topK, // 有効なモデルなら上位K制限（無効なモデルもある）
		// Seed:      &seed, // ※再現性が欲しいテスト時だけ使う。通常はコメントアウト。
		ResponseMIMEType: "application/json",
		ResponseJsonSchema: map[string]any{
			"type": "object",
			"properties": map[string]any{
				"answers": map[string]any{
					"type": "array",
					"items": map[string]any{
						"type":        "string",
						"description": "正解のリスト。表記ゆれを考慮して複数入れる。漢字、ひらがな、カタカナ、英語（小文字）、および一般的な略称（例：自販機、スマホ）など、考えられえるものを全て含めること。",
					},
				},
				"hints": map[string]any{
					"type": "array",
					"items": map[string]any{
						"type":        "string",
						"description": "10個の会話文。京都(奇数)と大阪(偶数)の交互。",
					},
				},
			},
			"required": []string{"answers", "hints"},
		},
	}

	res, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		genai.Text(prompt),
		config,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	var geminiData struct {
		Answers []string `json:"answers"`
		Hints   []string `json:"hints"`
	}

	text := res.Text()

	fmt.Println(text)

	if err := json.Unmarshal([]byte(text), &geminiData); err != nil {
		return nil, fmt.Errorf("JSONパースに失敗しました: %w (raw: %s)", err, text)
	}

	result, err := s.repository.CreateRound(geminiData.Answers, geminiData.Hints)
	if err != nil {
		return nil, fmt.Errorf("failed to save hint data: %w", err)
	}

	// IDとヒントを返す
	response := &dto.StartGameResult{
		ID:    result.ID,
		Hints: result.Hints,
	}
	return response, nil
}

func (s *HintService) getRound(id uint) (*models.Round, error) {
	round, err := s.repository.GetRoundByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get round: %w", err)
	}
	if round == nil {
		return nil, fmt.Errorf("%w: id=%d", ErrRoundNotFound, id)
	}
	return round, nil
}

func (s *HintService) GetAnswer(id uint) (string, error) {
	round, err := s.getRound(id)
	if err != nil {
		return "", err
	}
	if !round.IsFinished {
		if time.Since(round.CreatedAt) < MinRoundAnswerRevealDuration {
			return "", fmt.Errorf("%w", ErrRoundTooEarly)
		}
		if err := s.repository.FinishRound(id); err != nil {
			return "", fmt.Errorf("failed to finish round: %w", err)
		}
	}
	return round.Answers[0], nil
}

func (s *HintService) CheckAnswer(id uint, answer string) (bool, error) {
	round, err := s.getRound(id)
	if err != nil {
		return false, err
	}
	user := strings.TrimSpace(answer)
	for _, a := range round.Answers {
		if strings.EqualFold(strings.TrimSpace(a), user) {
			if err := s.repository.FinishRound(id); err != nil {
				return false, fmt.Errorf("failed to finish round: %w", err)
			}
			return true, nil
		}
	}
	return false, nil
}

func (s *HintService) GetFinishedRoundByID(id uint) (*dto.RoundResponse, error) {
	round, err := s.getRound(id)
	if err != nil {
		return nil, err
	}
	if !round.IsFinished {
		return nil, fmt.Errorf("%w: id=%d", ErrRoundNotFinished, id)
	}
	result := &dto.RoundResponse{
		ID:        round.ID,
		Answer:    round.Answers[0],
		Hints:     round.Hints,
		UpdatedAt: round.UpdatedAt,
	}
	return result, nil
}

func (s *HintService) BookmarkRound(id uint) (*dto.RoundResponse, error) {
	round, err := s.getRound(id)
	if err != nil {
		return nil, err
	}
	if !round.IsFinished {
		return nil, fmt.Errorf("%w: id=%d", ErrRoundNotFinished, id)
	}
	if err := s.repository.BookmarkRound(id); err != nil {
		return nil, fmt.Errorf("failed to bookmark round: %w", err)
	}
	result := &dto.RoundResponse{
		ID:        round.ID,
		Answer:    round.Answers[0],
		Hints:     round.Hints,
		UpdatedAt: round.UpdatedAt,
	}
	return result, nil
}

func (s *HintService) GetRandomBookmark() (*dto.RoundResponse, error) {
	round, err := s.repository.GetRandomBookmarkedRound()
	if err != nil {
		return nil, err
	}
	if round == nil {
		return nil, ErrBookmarkNotFound
	}

	return &dto.RoundResponse{
		ID:        round.ID,
		Answer:    round.Answers[0],
		Hints:     round.Hints,
		UpdatedAt: round.UpdatedAt,
	}, nil
}

func (s *HintService) GetBookmarkedList() ([]dto.RoundResponse, error) {
	rounds, err := s.repository.GetAllBookmarkedRounds()
	if err != nil {
		return nil, err
	}

	response := []dto.RoundResponse{}

	for _, r := range rounds {
		limit := 4
		if len(r.Hints) < limit {
			limit = len(r.Hints)
		}
		displayHints := r.Hints[:limit]

		response = append(response, dto.RoundResponse{
			ID:        r.ID,
			Answer:    r.Answers[0],
			Hints:     displayHints,
			UpdatedAt: r.UpdatedAt,
		})
	}
	return response, nil
}
