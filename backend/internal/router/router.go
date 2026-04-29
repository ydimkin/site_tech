package router

import (
	"strings"
	"technopark/internal/config"
	"technopark/internal/handlers"
	"technopark/internal/middleware"
	"technopark/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(db *gorm.DB, cfg *config.Config) *gin.Engine {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// CORS
	origins := strings.Split(cfg.CORS.Origins, ",")
	r.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Services
	authSvc := service.NewAuthService(db, cfg)
	courseSvc := service.NewCourseService(db)
	bookingSvc := service.NewBookingService(db)
	newsSvc := service.NewNewsService(db)
	teacherSvc := service.NewTeacherService(db)
	catSvc := service.NewCategoryService(db)
	contactSvc := service.NewContactService(db)
	reviewSvc := service.NewReviewService(db)
	statsSvc := service.NewStatsService(db)

	// Handlers
	authH := handlers.NewAuthHandler(authSvc)
	courseH := handlers.NewCourseHandler(courseSvc)
	bookingH := handlers.NewBookingHandler(bookingSvc)
	newsH := handlers.NewNewsHandler(newsSvc)
	teacherH := handlers.NewTeacherHandler(teacherSvc)
	catH := handlers.NewCategoryHandler(catSvc)
	contactH := handlers.NewContactHandler(contactSvc)
	reviewH := handlers.NewReviewHandler(reviewSvc)
	statsH := handlers.NewStatsHandler(statsSvc)

	authMW := middleware.Auth(cfg)
	adminMW := middleware.RequireRole("admin")
	teacherMW := middleware.RequireRole("admin", "teacher")

	api := r.Group("/api/v1")
	{
		// Auth
		auth := api.Group("/auth")
		{
			auth.POST("/register", authH.Register)
			auth.POST("/login", authH.Login)
			auth.GET("/me", authMW, authH.GetMe)
			auth.PUT("/me", authMW, authH.UpdateMe)
		}

		// Categories (public read)
		cats := api.Group("/categories")
		{
			cats.GET("", catH.List)
			cats.POST("", authMW, adminMW, catH.Create)
			cats.PUT("/:id", authMW, adminMW, catH.Update)
			cats.DELETE("/:id", authMW, adminMW, catH.Delete)
		}

		// Courses
		courses := api.Group("/courses")
		{
			courses.GET("", courseH.List)
			courses.GET("/featured", courseH.GetFeatured)
			courses.GET("/:id", courseH.GetByID)
			courses.POST("", authMW, teacherMW, courseH.Create)
			courses.PUT("/:id", authMW, teacherMW, courseH.Update)
			courses.DELETE("/:id", authMW, adminMW, courseH.Delete)
			// Reviews
			courses.GET("/:id/reviews", reviewH.GetByCourse)
			courses.POST("/:id/reviews", authMW, reviewH.Create)
		}

		// Teachers (public read)
		teachers := api.Group("/teachers")
		{
			teachers.GET("", teacherH.List)
			teachers.POST("", authMW, adminMW, teacherH.Create)
			teachers.PUT("/:id", authMW, adminMW, teacherH.Update)
			teachers.DELETE("/:id", authMW, adminMW, teacherH.Delete)
		}

		// News (public read)
		news := api.Group("/news")
		{
			news.GET("", newsH.List)
			news.GET("/:id", newsH.GetByID)
			news.POST("", authMW, adminMW, newsH.Create)
			news.PUT("/:id", authMW, adminMW, newsH.Update)
			news.DELETE("/:id", authMW, adminMW, newsH.Delete)
		}

		// Bookings (authenticated)
		bookings := api.Group("/bookings", authMW)
		{
			bookings.POST("", bookingH.Create)
			bookings.GET("", bookingH.MyBookings)
			bookings.GET("/:id", bookingH.GetByID)
			bookings.DELETE("/:id", bookingH.Cancel)
		}

		// Contact (public)
		api.POST("/contact", contactH.Create)

		// Admin routes
		admin := api.Group("/admin", authMW, adminMW)
		{
			admin.GET("/bookings", bookingH.AdminList)
			admin.PUT("/bookings/:id/status", bookingH.UpdateStatus)
			admin.GET("/users", authH.ListUsers)
			admin.PUT("/users/:id/toggle", authH.ToggleUserActive)
			admin.PUT("/users/:id/role", authH.ChangeRole)
			admin.GET("/contacts", contactH.AdminList)
			admin.PUT("/contacts/:id/read", contactH.MarkRead)
			admin.GET("/stats", statsH.GetStats)
		}
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	return r
}
