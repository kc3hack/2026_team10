package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team10/backend/services"
)

type IHintController interface {
	StartGame(ctx *gin.Context)
	StartGame_AI(ctx *gin.Context)
	GetAnswer(ctx *gin.Context)
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

func (c *HintController) StartGame_AI(ctx *gin.Context) {
	result, err := c.service.StartGame_AI()
	if err != nil {
		_ = ctx.Error(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"result": result})
}

func (c *HintController) GetAnswer(ctx *gin.Context) {
	strID := ctx.Param("id")
	id, err := strconv.ParseUint(strID, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	result, err := c.service.GetAnswer(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrRoundNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			_ = ctx.Error(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get answer"})
		}
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"answer": result})
}
