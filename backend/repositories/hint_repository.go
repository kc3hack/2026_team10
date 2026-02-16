package repositories

import "github.com/kc3hack/2026_team10/backend/model"

type IHintRepository interface {
	CreateRound(answer string, hints []string) (*model.Round, error)
}

type HintMemoryRepository struct {
	rounds []model.Round
}

func NewHintMemoryRepository(rounds []model.Round) IHintRepository {
	return &HintMemoryRepository{rounds: rounds}
}

func (r *HintMemoryRepository) CreateRound(answer string, hints []string) (*model.Round, error) {
	newID := len(r.rounds) + 1
	round := model.Round{
		ID:     newID,
		Answer: answer,
		Hints:  hints,
	}
	r.rounds = append(r.rounds, round)
	return &round, nil
}
