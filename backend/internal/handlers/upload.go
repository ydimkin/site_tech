package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"technopark/pkg/response"

	"github.com/gin-gonic/gin"
)

const uploadDir = "./uploads"

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		response.BadRequest(c, "Файл не найден")
		return
	}

	if file.Size > 5<<20 {
		response.BadRequest(c, "Файл слишком большой (макс 5MB)")
		return
	}

	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		response.InternalError(c)
		return
	}

	dst := filepath.Join(uploadDir, filename)
	if err := c.SaveUploadedFile(file, dst); err != nil {
		response.InternalError(c)
		return
	}

	url := "/uploads/" + filename
	response.OK(c, gin.H{"url": url})
}
