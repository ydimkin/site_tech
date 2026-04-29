package main

import (
	"log"
	"technopark/internal/config"
	"technopark/internal/models"
	"technopark/internal/router"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	cfg := config.Load()

	// Connect to DataBase
	db, err := gorm.Open(postgres.Open(cfg.Database.DSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to DataBase: %v", err)
	}
	log.Println("✅ Connected to DataBase {PostgreSQL}")

	// Migrate models
	if err := db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Teacher{},
		&models.Course{},
		&models.Schedule{},
		&models.Group{},
		&models.Booking{},
		&models.TrialBooking{},
		&models.Review{},
		&models.News{},
		&models.GalleryItem{},
		&models.Document{},
		&models.ContactMessage{},
	); err != nil {
		log.Fatalf("Failed to migrate: %v", err)
	}
	log.Println("✅ Database migrated")

	// Setup and run HTTP server
	r := router.Setup(db, cfg)
	addr := ":" + cfg.AppPort
	log.Printf("🚀 Server started on http://localhost%s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
