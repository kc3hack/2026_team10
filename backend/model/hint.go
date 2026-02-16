package model

type Round struct {
	ID     int
	Answer string
	Hints  []string
}

type StartGameResult struct {
	ID    int      `json:"id"`
	Hints []string `json:"hints"`
}
