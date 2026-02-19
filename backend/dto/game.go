package dto

import "time"

type RoundResponse struct {
	ID        uint      `json:"id"`
	Answer    string    `json:"answer"`
	Hints     []string  `json:"hints"`
	UpdatedAt time.Time `json:"updated_at"`
}

type StartGameResult struct {
	ID    uint     `json:"id"`
	Hints []string `json:"hints"`
}

type CheckAnswerRequest struct {
	Answer string `json:"answer" binding:"required"`
}
