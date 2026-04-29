package service

import (
	"time"
	"technopark/internal/models"

	"gorm.io/gorm"
)

// NewsService
type NewsService struct{ db *gorm.DB }

func NewNewsService(db *gorm.DB) *NewsService { return &NewsService{db: db} }

func (s *NewsService) List(page, pageSize int) ([]models.News, int64, error) {
	var news []models.News
	query := s.db.Model(&models.News{}).Where("is_published = ?", true)
	var total int64
	query.Count(&total)
	err := query.Order("published_at desc").Offset((page-1)*pageSize).Limit(pageSize).Find(&news).Error
	return news, total, err
}

func (s *NewsService) GetByID(id uint) (*models.News, error) {
	var n models.News
	err := s.db.First(&n, id).Error
	return &n, err
}

func (s *NewsService) Create(title, content, preview, imageURL string, published bool) (*models.News, error) {
	var pubAt *time.Time
	if published {
		now := time.Now()
		pubAt = &now
	}
	n := models.News{Title: title, Content: content, Preview: preview, ImageURL: imageURL, IsPublished: published, PublishedAt: pubAt}
	err := s.db.Create(&n).Error
	return &n, err
}

func (s *NewsService) Update(id uint, title, content, preview, imageURL string, published bool) (*models.News, error) {
	var n models.News
	if err := s.db.First(&n, id).Error; err != nil {
		return nil, err
	}
	n.Title = title
	n.Content = content
	n.Preview = preview
	n.ImageURL = imageURL
	n.IsPublished = published
	if published && n.PublishedAt == nil {
		now := time.Now()
		n.PublishedAt = &now
	}
	s.db.Save(&n)
	return &n, nil
}

func (s *NewsService) Delete(id uint) error { return s.db.Delete(&models.News{}, id).Error }

// TeacherService
type TeacherService struct{ db *gorm.DB }

func NewTeacherService(db *gorm.DB) *TeacherService { return &TeacherService{db: db} }

func (s *TeacherService) List() ([]models.Teacher, error) {
	var teachers []models.Teacher
	err := s.db.Where("is_active = ?", true).Order("created_at asc").Find(&teachers).Error
	return teachers, err
}

func (s *TeacherService) Create(name, position, desc, photo string, exp int, subjects string) (*models.Teacher, error) {
	t := models.Teacher{Name: name, Position: position, Description: desc, PhotoURL: photo, Experience: exp, Subjects: subjects}
	err := s.db.Create(&t).Error
	return &t, err
}

func (s *TeacherService) Update(id uint, name, position, desc, photo string, exp int, subjects string) (*models.Teacher, error) {
	var t models.Teacher
	if err := s.db.First(&t, id).Error; err != nil {
		return nil, err
	}
	t.Name = name
	t.Position = position
	t.Description = desc
	t.PhotoURL = photo
	t.Experience = exp
	t.Subjects = subjects
	s.db.Save(&t)
	return &t, nil
}

func (s *TeacherService) Delete(id uint) error { return s.db.Delete(&models.Teacher{}, id).Error }

// CategoryService
type CategoryService struct{ db *gorm.DB }

func NewCategoryService(db *gorm.DB) *CategoryService { return &CategoryService{db: db} }

func (s *CategoryService) List() ([]models.Category, error) {
	var cats []models.Category
	err := s.db.Find(&cats).Error
	return cats, err
}

func (s *CategoryService) Create(name, icon, color string) (*models.Category, error) {
	c := models.Category{Name: name, Icon: icon, Color: color}
	err := s.db.Create(&c).Error
	return &c, err
}

func (s *CategoryService) Update(id uint, name, icon, color string) (*models.Category, error) {
	var c models.Category
	if err := s.db.First(&c, id).Error; err != nil {
		return nil, err
	}
	c.Name = name
	c.Icon = icon
	c.Color = color
	s.db.Save(&c)
	return &c, nil
}

func (s *CategoryService) Delete(id uint) error { return s.db.Delete(&models.Category{}, id).Error }

// ContactService
type ContactService struct{ db *gorm.DB }

func NewContactService(db *gorm.DB) *ContactService { return &ContactService{db: db} }

func (s *ContactService) Create(name, email, phone, subject, message string) (*models.ContactMessage, error) {
	m := models.ContactMessage{Name: name, Email: email, Phone: phone, Subject: subject, Message: message}
	err := s.db.Create(&m).Error
	return &m, err
}

func (s *ContactService) List() ([]models.ContactMessage, error) {
	var msgs []models.ContactMessage
	err := s.db.Order("created_at desc").Find(&msgs).Error
	return msgs, err
}

func (s *ContactService) MarkRead(id uint) error {
	return s.db.Model(&models.ContactMessage{}).Where("id = ?", id).Update("is_read", true).Error
}

// ReviewService
type ReviewService struct{ db *gorm.DB }

func NewReviewService(db *gorm.DB) *ReviewService { return &ReviewService{db: db} }

func (s *ReviewService) GetByCourse(courseID uint) ([]models.Review, error) {
	var reviews []models.Review
	err := s.db.Preload("User").Where("course_id = ?", courseID).Order("created_at desc").Find(&reviews).Error
	return reviews, err
}

func (s *ReviewService) Create(userID, courseID uint, rating int, text string) (*models.Review, error) {
	r := models.Review{UserID: userID, CourseID: courseID, Rating: rating, Text: text}
	err := s.db.Create(&r).Error
	return &r, err
}

// StatsService
type StatsService struct{ db *gorm.DB }

func NewStatsService(db *gorm.DB) *StatsService { return &StatsService{db: db} }

type DashboardStats struct {
	TotalCourses   int64              `json:"total_courses"`
	TotalStudents  int64              `json:"total_students"`
	TotalBookings  int64              `json:"total_bookings"`
	PendingBookings int64             `json:"pending_bookings"`
	TotalNews      int64              `json:"total_news"`
	MonthlyBookings []MonthlyBooking  `json:"monthly_bookings"`
	TopCourses     []TopCourse        `json:"top_courses"`
}

type MonthlyBooking struct {
	Month string `json:"month"`
	Count int64  `json:"count"`
}

type TopCourse struct {
	CourseTitle string `json:"course_title"`
	Bookings    int64  `json:"bookings"`
}

func (s *StatsService) GetStats() (*DashboardStats, error) {
	stats := &DashboardStats{}
	s.db.Model(&models.Course{}).Where("is_active = ?", true).Count(&stats.TotalCourses)
	s.db.Model(&models.User{}).Where("role = ?", models.RoleStudent).Count(&stats.TotalStudents)
	s.db.Model(&models.Booking{}).Count(&stats.TotalBookings)
	s.db.Model(&models.Booking{}).Where("status = ?", models.BookingPending).Count(&stats.PendingBookings)
	s.db.Model(&models.News{}).Count(&stats.TotalNews)

	// Monthly bookings for last 6 months
	s.db.Raw(`
		SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
		FROM bookings
		WHERE created_at >= NOW() - INTERVAL '6 months'
		GROUP BY month ORDER BY month
	`).Scan(&stats.MonthlyBookings)

	// Top courses
	s.db.Raw(`
		SELECT c.title as course_title, COUNT(b.id) as bookings
		FROM bookings b
		JOIN groups g ON b.group_id = g.id
		JOIN courses c ON g.course_id = c.id
		GROUP BY c.title ORDER BY bookings DESC LIMIT 5
	`).Scan(&stats.TopCourses)

	return stats, nil
}
