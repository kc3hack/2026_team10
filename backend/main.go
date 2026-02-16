package main

import (
	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team10/backend/controllers"
	"github.com/kc3hack/2026_team10/backend/model"
	"github.com/kc3hack/2026_team10/backend/repositories"
	"github.com/kc3hack/2026_team10/backend/services"
)

func main() {
	rounds := []model.Round{
		{
			ID:     1,
			Answer: "お題",
			Hints:  []string{"ヒント1", "ヒント2", "ヒント3"},
		},
	}

	hintRepository := repositories.NewHintMemoryRepository(rounds)
	hintService := services.NewHintService(hintRepository)
	hintController := controllers.NewHintController(hintService)

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.POST("/solo", hintController.GetHints)
	r.Run() // デフォルトで0.0.0.0:8080で待機します
}
