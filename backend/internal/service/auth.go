package service

import (
	"errors"
	"technopark/internal/config"
	"technopark/internal/models"
	pkgjwt "technopark/pkg/jwt"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	db  *gorm.DB
	cfg *config.Config
}

func NewAuthService(db *gorm.DB, cfg *config.Config) *AuthService {
	return &AuthService{db: db, cfg: cfg}
}

func (s *AuthService) Register(name, email, password, phone string, childAge *int) (string, error) {
	var existing models.User
	if err := s.db.Where("email = ?", email).First(&existing).Error; err == nil {
		return "", errors.New("email already registered")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	user := models.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
		Phone:        phone,
		ChildAge:     childAge,
		Role:         models.RoleStudent,
	}
	if err := s.db.Create(&user).Error; err != nil {
		return "", err
	}
	return pkgjwt.Generate(user.ID, user.Email, string(user.Role), s.cfg.JWT.Secret, s.cfg.JWT.ExpiresHours)
}

func (s *AuthService) Login(email, password string) (string, error) {
	var user models.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return "", errors.New("invalid credentials")
	}
	if !user.IsActive {
		return "", errors.New("account is blocked")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}
	return pkgjwt.Generate(user.ID, user.Email, string(user.Role), s.cfg.JWT.Secret, s.cfg.JWT.ExpiresHours)
}

func (s *AuthService) GetByID(id uint) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *AuthService) UpdateProfile(id uint, name, phone string, childAge *int, avatarURL string) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	if name != "" {
		user.Name = name
	}
	if phone != "" {
		user.Phone = phone
	}
	user.ChildAge = childAge
	if avatarURL != "" {
		user.AvatarURL = avatarURL
	}
	if err := s.db.Save(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *AuthService) DeleteAvatar(id uint) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	user.AvatarURL = ""
	if err := s.db.Save(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *AuthService) ListUsers() ([]models.User, error) {
	var users []models.User
	err := s.db.Order("created_at desc").Find(&users).Error
	return users, err
}

func (s *AuthService) ToggleActive(idStr string) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, idStr).Error; err != nil {
		return nil, err
	}
	user.IsActive = !user.IsActive
	s.db.Save(&user)
	return &user, nil
}

func (s *AuthService) ChangeRole(idStr string, role models.Role) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, idStr).Error; err != nil {
		return nil, err
	}
	user.Role = role
	s.db.Save(&user)
	return &user, nil
}
