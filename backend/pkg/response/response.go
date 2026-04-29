package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

type PaginatedResponse struct {
	Success    bool        `json:"success"`
	Data       interface{} `json:"data"`
	Total      int64       `json:"total"`
	Page       int         `json:"page"`
	PageSize   int         `json:"page_size"`
	TotalPages int         `json:"total_pages"`
}

func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
	})
}

func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, Response{
		Success: true,
		Data:    data,
	})
}

func OKMessage(c *gin.Context, msg string) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Message: msg,
	})
}

func Paginated(c *gin.Context, data interface{}, total int64, page, pageSize int) {
	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPages++
	}
	c.JSON(http.StatusOK, PaginatedResponse{
		Success:    true,
		Data:       data,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	})
}

func BadRequest(c *gin.Context, msg string) {
	c.JSON(http.StatusBadRequest, Response{
		Success: false,
		Message: msg,
	})
}

func Unauthorized(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, Response{
		Success: false,
		Message: "Unauthorized",
	})
}

func Forbidden(c *gin.Context) {
	c.JSON(http.StatusForbidden, Response{
		Success: false,
		Message: "Access denied",
	})
}

func NotFound(c *gin.Context, msg string) {
	c.JSON(http.StatusNotFound, Response{
		Success: false,
		Message: msg,
	})
}

func InternalError(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, Response{
		Success: false,
		Message: "Internal server error",
	})
}
