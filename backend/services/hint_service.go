package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/google/generative-ai-go/genai" // Google公式のGemini SDK
	"github.com/kc3hack/2026_team10/backend/dto"
	"github.com/kc3hack/2026_team10/backend/models"
	"github.com/kc3hack/2026_team10/backend/repositories"
	"google.golang.org/api/option"
)

var (
	ErrRoundNotFound    = errors.New("round not found")
	ErrRoundNotFinished = errors.New("round is not finished yet")
)

type IHintService interface {
	StartGame() (*dto.StartGameResult, error)
	GetAnswer(id uint) (string, error)
	CheckAnswer(id uint, answer string) (bool, error)
	GetFinishedRoundByID(id uint) (*dto.RoundResponse, error)
	BookmarkRound(id uint) (*dto.RoundResponse, error)
}

type HintService struct {
	repository repositories.IHintRepository
}

func NewHintService(repository repositories.IHintRepository) IHintService {
	return &HintService{repository: repository}
}

func (s *HintService) StartGame() (*dto.StartGameResult, error) {
	ctx := context.Background()

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY が設定されていません")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}
	defer client.Close()

	modelGemini := client.GenerativeModel("gemini-2.5-flash")
	modelGemini.ResponseMIMEType = "application/json"
	modelGemini.ResponseSchema = &genai.Schema{
		Type:     genai.TypeObject,
		Required: []string{"answers", "hints"},
		Properties: map[string]*genai.Schema{
			"answers": {
				Type:        genai.TypeArray,
				Items:       &genai.Schema{Type: genai.TypeString},
				Description: "解答の表記ブレになりそうな複数の文字列も入れる",
			},
			"hints": {
				Type:        genai.TypeArray,
				Items:       &genai.Schema{Type: genai.TypeString},
				Description: "10個の会話文。京都(奇数)と大阪(偶数)の交互。",
			},
		},
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
		- ヒント(セリフ)は10個程度で。京都のターン → 大阪のターン の順番で交互にループさせる。
		- 1つのセリフはできるだけ短くする。
		- すべてのセリフを通して会話のオチができるような流れにしてください
		- 各地域のキャラ付け(※出力には地名を書かないこと):
			- 京都(奇数番目): 丁寧な言葉遣いの中に鋭い皮肉を込める(例：〜しはる、〜してはりますなぁ)。
			- 大阪(偶数番目): 直感的で、お金や効率を重視する(例：〜やん、〜知らんけど)。
		- 後半になるにつれて、正解が容易に推測できるように構成する。
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
		}`

	resp, err := modelGemini.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	var geminiData struct {
		Answers []string `json:"answers"`
		Hints   []string `json:"hints"`
	}

	if part, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
		if err := json.Unmarshal([]byte(part), &geminiData); err != nil {
			return nil, fmt.Errorf("JSONパースに失敗しました: %w (raw: %s)", err, string(part))
		}
	} else {
		return nil, fmt.Errorf("Geminiからのレスポンス形式が不正です")
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
