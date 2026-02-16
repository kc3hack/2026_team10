package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team10/backend/services"
)

type IHintController interface {
	StartGame(ctx *gin.Context)
}

type HintController struct {
	service services.IHintService
}

func NewHintController(service services.IHintService) IHintController {
	return &HintController{service: service}
}

func (c *HintController) StartGame(ctx *gin.Context) {
	result, err := c.service.StartGame()
	if err != nil {
		_ = ctx.Error(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start game"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"result": result})
}
