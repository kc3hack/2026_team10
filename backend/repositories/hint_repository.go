package repositories

import (
	"errors"

	"github.com/kc3hack/2026_team10/backend/models"
	"gorm.io/gorm"
)

type IHintRepository interface {
	CreateRound(answer string, hints []string) (*models.Round, error)
	FindById(roundId uint) (*models.Round, error)
}

type HintMemoryRepository struct {
	rounds []models.Round
}

// func NewHintMemoryRepository(rounds []models.Round) IHintRepository {
// 	return &HintMemoryRepository{rounds: rounds}
// }

func (r *HintMemoryRepository) CreateRound(answer string, hints []string) (*models.Round, error) {
	var maxID uint
	for _, rd := range r.rounds {
		if rd.ID > maxID {
			maxID = rd.ID
		}
	}
	newID := maxID + 1
	round := models.Round{
		Answer: answer,
		Hints:  hints,
	}
	round.ID = newID
	r.rounds = append(r.rounds, round)
	return &r.rounds[len(r.rounds)-1], nil
}

func (r *HintRepository) FindById(roundId uint) (*models.Round, error) {
	var round models.Round
	// DBから指定されたIDのレコードを1件取得する
	result := r.db.First(&round, roundId)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("Round not found")
		}
		return nil, result.Error
	}
	return &round, nil
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

// func (r *HintMemoryRepository) FindById(roundId uint) (*models.Round, error) {
// 	for _, v := range r.rounds {
// 		if v.ID == roundId {
// 			return &v, nil
// 		}
// 	}
// 	return nil, errors.New("Item not found")
// }
