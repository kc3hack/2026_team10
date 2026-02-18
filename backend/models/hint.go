package models

import "gorm.io/gorm"

type Round struct {
	gorm.Model
	Answers    []string `gorm:"serializer:json;not null"` // 答えはJSON形式で保存
	Hints      []string `gorm:"serializer:json;not null"` // ヒントはJSON形式で保存
	IsFinished bool     `gorm:"not null;default:false"`
}
