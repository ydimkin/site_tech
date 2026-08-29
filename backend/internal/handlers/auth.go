package handlers

import (
	"technopark/internal/middleware"
	"technopark/internal/models"
	"technopark/internal/service"
	"technopark/pkg/response"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

type registerInput struct {
	Name     string `json:"name" binding:"required,min=2"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Phone    string `json:"phone"`
	ChildAge *int   `json:"child_age"`
}

type loginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input registerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	token, err := h.authService.Register(input.Name, input.Email, input.Password, input.Phone, input.ChildAge)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, gin.H{"token": token})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input loginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	token, err := h.authService.Login(input.Email, input.Password)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.OK(c, gin.H{"token": token})
}

func (h *AuthHandler) GetMe(c *gin.Context) {
	userID := middleware.GetUserID(c)
	user, err := h.authService.GetByID(userID)
	if err != nil {
		response.NotFound(c, "User not found")
		return
	}
	response.OK(c, user)
}

type updateProfileInput struct {
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	ChildAge  *int   `json:"child_age"`
	AvatarURL string `json:"avatar_url"`
}

func (h *AuthHandler) UpdateMe(c *gin.Context) {
	userID := middleware.GetUserID(c)
	var input updateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	user, err := h.authService.UpdateProfile(userID, input.Name, input.Phone, input.ChildAge, input.AvatarURL)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.OK(c, user)
}

func (h *AuthHandler) DeleteAvatar(c *gin.Context) {
	userID := middleware.GetUserID(c)
	user, err := h.authService.DeleteAvatar(userID)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, user)
}

func (h *AuthHandler) ListUsers(c *gin.Context) {
	users, err := h.authService.ListUsers()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, users)
}

func (h *AuthHandler) ToggleUserActive(c *gin.Context) {
	id := c.Param("id")
	user, err := h.authService.ToggleActive(id)
	if err != nil {
		response.NotFound(c, "User not found")
		return
	}
	response.OK(c, user)
}

type changeRoleInput struct {
	Role models.Role `json:"role" binding:"required"`
}

func (h *AuthHandler) ChangeRole(c *gin.Context) {
	id := c.Param("id")
	var input changeRoleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	user, err := h.authService.ChangeRole(id, input.Role)
	if err != nil {
		response.NotFound(c, "User not found")
		return
	}
	response.OK(c, user)
}
