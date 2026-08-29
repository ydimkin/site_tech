package main

import (
	"log/slog"
	"os"
	"technopark/internal/config"
	"technopark/internal/models"
	"technopark/internal/router"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	cfg := config.Load()

	var handler slog.Handler
	handler = slog.NewJSONHandler(os.Stdout, nil)
	if cfg.AppEnv != "production" {
		handler = slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug})
	}
	logger_slog := slog.New(handler)
	slog.SetDefault(logger_slog)

	db, err := gorm.Open(postgres.Open(cfg.Database.DSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		slog.Error("Failed to connect to DataBase", "error", err)
		os.Exit(1)
	}
	slog.Info("Connected to DataBase")

	if err := db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Teacher{},
		&models.Course{},
		&models.Schedule{},
		&models.Group{},
		&models.Booking{},
		&models.Review{},
		&models.News{},
		&models.Document{},
		&models.ContactMessage{},
	); err != nil {
		slog.Error("Failed to migrate", "error", err)
		os.Exit(1)
	}
	slog.Info("Database migrated")

	var schedules []models.Schedule
	db.Find(&schedules)
	for _, sch := range schedules {
		var count int64
		db.Model(&models.Group{}).Where("schedule_id = ?", sch.ID).Count(&count)
		if count == 0 {
			now := time.Now()
			grp := models.Group{
				CourseID:   sch.CourseID,
				ScheduleID: sch.ID,
				StartDate:  now,
				EndDate:    now.AddDate(1, 0, 0),
				Capacity:   sch.Capacity,
				IsActive:   true,
			}
			db.Create(&grp)
		}
	}
	slog.Info("Schedules synced with groups")

	r := router.Setup(db, cfg)
	addr := ":" + cfg.AppPort
	slog.Info("Server started", "address", "http://localhost"+addr)
	if err := r.Run(addr); err != nil {
		slog.Error("Server error", "error", err)
		os.Exit(1)
	}
}
