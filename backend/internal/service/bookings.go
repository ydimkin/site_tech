package service

import (
	"errors"
	"technopark/internal/models"

	"gorm.io/gorm"
)

type BookingService struct {
	db *gorm.DB
}

func NewBookingService(db *gorm.DB) *BookingService {
	return &BookingService{db: db}
}

func (s *BookingService) Create(userID, groupID uint, childName string, childAge int, phone, comment string) (*models.Booking, error) {
	// Check group capacity
	var group models.Group
	if err := s.db.First(&group, groupID).Error; err != nil {
		return nil, errors.New("group not found")
	}

	var status models.BookingStatus
	if group.CurrentStudents >= group.Capacity {
		status = models.BookingWaitlist
	} else {
		status = models.BookingPending
		s.db.Model(&group).UpdateColumn("current_students", gorm.Expr("current_students + 1"))
	}

	// Check if already booked
	var existing models.Booking
	if err := s.db.Where("user_id = ? AND group_id = ? AND status != ?",
		userID, groupID, models.BookingCancelled).First(&existing).Error; err == nil {
		return nil, errors.New("already booked for this group")
	}

	booking := models.Booking{
		UserID:      userID,
		GroupID:     groupID,
		ChildName:   childName,
		ChildAge:    childAge,
		ParentPhone: phone,
		Comment:     comment,
		Status:      status,
	}
	if err := s.db.Create(&booking).Error; err != nil {
		return nil, err
	}
	return s.GetByID(booking.ID)
}

func (s *BookingService) GetByID(id uint) (*models.Booking, error) {
	var b models.Booking
	err := s.db.Preload("User").Preload("Group").Preload("Group.Course").
		Preload("Group.Schedule").First(&b, id).Error
	return &b, err
}

func (s *BookingService) GetByUser(userID uint) ([]models.Booking, error) {
	var bookings []models.Booking
	err := s.db.Preload("Group").Preload("Group.Course").Preload("Group.Course.Category").
		Preload("Group.Schedule").
		Where("user_id = ?", userID).
		Order("created_at desc").Find(&bookings).Error
	return bookings, err
}

func (s *BookingService) Cancel(id, userID uint) error {
	var b models.Booking
	if err := s.db.First(&b, id).Error; err != nil {
		return errors.New("booking not found")
	}
	if b.UserID != userID {
		return errors.New("access denied")
	}
	if b.Status == models.BookingCancelled {
		return errors.New("already cancelled")
	}
	// Decrement group students
	if b.Status != models.BookingWaitlist {
		s.db.Model(&models.Group{}).Where("id = ?", b.GroupID).
			UpdateColumn("current_students", gorm.Expr("current_students - 1"))
	}
	b.Status = models.BookingCancelled
	return s.db.Save(&b).Error
}

func (s *BookingService) AdminList(status string, page, pageSize int) ([]models.Booking, int64, error) {
	query := s.db.Model(&models.Booking{}).
		Preload("User").Preload("Group").Preload("Group.Course")
	if status != "" {
		query = query.Where("status = ?", status)
	}
	var total int64
	query.Count(&total)
	var bookings []models.Booking
	err := query.Order("created_at desc").
		Offset((page - 1) * pageSize).Limit(pageSize).Find(&bookings).Error
	return bookings, total, err
}

func (s *BookingService) UpdateStatus(id uint, status models.BookingStatus) (*models.Booking, error) {
	var b models.Booking
	if err := s.db.First(&b, id).Error; err != nil {
		return nil, errors.New("booking not found")
	}
	b.Status = status
	s.db.Save(&b)
	return s.GetByID(b.ID)
}
