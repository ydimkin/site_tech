package middleware

import (
	"strings"
	"technopark/internal/config"
	pkgjwt "technopark/pkg/jwt"
	"technopark/pkg/response"

	"github.com/gin-gonic/gin"
)

const UserIDKey = "user_id"
const UserRoleKey = "user_role"
const UserEmailKey = "user_email"

func Auth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			response.Unauthorized(c)
			c.Abort()
			return
		}
		tokenStr := strings.TrimPrefix(header, "Bearer ")
		claims, err := pkgjwt.Parse(tokenStr, cfg.JWT.Secret)
		if err != nil {
			response.Unauthorized(c)
			c.Abort()
			return
		}
		c.Set(UserIDKey, claims.UserID)
		c.Set(UserRoleKey, claims.Role)
		c.Set(UserEmailKey, claims.Email)
		c.Next()
	}
}

func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, _ := c.Get(UserRoleKey)
		roleStr, _ := role.(string)
		for _, r := range roles {
			if r == roleStr {
				c.Next()
				return
			}
		}
		response.Forbidden(c)
		c.Abort()
	}
}

func GetUserID(c *gin.Context) uint {
	id, _ := c.Get(UserIDKey)
	uid, _ := id.(uint)
	return uid
}
