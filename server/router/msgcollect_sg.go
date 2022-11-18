package router

import (
	"collect/config"
	"collect/dao"
	"collect/uitls"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitSgMsgCollect(r *gin.RouterGroup) {
	r.POST("/createcollect_sg", authCreateSgMsgCollect)
	r.POST("/getmsgcollectbyid_sg", authGetMsgCollectById)
	r.POST("/updatecollect_sg", authUpdateSgMsgCollect)

}

type AddMsg struct {
	NoticeId string `form:"notice_id" json:"notice_id" binding:"required"`
	Desc     string `form:"desc" json:"desc"`
	ImgUrls  string `form:"img_urls" json:"img_urls" binding:"required"`
}

func authCreateSgMsgCollect(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var msgInfo AddMsg
	if err := c.ShouldBind(&msgInfo); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status := dao.CreateSgMsgCollect(openId, msgInfo.NoticeId, msgInfo.ImgUrls, msgInfo.Desc)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE]})
}

type MsgId struct {
	NoticeId string `json:"notice_id" binding:"required"`
}

func authGetMsgCollectById(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var notice MsgId
	if err := c.ShouldBind(&notice); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status, datas := dao.GetSgMsgCollectById(openId, notice.NoticeId)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}

type UpdateMsg struct {
	CollectId string `form:"collect_id" json:"collect_id" binding:"required"`
	Desc      string `form:"desc" json:"desc"`
	ImgUrls   string `form:"img_urls" json:"img_urls" binding:"required"`
}

func authUpdateSgMsgCollect(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var msgInfo UpdateMsg
	if err := c.ShouldBind(&msgInfo); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status := dao.UpdateSgMsgCollect(openId, msgInfo.CollectId, msgInfo.ImgUrls, msgInfo.Desc)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE]})
}
