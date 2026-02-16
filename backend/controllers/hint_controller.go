package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team10/backend/services"
)

type IHintController interface {
	GetHints(ctx *gin.Context)
}

type HintController struct {
	service services.IHintService
}

func NewHintController(service services.IHintService) IHintController {
	return &HintController{service: service}
}

func (c *HintController) GetHints(ctx *gin.Context) {
	result, err := c.service.GetHints()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get hints"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"result": result})
}
