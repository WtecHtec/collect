package router

import (
	"collect/config"
	"collect/dao"
	"collect/model"
	"collect/uitls"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitAuthUserRouter(r *gin.RouterGroup) {
	r.POST("/updateuserinfo", handleUpdateUser)
	r.POST("/getuserinfo", handleGetUser)
}

func handleUpdateUser(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var userUpdate model.UserUpdate
	if err := c.ShouldBind(&userUpdate); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status := dao.UpdateUser(openId, &userUpdate)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE]})
}

func handleGetUser(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	info, ok := dao.GetUserInfoByOpenId(openId)
	if ok == false {
		c.JSON(config.STATUS_ERROR, gin.H{"code": config.STATUS_ERROR, "message": config.STATUS_MSG[config.STATUS_ERROR]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": info})
}
