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

	origins := strings.Split(cfg.CORS.Origins, ",")
	r.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	authSvc := service.NewAuthService(db, cfg)
	courseSvc := service.NewCourseService(db)
	bookingSvc := service.NewBookingService(db)
	newsSvc := service.NewNewsService(db)
	teacherSvc := service.NewTeacherService(db)
	catSvc := service.NewCategoryService(db)
	contactSvc := service.NewContactService(db)
	reviewSvc := service.NewReviewService(db)
	statsSvc := service.NewStatsService(db)
	scheduleSvc := service.NewScheduleService(db)
	docSvc := service.NewDocumentService(db)

	authH := handlers.NewAuthHandler(authSvc)
	courseH := handlers.NewCourseHandler(courseSvc)
	bookingH := handlers.NewBookingHandler(bookingSvc)
	newsH := handlers.NewNewsHandler(newsSvc)
	teacherH := handlers.NewTeacherHandler(teacherSvc)
	catH := handlers.NewCategoryHandler(catSvc)
	contactH := handlers.NewContactHandler(contactSvc)
	reviewH := handlers.NewReviewHandler(reviewSvc)
	statsH := handlers.NewStatsHandler(statsSvc)
	scheduleH := handlers.NewScheduleHandler(scheduleSvc)
	docH := handlers.NewDocumentHandler(docSvc)

	authMW := middleware.Auth(cfg)
	adminMW := middleware.RequireRole("admin")
	teacherMW := middleware.RequireRole("admin", "teacher")

	api := r.Group("/api/v1")
	{
		registerAuthRoutes(api, authH, authMW)
		registerCategoryRoutes(api, catH, authMW, adminMW)
		registerCourseRoutes(api, courseH, reviewH, authMW, teacherMW, adminMW)
		registerTeacherRoutes(api, teacherH, authMW, adminMW)
		registerNewsRoutes(api, newsH, authMW, adminMW)
		registerBookingRoutes(api, bookingH, authMW)
		
		api.POST("/contact", contactH.Create)
		api.GET("/schedules", scheduleH.List)

		registerScheduleRoutes(api, scheduleH, authMW, adminMW)
		registerAdminRoutes(api, authH, bookingH, contactH, statsH, authMW, adminMW)
		registerDocumentRoutes(api, docH, authMW, adminMW)
	}

	api.POST("/upload", authMW, handlers.UploadFile)

	r.Static("/uploads", "./uploads")

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	return r
}

func registerAuthRoutes(rg *gin.RouterGroup, h *handlers.AuthHandler, authMW gin.HandlerFunc) {
	auth := rg.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.GET("/me", authMW, h.GetMe)
		auth.PUT("/me", authMW, h.UpdateMe)
		auth.DELETE("/me/avatar", authMW, h.DeleteAvatar)
	}
}

func registerCategoryRoutes(rg *gin.RouterGroup, h *handlers.CategoryHandler, authMW, adminMW gin.HandlerFunc) {
	cats := rg.Group("/categories")
	{
		cats.GET("", h.List)
		cats.POST("", authMW, adminMW, h.Create)
		cats.PUT("/:id", authMW, adminMW, h.Update)
		cats.DELETE("/:id", authMW, adminMW, h.Delete)
	}
}

func registerCourseRoutes(rg *gin.RouterGroup, h *handlers.CourseHandler, reviewH *handlers.ReviewHandler, authMW, teacherMW, adminMW gin.HandlerFunc) {
	courses := rg.Group("/courses")
	{
		courses.GET("", h.List)
		courses.GET("/featured", h.GetFeatured)
		courses.GET("/:id", h.GetByID)
		courses.POST("", authMW, teacherMW, h.Create)
		courses.PUT("/:id", authMW, teacherMW, h.Update)
		courses.DELETE("/:id", authMW, adminMW, h.Delete)
		courses.GET("/:id/reviews", reviewH.GetByCourse)
		courses.POST("/:id/reviews", authMW, reviewH.Create)
	}
}

func registerTeacherRoutes(rg *gin.RouterGroup, h *handlers.TeacherHandler, authMW, adminMW gin.HandlerFunc) {
	teachers := rg.Group("/teachers")
	{
		teachers.GET("", h.List)
		teachers.POST("", authMW, adminMW, h.Create)
		teachers.PUT("/:id", authMW, adminMW, h.Update)
		teachers.DELETE("/:id", authMW, adminMW, h.Delete)
	}
}

func registerNewsRoutes(rg *gin.RouterGroup, h *handlers.NewsHandler, authMW, adminMW gin.HandlerFunc) {
	news := rg.Group("/news")
	{
		news.GET("", h.List)
		news.GET("/:id", h.GetByID)
		news.POST("", authMW, adminMW, h.Create)
		news.PUT("/:id", authMW, adminMW, h.Update)
		news.DELETE("/:id", authMW, adminMW, h.Delete)
	}
}

func registerBookingRoutes(rg *gin.RouterGroup, h *handlers.BookingHandler, authMW gin.HandlerFunc) {
	bookings := rg.Group("/bookings", authMW)
	{
		bookings.POST("", h.Create)
		bookings.GET("", h.MyBookings)
		bookings.GET("/:id", h.GetByID)
		bookings.DELETE("/:id", h.Cancel)
	}
}

func registerAdminRoutes(rg *gin.RouterGroup, authH *handlers.AuthHandler, bookingH *handlers.BookingHandler, contactH *handlers.ContactHandler, statsH *handlers.StatsHandler, authMW, adminMW gin.HandlerFunc) {
	admin := rg.Group("/admin", authMW, adminMW)
	{
		admin.GET("/bookings", bookingH.AdminList)
		admin.PUT("/bookings/:id/status", bookingH.UpdateStatus)
		admin.GET("/users", authH.ListUsers)
		admin.PUT("/users/:id/toggle", authH.ToggleUserActive)
		admin.PUT("/users/:id/role", authH.ChangeRole)
		admin.GET("/contacts", contactH.AdminList)
		admin.PUT("/contacts/:id/read", contactH.MarkRead)
		admin.DELETE("/contacts/:id", contactH.Delete)
		admin.GET("/stats", statsH.GetStats)
	}
}

func registerScheduleRoutes(rg *gin.RouterGroup, h *handlers.ScheduleHandler, authMW, adminMW gin.HandlerFunc) {
	schedules := rg.Group("/schedules")
	{
		schedules.GET("/admin", authMW, adminMW, h.AdminList)
		schedules.POST("", authMW, adminMW, h.Create)
		schedules.PUT("/:id", authMW, adminMW, h.Update)
		schedules.DELETE("/:id", authMW, adminMW, h.Delete)
	}
}

func registerDocumentRoutes(rg *gin.RouterGroup, h *handlers.DocumentHandler, authMW, adminMW gin.HandlerFunc) {
	rg.GET("/documents", h.List)
	
	admin := rg.Group("/admin/documents", authMW, adminMW)
	{
		admin.POST("", h.Create)
		admin.DELETE("/:id", h.Delete)
	}
}
