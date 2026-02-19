package models

import "gorm.io/gorm"

type Round struct {
	gorm.Model
	Answers []string `gorm:"serializer:json;not null"`
	Hints   []string `gorm:"serializer:json;not null"` // ヒントはJSON形式で保存
}
