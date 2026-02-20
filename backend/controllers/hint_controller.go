package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kc3hack/2026_team10/backend/dto"
	"github.com/kc3hack/2026_team10/backend/services"
)

type IHintController interface {
	StartGame(ctx *gin.Context)
	GetAnswer(ctx *gin.Context)
	CheckAnswer(ctx *gin.Context)
	GetFinishedRoundByID(ctx *gin.Context)
	BookmarkRound(ctx *gin.Context)
	GetRandomBookmark(ctx *gin.Context)
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
		} else if errors.Is(err, services.ErrRoundTooEarly) {
			ctx.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			_ = ctx.Error(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get answer"})
		}
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"answer": result})
}

func (c *HintController) CheckAnswer(ctx *gin.Context) {
	strID := ctx.Param("id")
	id, err := strconv.ParseUint(strID, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var input dto.CheckAnswerRequest
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := c.service.CheckAnswer(uint(id), input.Answer)
	if err != nil {
		if errors.Is(err, services.ErrRoundNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			_ = ctx.Error(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check answer"})
		}
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"isCorrect": result})
}

func (c *HintController) GetFinishedRoundByID(ctx *gin.Context) {
	strID := ctx.Param("id")
	id, err := strconv.ParseUint(strID, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	result, err := c.service.GetFinishedRoundByID(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrRoundNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if errors.Is(err, services.ErrRoundNotFinished) {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else {
			_ = ctx.Error(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get round"})
		}
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"round": result})
}

func (c *HintController) BookmarkRound(ctx *gin.Context) {
	strID := ctx.Param("id")
	id, err := strconv.ParseUint(strID, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	result, err := c.service.BookmarkRound(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrRoundNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else if errors.Is(err, services.ErrRoundNotFinished) {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else {
			_ = ctx.Error(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to bookmark round"})
		}
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"bookmark": result})
}

func (c *HintController) GetRandomBookmark(ctx *gin.Context) {
	result, err := c.service.GetRandomBookmark()
	if err != nil {
		if errors.Is(err, services.ErrBookmarkNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "No bookmarks available"})
		} else {
			_ = ctx.Error(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get random bookmark"})
		}
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"result": result})
}
