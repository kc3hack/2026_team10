package repositories

import (
	"errors"

	"github.com/kc3hack/2026_team10/backend/models"
	"gorm.io/gorm"
)

type IHintRepository interface {
	CreateRound(answers []string, hints []string) (*models.Round, error)
	GetRoundByID(id uint) (*models.Round, error)
	FinishRound(id uint) error
}

type HintRepository struct {
	db *gorm.DB
}

func NewHintRepository(db *gorm.DB) IHintRepository {
	return &HintRepository{db: db}
}

func (r *HintRepository) CreateRound(answers []string, hints []string) (*models.Round, error) {
	round := models.Round{
		Answers: answers,
		Hints:   hints,
	}
	if err := r.db.Create(&round).Error; err != nil {
		return nil, err
	}
	return &round, nil
}

func (r *HintRepository) GetRoundByID(id uint) (*models.Round, error) {
	var round models.Round
	if err := r.db.First(&round, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // レコードが見つからない場合はnilを返す
		}
		return nil, err
	}
	return &round, nil
}

func (r *HintRepository) FinishRound(id uint) error {
	result := r.db.Model(&models.Round{}).
		Where("id = ?", id).
		Update("is_finished", true)
	return result.Error
}
