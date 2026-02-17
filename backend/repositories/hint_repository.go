package repositories

import (
	"github.com/kc3hack/2026_team10/backend/models"
	"gorm.io/gorm"
)

type IHintRepository interface {
	CreateRound(answer string, hints []string) (*models.Round, error)
}

type HintRepository struct {
	db *gorm.DB
}

func NewHintRepository(db *gorm.DB) IHintRepository {
	return &HintRepository{db: db}
}

func (r *HintRepository) CreateRound(answer string, hints []string) (*models.Round, error) {
	round := models.Round{
		Answer: answer,
		Hints:  hints,
	}
	if err := r.db.Create(&round).Error; err != nil {
		return nil, err
	}
	return &round, nil
}
