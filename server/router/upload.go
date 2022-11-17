package router

import (
	"collect/config"
	"collect/logger"
	"collect/uitls"
	"fmt"
	"net/http"
	"path"
	"regexp"

	"github.com/gin-gonic/gin"
)

type UploadParam struct {
	GroupId string `form:"group_id" json:"group_id"`
}

func UpLoadFile(r *gin.RouterGroup) {
	r.POST("/authupload", func(ctx *gin.Context) {
		openId := uitls.GetLoginOpenId(ctx)
		if openId == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
			return
		}
		_, headers, err := ctx.Request.FormFile("file")
		if err != nil {
			logger.Logger.Error(fmt.Sprintf("上传失败 file: %v", err))
			ctx.JSON(config.STATUS_ERROR, gin.H{"code": config.STATUS_ERROR, "message": config.STATUS_MSG[config.STATUS_ERROR]})
			return
		}
		fmt.Println(headers.Filename)
		//headers.Size 获取文件大小
		if headers.Size > 1024*1024*4 {
			logger.Logger.Error("文件太大了")
			ctx.JSON(config.STATUS_ERROR, gin.H{"code": config.STATUS_ERROR, "message": "文件太大了"})
			return
		}
		var imgRE = regexp.MustCompile(`.(png|jpg|gif|jpeg|webp)$`)
		cType := headers.Header.Get("Content-Type")
		if imgRE.MatchString(cType) == false {
			ctx.JSON(config.STATUS_ERROR, gin.H{"code": config.STATUS_ERROR, "message": "文件格式错误"})
			return
		}
		var group UploadParam
		if err := ctx.ShouldBind(&group); err != nil {
			ctx.JSON(config.STATUS_RUQED, gin.H{"code": config.STATUS_RUQED, "message": config.STATUS_MSG[config.STATUS_RUQED]})
			return
		}
		// 日期/群组/用户/文件名
		// timestamp := time.Now().Unix()
		// tm := time.Unix(timestamp, 0)
		// dateStr := tm.Format("2006-01-02")
		filesuffix := path.Ext(headers.Filename)
		filePath := fmt.Sprintf("/upload/%v%v", uitls.GetUUID(), filesuffix)
		fe := ctx.SaveUploadedFile(headers, fmt.Sprintf(".%v", filePath))
		if fe != nil {
			logger.Logger.Error(fmt.Sprintf("文件保存失败 %v", fe))
			ctx.JSON(config.STATUS_ERROR, gin.H{"code": config.STATUS_ERROR, "message": config.STATUS_MSG[config.STATUS_ERROR]})
			return
		}
		ctx.JSON(config.STATUS_SUE, gin.H{"code": config.STATUS_SUE, "data": filePath, "message": config.STATUS_MSG[config.STATUS_SUE]})
	})
}
