package repositories

import (
	"errors"
	"math/rand"

	"github.com/kc3hack/2026_team10/backend/models"
	"gorm.io/gorm"
)

type IHintRepository interface {
	CreateRound(answers []string, hints []string) (*models.Round, error)
	GetRoundByID(id uint) (*models.Round, error)
	FinishRound(id uint) error
	BookmarkRound(id uint) error
	GetRandomBookmarkedRound() (*models.Round, error)
	GetAllBookmarkedRounds() ([]models.Round, error)
	GetRecentAnswers(limit int) ([]string, error)
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

func (r *HintRepository) BookmarkRound(id uint) error {
	result := r.db.Model(&models.Round{}).
		Where("id = ?", id).
		Update("is_bookmarked", true)
	return result.Error
}

func (r *HintRepository) GetRandomBookmarkedRound() (*models.Round, error) {
	var rounds []models.Round
	if err := r.db.Where("is_bookmarked = ?", true).Find(&rounds).Error; err != nil {
		return nil, err
	}
	if len(rounds) == 0 {
		return nil, nil
	}
	return &rounds[rand.Intn(len(rounds))], nil
}

func (r *HintRepository) GetAllBookmarkedRounds() ([]models.Round, error) {
	var rounds []models.Round
	if err := r.db.Where("is_bookmarked = ?", true).Find(&rounds).Error; err != nil {
		return nil, err
	}
	return rounds, nil
}

func (r *HintRepository) GetRecentAnswers(limit int) ([]string, error) {
	var rounds []models.Round
	if err := r.db.Order("created_at desc").Limit(limit).Find(&rounds).Error; err != nil {
		return nil, err
	}
	answers := make([]string, 0, len(rounds))
	for _, round := range rounds {
		if len(round.Answers) > 0 {
			answers = append(answers, round.Answers[0])
		}
	}
	return answers, nil
}
