package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppPort             string
	AppEnv              string
	Domain              string
	SessionLifetimeDays int
	Database            DatabaseConfig
	JWT                 JWTConfig
	CORS                CORSConfig
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type JWTConfig struct {
	Secret      string
	ExpiresHours int
}

type CORSConfig struct {
	Origins string
}

func (d DatabaseConfig) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s TimeZone=Europe/Moscow",
		d.Host, d.Port, d.User, d.Password, d.Name, d.SSLMode,
	)
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	return &Config{
		AppPort:             getEnv("APP_PORT", "8080"),
		AppEnv:              getEnv("APP_ENV", "development"),
		Domain:              getEnv("DOMAIN", "localhost"),
		SessionLifetimeDays: getEnvInt("SESSION_LIFETIME_DAYS", 2),
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Name:     getEnv("DB_NAME", "technopark_db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		JWT: JWTConfig{
			Secret:      getEnv("JWT_SECRET", "secret"),
			ExpiresHours: getEnvInt("JWT_EXPIRES_HOURS", 168),
		},
		CORS: CORSConfig{
			Origins: getEnv("CORS_ORIGINS", "http://localhost:5173"),
		},
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if val, ok := os.LookupEnv(key); ok {
		var i int
		if _, err := fmt.Sscanf(val, "%d", &i); err == nil {
			return i
		}
	}
	return fallback
}
