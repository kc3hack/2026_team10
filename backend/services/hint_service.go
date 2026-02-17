package services

import (
	"fmt"

	"github.com/kc3hack/2026_team10/backend/dto"
	"github.com/kc3hack/2026_team10/backend/repositories"
)

type IHintService interface {
	StartGame() (*dto.StartGameResult, error)
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
