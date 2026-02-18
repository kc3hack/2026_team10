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

var ErrRoundNotFound = errors.New("round not found")

type IHintService interface {
	StartGame() (*dto.StartGameResult, error)
	StartGame_AI() (*dto.StartGameResult, error)
	GetAnswer(id uint) (string, error)
	CheckAnswer(id uint, answer string) (bool, error)
}

type HintService struct {
	repository repositories.IHintRepository
}

func NewHintService(repository repositories.IHintRepository) IHintService {
	return &HintService{repository: repository}
}

func (s *HintService) StartGame() (*dto.StartGameResult, error) {
	// お題、ヒントを作成
	answer := "お題"
	hints := []string{"ヒント1", "ヒント2", "ヒント3"}

	// データを保存
	result, err := s.repository.CreateRound(answer, hints)
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

func (s *HintService) StartGame_AI() (*dto.StartGameResult, error) {
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

	prompt := "連想ゲームのヒントを作成してください。お題は【大阪】です。" +
		"人が話しているような文章で出力してください" +
		"以下のJSON形式で出力してください。他の説明は一切不要です。" +
		`{"answer": "大阪", "hints": ["ヒント1", "ヒント2", "ヒント3"]}`

	resp, err := modelGemini.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	rawText := fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0])

	rawText = strings.Trim(rawText, "`\n ")
	rawText = strings.TrimPrefix(rawText, "json")

	var geminiData struct {
		Answer string   `json:"answer"`
		Hints  []string `json:"hints"`
	}

	if err := json.Unmarshal([]byte(rawText), &geminiData); err != nil {
		return nil, fmt.Errorf("JSONパースに失敗しました: %w (raw: %s)", err, rawText)
	}

	result, err := s.repository.CreateRound(geminiData.Answer, geminiData.Hints)
	if err != nil {
		return nil, fmt.Errorf("failed to save hint data: %w", err)
	}

	return &dto.StartGameResult{
		ID:    result.ID,
		Hints: result.Hints,
	}, nil
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
	return round.Answer, nil
}

func (s *HintService) CheckAnswer(id uint, answer string) (bool, error) {
	round, err := s.getRound(id)
	if err != nil {
		return false, err
	}
	correct := strings.TrimSpace(round.Answer)
	user := strings.TrimSpace(answer)
	return strings.EqualFold(correct, user), nil
}
