package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team10/backend/controllers"
	"github.com/kc3hack/2026_team10/backend/infra"
	"github.com/kc3hack/2026_team10/backend/models"
	"github.com/kc3hack/2026_team10/backend/repositories"
	"github.com/kc3hack/2026_team10/backend/services"
)

func main() {
	db := infra.SetupDB()
	if err := db.AutoMigrate(&models.Round{}); err != nil {
		panic(fmt.Sprintf("Failed to migrate database: %v", err))
	}
	hintRepository := repositories.NewHintRepository(db)
	hintService := services.NewHintService(hintRepository)
	hintController := controllers.NewHintController(hintService)

	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.POST("/solo", hintController.StartGame)
	r.GET("/solo/:id/answer", hintController.GetAnswer)
	r.POST("/solo/:id/answer", hintController.CheckAnswer)
	r.GET("/solo/board/:id", hintController.GetFinishedRoundByID)
	r.POST("/solo/:id/bookmark", hintController.BookmarkRound)
	r.Run() // デフォルトで0.0.0.0:8080で待機します
}
