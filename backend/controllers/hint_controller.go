package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team10/backend/services"
)

type IHintController interface {
	StartGame(ctx *gin.Context)
	StartGame_AI(ctx *gin.Context)
	CheckAnswer(ctx *gin.Context)
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

func (c *HintController) CheckAnswer(ctx *gin.Context) {
	// ユーザーからのリクエストを受け取るための構造体
	var input struct {
		RoundID uint   `json:"round_id"`
		Answer  string `json:"answer"`
	}

	// JSONのパース
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// サービス層の呼び出し
	isCorrect, err := c.service.CheckAnswer(input.RoundID, input.Answer)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// 結果（true/false）を返す
	ctx.JSON(http.StatusOK, gin.H{"correct": isCorrect})
}
