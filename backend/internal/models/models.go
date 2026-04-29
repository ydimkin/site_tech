package models

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleAdmin   Role = "admin"
	RoleTeacher Role = "teacher"
	RoleStudent Role = "student"
)

type User struct {
	gorm.Model
	Name         string  `gorm:"not null" json:"name"`
	Email        string  `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string  `gorm:"not null" json:"-"`
	Role         Role    `gorm:"default:'student'" json:"role"`
	Phone        string  `json:"phone"`
	ChildAge     *int    `json:"child_age,omitempty"`
	AvatarURL    string  `json:"avatar_url"`
	IsActive     bool    `gorm:"default:true" json:"is_active"`
	Bookings     []Booking `gorm:"foreignKey:UserID" json:"-"`
	Reviews      []Review  `gorm:"foreignKey:UserID" json:"-"`
}

type Category struct {
	gorm.Model
	Name    string   `gorm:"uniqueIndex;not null" json:"name"`
	Icon    string   `json:"icon"`
	Color   string   `json:"color"`
	Courses []Course `gorm:"foreignKey:CategoryID" json:"-"`
}

type Teacher struct {
	gorm.Model
	Name        string `gorm:"not null" json:"name"`
	Position    string `json:"position"`
	Description string `json:"description"`
	PhotoURL    string `json:"photo_url"`
	Experience  int    `json:"experience"`
	Subjects    string `json:"subjects"`
	IsActive    bool   `gorm:"default:true" json:"is_active"`
}

type Course struct {
	gorm.Model
	Title       string   `gorm:"not null" json:"title"`
	Description string   `gorm:"type:text" json:"description"`
	CategoryID  uint     `json:"category_id"`
	Category    Category `gorm:"foreignKey:CategoryID" json:"category"`
	TeacherID   uint     `json:"teacher_id"`
	Teacher     Teacher  `gorm:"foreignKey:TeacherID" json:"teacher"`
	AgeMin      int      `json:"age_min"`
	AgeMax      int      `json:"age_max"`
	Price       float64  `json:"price"`
	Duration    int      `json:"duration"` // months
	ImageURL    string   `json:"image_url"`
	IsActive    bool     `gorm:"default:true" json:"is_active"`
	IsFeatured  bool     `gorm:"default:false" json:"is_featured"`
	Groups      []Group  `gorm:"foreignKey:CourseID" json:"-"`
	Reviews     []Review `gorm:"foreignKey:CourseID" json:"-"`
}

type Schedule struct {
	gorm.Model
	CourseID  uint   `json:"course_id"`
	Course    Course `gorm:"foreignKey:CourseID" json:"course"`
	Weekday   string `json:"weekday"`
	TimeStart string `json:"time_start"`
	TimeEnd   string `json:"time_end"`
	Capacity  int    `json:"capacity"`
}

type Group struct {
	gorm.Model
	CourseID        uint      `json:"course_id"`
	Course          Course    `gorm:"foreignKey:CourseID" json:"course"`
	ScheduleID      uint      `json:"schedule_id"`
	Schedule        Schedule  `gorm:"foreignKey:ScheduleID" json:"schedule"`
	StartDate       time.Time `json:"start_date"`
	EndDate         time.Time `json:"end_date"`
	Capacity        int       `json:"capacity"`
	CurrentStudents int       `gorm:"default:0" json:"current_students"`
	IsActive        bool      `gorm:"default:true" json:"is_active"`
	Bookings        []Booking `gorm:"foreignKey:GroupID" json:"-"`
}

type BookingStatus string

const (
	BookingPending   BookingStatus = "pending"
	BookingConfirmed BookingStatus = "confirmed"
	BookingCancelled BookingStatus = "cancelled"
	BookingWaitlist  BookingStatus = "waitlist"
)

type Booking struct {
	gorm.Model
	UserID      uint          `json:"user_id"`
	User        User          `gorm:"foreignKey:UserID" json:"user"`
	GroupID     uint          `json:"group_id"`
	Group       Group         `gorm:"foreignKey:GroupID" json:"group"`
	Status      BookingStatus `gorm:"default:'pending'" json:"status"`
	ChildName   string        `json:"child_name"`
	ChildAge    int           `json:"child_age"`
	ParentPhone string        `json:"parent_phone"`
	Comment     string        `json:"comment"`
}

type TrialBooking struct {
	gorm.Model
	CourseID    uint          `json:"course_id"`
	Course      Course        `gorm:"foreignKey:CourseID" json:"course"`
	ChildName   string        `json:"child_name"`
	ChildAge    int           `json:"child_age"`
	ParentName  string        `json:"parent_name"`
	ParentPhone string        `json:"parent_phone"`
	Status      BookingStatus `gorm:"default:'pending'" json:"status"`
	PreferDate  string        `json:"prefer_date"`
}

type Review struct {
	gorm.Model
	UserID   uint   `json:"user_id"`
	User     User   `gorm:"foreignKey:UserID" json:"user"`
	CourseID uint   `json:"course_id"`
	Course   Course `gorm:"foreignKey:CourseID" json:"-"`
	Rating   int    `gorm:"not null" json:"rating"`
	Text     string `gorm:"type:text" json:"text"`
}

type News struct {
	gorm.Model
	Title       string    `gorm:"not null" json:"title"`
	Content     string    `gorm:"type:text" json:"content"`
	Preview     string    `gorm:"type:text" json:"preview"`
	ImageURL    string    `json:"image_url"`
	IsPublished bool      `gorm:"default:false" json:"is_published"`
	PublishedAt *time.Time `json:"published_at"`
}

type GalleryItem struct {
	gorm.Model
	ImageURL    string `json:"image_url"`
	Title       string `json:"title"`
	Description string `json:"description"`
	SortOrder   int    `gorm:"default:0" json:"sort_order"`
}

type Document struct {
	gorm.Model
	Title    string `json:"title"`
	FileURL  string `json:"file_url"`
	Category string `json:"category"` // license, certificate, charter
}

type ContactMessage struct {
	gorm.Model
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Subject string `json:"subject"`
	Message string `gorm:"type:text" json:"message"`
	IsRead  bool   `gorm:"default:false" json:"is_read"`
}
