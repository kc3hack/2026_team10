package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/kc3hack/2026_team10/backend/controllers"
	"github.com/kc3hack/2026_team10/backend/infra"
	"github.com/kc3hack/2026_team10/backend/models"
	"github.com/kc3hack/2026_team10/backend/repositories"
	"github.com/kc3hack/2026_team10/backend/services"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	db := infra.SetupDB()
	if err := db.AutoMigrate(&models.Round{}); err != nil {
		panic(fmt.Sprintf("Failed to migrate database: %v", err))
	}
	hintRepository := repositories.NewHintRepository(db)
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
	r.POST("/db/read", hintController.CheckAnswer)
	r.Run() // デフォルトで0.0.0.0:8080で待機します
}
