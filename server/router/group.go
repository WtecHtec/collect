package router

import (
	"collect/config"
	"collect/dao"
	"collect/model"
	"collect/uitls"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitAuthGroupRouter(r *gin.RouterGroup) {
	r.POST("/creategroup", authHandleCreateGroup)
	r.POST("/findowngroup", authHandleFindGroupByOwn)
	r.POST("/findgroupusersbyid", authGroupUserById)
	r.POST("/findgroupralebyid", authGroupRaleById)
	r.POST("/countgrouptotal", authCountGroupTotal)
}

func authHandleCreateGroup(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	var group model.RequestClassGroup
	if err := c.ShouldBind(&group); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	ok, status := dao.CreateGroup(group.Name, group.Desc, openId, group.UserName)
	if ok == false {
		c.JSON(int(status), gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "message": "创建成功"})
}

func authHandleFindGroupByOwn(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	ok, status, classGroups := dao.FindGroupByOwn(openId)
	if ok == false {
		c.JSON(int(status), gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": classGroups})
}

func authGroupUserById(c *gin.Context) {
	var memGroup model.RequestMemGroup
	if err := c.ShouldBind(&memGroup); err != nil {
		c.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
		return
	}
	users, ok := dao.FindGroupUsers(memGroup.GroupId, memGroup.NoticeId)
	if ok == false {
		c.JSON(config.STATUS_ERROR, gin.H{"code": config.STATUS_ERROR, "message": config.STATUS_MSG[config.STATUS_ERROR]})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": users})
}

func authGroupRaleById(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	ok, datas := dao.FindRaletionGroupByOwn(openId)
	if ok == false {
		c.JSON(config.STATUS_ERROR, gin.H{"code": config.STATUS_ERROR, "message": config.STATUS_MSG[config.STATUS_ERROR]})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": datas})
}

func authCountGroupTotal(c *gin.Context) {
	openId := uitls.GetLoginOpenId(c)
	if openId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	ok, status, datas := dao.CountGroupPerson(openId)
	if ok == false {
		c.JSON(status, gin.H{"code": status, "message": config.STATUS_MSG[status]})
		return
	}
	c.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "message": config.STATUS_MSG[config.STATUS_SUE], "data": datas})
}
