package service

import (
	"time"
	"technopark/internal/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

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

func (s *NewsService) Create(title, content, preview, imageURL string, images []string, published bool) (*models.News, error) {
	var pubAt *time.Time
	if published {
		now := time.Now()
		pubAt = &now
	}
	if images == nil {
		images = []string{}
	}
	n := models.News{Title: title, Content: content, Preview: preview, ImageURL: imageURL, Images: images, IsPublished: published, PublishedAt: pubAt}
	err := s.db.Create(&n).Error
	return &n, err
}

func (s *NewsService) Update(id uint, title, content, preview, imageURL string, images []string, published bool) (*models.News, error) {
	var n models.News
	if err := s.db.First(&n, id).Error; err != nil {
		return nil, err
	}
	n.Title = title
	n.Content = content
	n.Preview = preview
	n.ImageURL = imageURL
	if images == nil {
		images = []string{}
	}
	n.Images = images
	n.IsPublished = published
	if published && n.PublishedAt == nil {
		now := time.Now()
		n.PublishedAt = &now
	}
	s.db.Save(&n)
	return &n, nil
}

func (s *NewsService) Delete(id uint) error { return s.db.Delete(&models.News{}, id).Error }


type TeacherService struct{ db *gorm.DB }

func NewTeacherService(db *gorm.DB) *TeacherService { return &TeacherService{db: db} }

func (s *TeacherService) List() ([]models.Teacher, error) {
	var teachers []models.Teacher
	err := s.db.Where("is_active = ?", true).Order("created_at asc").Find(&teachers).Error
	return teachers, err
}

func (s *TeacherService) Create(name, position, desc, photo string, exp int, subjects, email, password string) (*models.Teacher, error) {
	err := s.db.Transaction(func(tx *gorm.DB) error {
		t := models.Teacher{Name: name, Position: position, Description: desc, PhotoURL: photo, Experience: exp, Subjects: subjects}
		if err := tx.Create(&t).Error; err != nil {
			return err
		}
		if email != "" && password != "" {
			hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			user := models.User{
				Name:         name,
				Email:        email,
				PasswordHash: string(hashed),
				Role:         models.RoleTeacher,
				IsActive:     true,
			}
			if err := tx.Create(&user).Error; err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	var t models.Teacher
	s.db.Where("name = ? AND position = ?", name, position).Order("id desc").First(&t)
	return &t, nil
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

func (s *ContactService) Delete(id uint) error {
	return s.db.Delete(&models.ContactMessage{}, id).Error
}

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

type DocumentService struct{ db *gorm.DB }

func NewDocumentService(db *gorm.DB) *DocumentService { return &DocumentService{db: db} }

func (s *DocumentService) List() ([]models.Document, error) {
	var docs []models.Document
	err := s.db.Order("created_at desc").Find(&docs).Error
	return docs, err
}

func (s *DocumentService) Create(title, fileURL, category string) (*models.Document, error) {
	d := models.Document{Title: title, FileURL: fileURL, Category: category}
	err := s.db.Create(&d).Error
	return &d, err
}

func (s *DocumentService) Delete(id uint) error {
	return s.db.Delete(&models.Document{}, id).Error
}


type ScheduleService struct{ db *gorm.DB }

func NewScheduleService(db *gorm.DB) *ScheduleService { return &ScheduleService{db: db} }

func (s *ScheduleService) List() ([]models.Schedule, error) {
	var schedules []models.Schedule
	err := s.db.Preload("Course").Preload("Course.Category").Preload("Course.Teacher").
		Where("course_id IN (SELECT id FROM courses WHERE is_active = ? AND deleted_at IS NULL)", true).
		Order("weekday, time_start").Find(&schedules).Error
	return schedules, err
}

func (s *ScheduleService) AdminList() ([]models.Schedule, error) {
	var schedules []models.Schedule
	err := s.db.Preload("Course").Order("weekday, time_start").Find(&schedules).Error
	return schedules, err
}

func (s *ScheduleService) Create(courseID uint, weekday, timeStart, timeEnd string, capacity int) (*models.Schedule, error) {
	sch := models.Schedule{CourseID: courseID, Weekday: weekday, TimeStart: timeStart, TimeEnd: timeEnd, Capacity: capacity}
	if err := s.db.Create(&sch).Error; err != nil {
		return nil, err
	}
	
	now := time.Now()
	grp := models.Group{
		CourseID:   courseID,
		ScheduleID: sch.ID,
		StartDate:  now,
		EndDate:    now.AddDate(1, 0, 0),
		Capacity:   capacity,
		IsActive:   true,
	}
	s.db.Create(&grp)
	
	s.db.Preload("Course").First(&sch, sch.ID)
	return &sch, nil
}

func (s *ScheduleService) Update(id uint, courseID uint, weekday, timeStart, timeEnd string, capacity int) (*models.Schedule, error) {
	var sch models.Schedule
	if err := s.db.First(&sch, id).Error; err != nil {
		return nil, err
	}
	sch.CourseID = courseID
	sch.Weekday = weekday
	sch.TimeStart = timeStart
	sch.TimeEnd = timeEnd
	sch.Capacity = capacity
	s.db.Save(&sch)
	
	var grp models.Group
	if err := s.db.Where("schedule_id = ?", sch.ID).First(&grp).Error; err == nil {
		grp.Capacity = capacity
		s.db.Save(&grp)
	}
	
	s.db.Preload("Course").First(&sch, sch.ID)
	return &sch, nil
}

func (s *ScheduleService) Delete(id uint) error {
	return s.db.Delete(&models.Schedule{}, id).Error
}


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

	s.db.Raw(`
		SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
		FROM bookings
		WHERE created_at >= NOW() - INTERVAL '6 months'
		GROUP BY month ORDER BY month
	`).Scan(&stats.MonthlyBookings)

	s.db.Raw(`
		SELECT c.title as course_title, COUNT(b.id) as bookings
		FROM bookings b
		JOIN groups g ON b.group_id = g.id
		JOIN courses c ON g.course_id = c.id
		GROUP BY c.title ORDER BY bookings DESC LIMIT 5
	`).Scan(&stats.TopCourses)

	return stats, nil
}
