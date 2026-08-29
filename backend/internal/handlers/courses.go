package handlers

import (
	"strconv"
	"technopark/internal/service"
	"technopark/pkg/response"

	"github.com/gin-gonic/gin"
)

type CourseHandler struct {
	svc *service.CourseService
}

func NewCourseHandler(svc *service.CourseService) *CourseHandler {
	return &CourseHandler{svc: svc}
}

func (h *CourseHandler) List(c *gin.Context) {
	filter := service.CourseFilter{
		Search:   c.Query("search"),
		IsActive: true,
	}
	if v, err := strconv.Atoi(c.Query("category_id")); err == nil {
		filter.CategoryID = uint(v)
	}
	if v, err := strconv.Atoi(c.Query("age")); err == nil {
		filter.Age = v
	}
	if v, err := strconv.ParseFloat(c.Query("min_price"), 64); err == nil {
		filter.MinPrice = v
	}
	if v, err := strconv.ParseFloat(c.Query("max_price"), 64); err == nil {
		filter.MaxPrice = v
	}
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "12"))

	courses, total, err := h.svc.List(filter, page, pageSize)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Paginated(c, courses, total, page, pageSize)
}

func (h *CourseHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	course, err := h.svc.GetByID(uint(id))
	if err != nil {
		response.NotFound(c, "Course not found")
		return
	}
	response.OK(c, course)
}

type createCourseInput struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description"`
	CategoryID  uint    `json:"category_id"`
	TeacherID   uint    `json:"teacher_id"`
	AgeMin      int     `json:"age_min"`
	AgeMax      int     `json:"age_max"`
	Price       float64 `json:"price"`
	Duration    int     `json:"duration"`
	ImageURL    string  `json:"image_url"`
	IsFeatured  bool    `json:"is_featured"`
}

func (h *CourseHandler) Create(c *gin.Context) {
	var input createCourseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	
	if input.CategoryID == 0 {
		response.BadRequest(c, "Пожалуйста, выберите категорию")
		return
	}
	if input.TeacherID == 0 {
		response.BadRequest(c, "Пожалуйста, выберите педагога")
		return
	}

	course, err := h.svc.Create(input.Title, input.Description, input.CategoryID, input.TeacherID,
		input.AgeMin, input.AgeMax, input.Price, input.Duration, input.ImageURL, input.IsFeatured)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, course)
}

func (h *CourseHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	var input createCourseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	if input.CategoryID == 0 {
		response.BadRequest(c, "Пожалуйста, выберите категорию")
		return
	}
	if input.TeacherID == 0 {
		response.BadRequest(c, "Пожалуйста, выберите педагога")
		return
	}

	course, err := h.svc.Update(uint(id), input.Title, input.Description, input.CategoryID, input.TeacherID,
		input.AgeMin, input.AgeMax, input.Price, input.Duration, input.ImageURL, input.IsFeatured)
	if err != nil {
		response.NotFound(c, "Course not found")
		return
	}
	response.OK(c, course)
}

func (h *CourseHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	if err := h.svc.Delete(uint(id)); err != nil {
		response.NotFound(c, "Course not found")
		return
	}
	response.OKMessage(c, "Course deleted")
}

func (h *CourseHandler) GetFeatured(c *gin.Context) {
	courses, err := h.svc.GetFeatured()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, courses)
}
