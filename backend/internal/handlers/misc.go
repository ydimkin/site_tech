package handlers

import (
	"strconv"
	"technopark/internal/middleware"
	"technopark/internal/service"
	"technopark/pkg/response"

	"github.com/gin-gonic/gin"
)

type NewsHandler struct {
	svc *service.NewsService
}

func NewNewsHandler(svc *service.NewsService) *NewsHandler {
	return &NewsHandler{svc: svc}
}

func (h *NewsHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "9"))
	news, total, err := h.svc.List(page, pageSize)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Paginated(c, news, total, page, pageSize)
}

func (h *NewsHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	news, err := h.svc.GetByID(uint(id))
	if err != nil {
		response.NotFound(c, "News not found")
		return
	}
	response.OK(c, news)
}

type createNewsInput struct {
	Title       string   `json:"title" binding:"required"`
	Content     string   `json:"content" binding:"required"`
	Preview     string   `json:"preview"`
	ImageURL    string   `json:"image_url"`
	Images      []string `json:"images"`
	IsPublished bool     `json:"is_published"`
}

func (h *NewsHandler) Create(c *gin.Context) {
	var input createNewsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	news, err := h.svc.Create(input.Title, input.Content, input.Preview, input.ImageURL, input.Images, input.IsPublished)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, news)
}

func (h *NewsHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	var input createNewsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	news, err := h.svc.Update(uint(id), input.Title, input.Content, input.Preview, input.ImageURL, input.Images, input.IsPublished)
	if err != nil {
		response.NotFound(c, "News not found")
		return
	}
	response.OK(c, news)
}

func (h *NewsHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	if err := h.svc.Delete(uint(id)); err != nil {
		response.NotFound(c, "News not found")
		return
	}
	response.OKMessage(c, "News deleted")
}

type TeacherHandler struct {
	svc *service.TeacherService
}

func NewTeacherHandler(svc *service.TeacherService) *TeacherHandler {
	return &TeacherHandler{svc: svc}
}

func (h *TeacherHandler) List(c *gin.Context) {
	teachers, err := h.svc.List()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, teachers)
}

type createTeacherInput struct {
	Name        string `json:"name" binding:"required"`
	Position    string `json:"position"`
	Description string `json:"description"`
	PhotoURL    string `json:"photo_url"`
	Experience  int    `json:"experience"`
	Subjects    string `json:"subjects"`
	Email       string `json:"email"`
	Password    string `json:"password"`
}

func (h *TeacherHandler) Create(c *gin.Context) {
	var input createTeacherInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	t, err := h.svc.Create(input.Name, input.Position, input.Description, input.PhotoURL, input.Experience, input.Subjects, input.Email, input.Password)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, t)
}

func (h *TeacherHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var input createTeacherInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	t, err := h.svc.Update(uint(id), input.Name, input.Position, input.Description, input.PhotoURL, input.Experience, input.Subjects)
	if err != nil {
		response.NotFound(c, "Teacher not found")
		return
	}
	response.OK(c, t)
}

func (h *TeacherHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if err := h.svc.Delete(uint(id)); err != nil {
		response.NotFound(c, "Teacher not found")
		return
	}
	response.OKMessage(c, "Teacher deleted")
}

type CategoryHandler struct {
	svc *service.CategoryService
}

func NewCategoryHandler(svc *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{svc: svc}
}

func (h *CategoryHandler) List(c *gin.Context) {
	cats, err := h.svc.List()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, cats)
}

type createCategoryInput struct {
	Name  string `json:"name" binding:"required"`
	Icon  string `json:"icon"`
	Color string `json:"color"`
}

func (h *CategoryHandler) Create(c *gin.Context) {
	var input createCategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	cat, err := h.svc.Create(input.Name, input.Icon, input.Color)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, cat)
}

func (h *CategoryHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var input createCategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	cat, err := h.svc.Update(uint(id), input.Name, input.Icon, input.Color)
	if err != nil {
		response.NotFound(c, "Category not found")
		return
	}
	response.OK(c, cat)
}

func (h *CategoryHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if err := h.svc.Delete(uint(id)); err != nil {
		response.NotFound(c, "Category not found")
		return
	}
	response.OKMessage(c, "Category deleted")
}

type ContactHandler struct {
	svc *service.ContactService
}

func NewContactHandler(svc *service.ContactService) *ContactHandler {
	return &ContactHandler{svc: svc}
}

type createContactInput struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Phone   string `json:"phone"`
	Subject string `json:"subject"`
	Message string `json:"message" binding:"required"`
}

func (h *ContactHandler) Create(c *gin.Context) {
	var input createContactInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	msg, err := h.svc.Create(input.Name, input.Email, input.Phone, input.Subject, input.Message)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, msg)
}

func (h *ContactHandler) AdminList(c *gin.Context) {
	msgs, err := h.svc.List()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, msgs)
}

func (h *ContactHandler) MarkRead(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if err := h.svc.MarkRead(uint(id)); err != nil {
		response.NotFound(c, "Message not found")
		return
	}
	response.OKMessage(c, "Marked as read")
}

func (h *ContactHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if err := h.svc.Delete(uint(id)); err != nil {
		response.NotFound(c, "Message not found")
		return
	}
	response.OKMessage(c, "Message deleted")
}

type StatsHandler struct {
	svc *service.StatsService
}

func NewStatsHandler(svc *service.StatsService) *StatsHandler {
	return &StatsHandler{svc: svc}
}

func (h *StatsHandler) GetStats(c *gin.Context) {
	stats, err := h.svc.GetStats()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, stats)
}

type ScheduleHandler struct {
	svc *service.ScheduleService
}

func NewScheduleHandler(svc *service.ScheduleService) *ScheduleHandler {
	return &ScheduleHandler{svc: svc}
}

func (h *ScheduleHandler) List(c *gin.Context) {
	schedules, err := h.svc.List()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, schedules)
}

func (h *ScheduleHandler) AdminList(c *gin.Context) {
	schedules, err := h.svc.AdminList()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, schedules)
}

type createScheduleInput struct {
	CourseID  uint   `json:"course_id" binding:"required"`
	Weekday   string `json:"weekday" binding:"required"`
	TimeStart string `json:"time_start" binding:"required"`
	TimeEnd   string `json:"time_end" binding:"required"`
	Capacity  int    `json:"capacity"`
}

func (h *ScheduleHandler) Create(c *gin.Context) {
	var input createScheduleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	sch, err := h.svc.Create(input.CourseID, input.Weekday, input.TimeStart, input.TimeEnd, input.Capacity)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, sch)
}

func (h *ScheduleHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	var input createScheduleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	sch, err := h.svc.Update(uint(id), input.CourseID, input.Weekday, input.TimeStart, input.TimeEnd, input.Capacity)
	if err != nil {
		response.NotFound(c, "Schedule not found")
		return
	}
	response.OK(c, sch)
}

func (h *ScheduleHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	if err := h.svc.Delete(uint(id)); err != nil {
		response.NotFound(c, "Schedule not found")
		return
	}
	response.OKMessage(c, "Schedule deleted")
}

type ReviewHandler struct {
	svc *service.ReviewService
}

func NewReviewHandler(svc *service.ReviewService) *ReviewHandler {
	return &ReviewHandler{svc: svc}
}

func (h *ReviewHandler) GetByCourse(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	reviews, err := h.svc.GetByCourse(uint(id))
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, reviews)
}

type createReviewInput struct {
	Rating int    `json:"rating" binding:"required,min=1,max=5"`
	Text   string `json:"text"`
}

func (h *ReviewHandler) Create(c *gin.Context) {
	userID := middleware.GetUserID(c)
	courseID, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var input createReviewInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	review, err := h.svc.Create(userID, uint(courseID), input.Rating, input.Text)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, review)
}

type DocumentHandler struct {
	svc *service.DocumentService
}

func NewDocumentHandler(svc *service.DocumentService) *DocumentHandler {
	return &DocumentHandler{svc: svc}
}

func (h *DocumentHandler) List(c *gin.Context) {
	docs, err := h.svc.List()
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, docs)
}

type createDocumentInput struct {
	Title    string `json:"title" binding:"required"`
	FileURL  string `json:"file_url" binding:"required"`
	Category string `json:"category" binding:"required"`
}

func (h *DocumentHandler) Create(c *gin.Context) {
	var input createDocumentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	doc, err := h.svc.Create(input.Title, input.FileURL, input.Category)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Created(c, doc)
}

func (h *DocumentHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	if err := h.svc.Delete(uint(id)); err != nil {
		response.NotFound(c, "Document not found")
		return
	}
	response.OKMessage(c, "Document deleted")
}
