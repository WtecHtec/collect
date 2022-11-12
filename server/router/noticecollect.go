package router

import (
	"collect/config"
	"collect/dao"
	"collect/model"
	"collect/uitls"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitNotice(r *gin.RouterGroup) {
	r.POST("/authcreatenotice", authCreateNotice)
	r.POST("/authcountnotice", authCountNotice)
	r.POST("/authownnotice", authOwnNotice)
	r.POST("/getcountnotice", authGetCountNotice)
	r.POST("/hasnewnotice", authGetNewNotice)
}
func authCreateNotice(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var notice model.RequestNotice
	if err := c.ShouldBind(&notice); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status := dao.CreateNotice(openId, notice.GroupId, notice.Title, notice.Desc, notice.EndTime)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE]})
}

func authCountNotice(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	ok, status, datas := dao.CountNoticeOwn(openId)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}

func authOwnNotice(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	ok, status, datas := dao.CountNoticeOwn(openId)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}

func authGetCountNotice(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	ok, status, datas := dao.GeCountNotices(openId)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}

func authGetNewNotice(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	ok, status, datas := dao.GetNewNotice(openId)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}
