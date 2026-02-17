package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/kc3hack/2026_team10/backend/controllers"
	"github.com/kc3hack/2026_team10/backend/model"
	"github.com/kc3hack/2026_team10/backend/repositories"
	"github.com/kc3hack/2026_team10/backend/services"
)

func main() {
	godotenv.Load()
	rounds := []model.Round{}

	hintRepository := repositories.NewHintMemoryRepository(rounds)
	hintService := services.NewHintService(hintRepository)
	hintController := controllers.NewHintController(hintService)

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.POST("/solo", hintController.StartGame)
	r.POST("/solo/ai", hintController.StartGame_AI)
	r.Run() // デフォルトで0.0.0.0:8080で待機します
}
