package router

import (
	"collect/config"
	"collect/dao"
	"collect/model"
	"collect/uitls"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitSgNotice(r *gin.RouterGroup) {
	r.POST("/authcreatenotice_sg", authCreateSgNotice)
	r.POST("/authhomenotice_sg", authHomeSgNotice)
	r.POST("/authnoticeinfos_sg", authSgNoticeInfos)
	r.POST("/authupdatenotice_sg", authUpdateNotice)
	r.POST("/authgetnoticebyid_sg", authGetNoticeById)

}

func authCreateSgNotice(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var notice model.SgReqNotice
	if err := c.ShouldBind(&notice); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, data := dao.CreateSgNotice(openId, notice.TargetNum, notice.Title, notice.Desc, notice.EndTime)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": data})
}

func authUpdateNotice(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var notice model.SgUpNotice
	if err := c.ShouldBind(&notice); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, data := dao.UpdateSgNotice(openId, notice.NoticeId, notice.TargetNum, notice.Title, notice.Desc, notice.EndTime)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": data})
}

func authHomeSgNotice(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	ok, status, datas := dao.GetHomeSgNotice(openId)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}

type ReqNoInfo struct {
	NoticeId string `json:"notice_id"`
	Enable   string `json:"enable"`
	Order    string `json:"order"`
}

func authSgNoticeInfos(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var notice ReqNoInfo
	if err := c.ShouldBind(&notice); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, datas := dao.GetSgNotices(openId, notice.NoticeId, notice.Enable, notice.Order)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}

type NotId struct {
	NoticeId string `json:"notice_id" binding:"required"`
}

func authGetNoticeById(c *gin.Context) {
	var notice NotId
	if err := c.ShouldBind(&notice); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, datas := dao.GetSgNoticeById(notice.NoticeId)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}
