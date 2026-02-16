package services

import (
	"errors"

	"github.com/kc3hack/2026_team10/backend/model"
	"github.com/kc3hack/2026_team10/backend/repositories"
)

type IHintService interface {
	GetHints() (*model.StartGameResult, error)
}

type HintService struct {
	repository repositories.IHintRepository
}

func NewHintService(repository repositories.IHintRepository) IHintService {
	return &HintService{repository: repository}
}

func (s *HintService) GetHints() (*model.StartGameResult, error) {
	// お題、ヒントを作成
	answer := "お題"
	hints := []string{"ヒント1", "ヒント2", "ヒント3"}

	// データを保存
	result, err := s.repository.CreateRound(answer, hints)
	if err != nil {
		return nil, errors.New("failed to save hint data")
	}

	// IDとヒントを返す
	response := &model.StartGameResult{
		ID:    result.ID,
		Hints: hints,
	}
	return response, nil
}
