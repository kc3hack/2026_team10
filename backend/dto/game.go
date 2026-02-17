package dto

type StartGameResult struct {
	ID    uint     `json:"id"`
	Hints []string `json:"hints"`
}
