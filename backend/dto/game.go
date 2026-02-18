package dto

type StartGameResult struct {
	ID    uint     `json:"id"`
	Hints []string `json:"hints"`
}

type CheckAnswerRequest struct {
	Answer string `json:"answer" binding:"required"`
}
