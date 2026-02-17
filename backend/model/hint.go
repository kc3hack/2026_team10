package model

import "gorm.io/gorm"

type Round struct {
	gorm.Model
	Answer string   `gorm:"not null"`
	Hints  []string `gorm:"serializer:json;not null"` // ヒントはJSON形式で保存
}

type StartGameResult struct {
	ID    uint     `json:"id"`
	Hints []string `json:"hints"`
}
