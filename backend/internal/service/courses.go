package service

import (
	"technopark/internal/models"

	"gorm.io/gorm"
)

type CourseFilter struct {
	CategoryID uint
	Age        int
	MinPrice   float64
	MaxPrice   float64
	Search     string
	IsActive   bool
}

type CourseService struct {
	db *gorm.DB
}

func NewCourseService(db *gorm.DB) *CourseService {
	return &CourseService{db: db}
}

func (s *CourseService) List(filter CourseFilter, page, pageSize int) ([]models.Course, int64, error) {
	query := s.db.Model(&models.Course{}).
		Preload("Category").
		Preload("Teacher")

	if filter.IsActive {
		query = query.Where("is_active = ?", true)
	}
	if filter.CategoryID != 0 {
		query = query.Where("category_id = ?", filter.CategoryID)
	}
	if filter.Age != 0 {
		query = query.Where("age_min <= ? AND age_max >= ?", filter.Age, filter.Age)
	}
	if filter.MinPrice > 0 {
		query = query.Where("price >= ?", filter.MinPrice)
	}
	if filter.MaxPrice > 0 {
		query = query.Where("price <= ?", filter.MaxPrice)
	}
	if filter.Search != "" {
		query = query.Where("title ILIKE ? OR description ILIKE ?", "%"+filter.Search+"%", "%"+filter.Search+"%")
	}

	var total int64
	query.Count(&total)

	var courses []models.Course
	err := query.Order("created_at desc").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&courses).Error
	return courses, total, err
}

func (s *CourseService) GetByID(id uint) (*models.Course, error) {
	var course models.Course
	err := s.db.Preload("Category").Preload("Teacher").
		Preload("Groups").Preload("Groups.Schedule").
		First(&course, id).Error
	return &course, err
}

func (s *CourseService) GetFeatured() ([]models.Course, error) {
	var courses []models.Course
	err := s.db.Preload("Category").Preload("Teacher").
		Where("is_active = ? AND is_featured = ?", true, true).
		Limit(6).Find(&courses).Error
	return courses, err
}

func (s *CourseService) Create(title, desc string, catID, teacherID uint, ageMin, ageMax int,
	price float64, duration int, imageURL string, featured bool) (*models.Course, error) {
	c := models.Course{
		Title:       title,
		Description: desc,
		CategoryID:  catID,
		TeacherID:   teacherID,
		AgeMin:      ageMin,
		AgeMax:      ageMax,
		Price:       price,
		Duration:    duration,
		ImageURL:    imageURL,
		IsActive:    true,
		IsFeatured:  featured,
	}
	err := s.db.Create(&c).Error
	if err != nil {
		return nil, err
	}
	return s.GetByID(c.ID)
}

func (s *CourseService) Update(id uint, title, desc string, catID, teacherID uint, ageMin, ageMax int,
	price float64, duration int, imageURL string, featured bool) (*models.Course, error) {
	var c models.Course
	if err := s.db.First(&c, id).Error; err != nil {
		return nil, err
	}
	c.Title = title
	c.Description = desc
	c.CategoryID = catID
	c.TeacherID = teacherID
	c.AgeMin = ageMin
	c.AgeMax = ageMax
	c.Price = price
	c.Duration = duration
	c.ImageURL = imageURL
	c.IsFeatured = featured
	s.db.Save(&c)
	return s.GetByID(c.ID)
}

func (s *CourseService) Delete(id uint) error {
	return s.db.Delete(&models.Course{}, id).Error
}
