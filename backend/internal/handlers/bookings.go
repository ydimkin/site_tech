package handlers

import (
	"strconv"
	"technopark/internal/middleware"
	"technopark/internal/models"
	"technopark/internal/service"
	"technopark/pkg/response"

	"github.com/gin-gonic/gin"
)

type BookingHandler struct {
	svc *service.BookingService
}

func NewBookingHandler(svc *service.BookingService) *BookingHandler {
	return &BookingHandler{svc: svc}
}

type createBookingInput struct {
	GroupID     uint   `json:"group_id" binding:"required"`
	ChildName   string `json:"child_name" binding:"required"`
	ChildAge    int    `json:"child_age" binding:"required"`
	ParentPhone string `json:"parent_phone"`
	Comment     string `json:"comment"`
}

func (h *BookingHandler) Create(c *gin.Context) {
	userID := middleware.GetUserID(c)
	var input createBookingInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	booking, err := h.svc.Create(userID, input.GroupID, input.ChildName, input.ChildAge, input.ParentPhone, input.Comment)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.Created(c, booking)
}

func (h *BookingHandler) MyBookings(c *gin.Context) {
	userID := middleware.GetUserID(c)
	bookings, err := h.svc.GetByUser(userID)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.OK(c, bookings)
}

func (h *BookingHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	userID := middleware.GetUserID(c)
	role, _ := c.Get(middleware.UserRoleKey)
	booking, err := h.svc.GetByID(uint(id))
	if err != nil {
		response.NotFound(c, "Booking not found")
		return
	}
	if booking.UserID != userID && role != string(models.RoleAdmin) {
		response.Forbidden(c)
		return
	}
	response.OK(c, booking)
}

func (h *BookingHandler) Cancel(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	userID := middleware.GetUserID(c)
	if err := h.svc.Cancel(uint(id), userID); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.OKMessage(c, "Booking cancelled")
}

func (h *BookingHandler) AdminList(c *gin.Context) {
	status := c.Query("status")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	bookings, total, err := h.svc.AdminList(status, page, pageSize)
	if err != nil {
		response.InternalError(c)
		return
	}
	response.Paginated(c, bookings, total, page, pageSize)
}

type updateStatusInput struct {
	Status models.BookingStatus `json:"status" binding:"required"`
}

func (h *BookingHandler) UpdateStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.BadRequest(c, "Invalid ID")
		return
	}
	var input updateStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	booking, err := h.svc.UpdateStatus(uint(id), input.Status)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}
	response.OK(c, booking)
}
