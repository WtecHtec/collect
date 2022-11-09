package dao

import (
	"collect/config"
	"collect/datasource"
	"collect/logger"
	"collect/model"
	"collect/uitls"
	"fmt"
	"time"
)

func CreateNotice(openId string, groupId string, title string, desc string, endTime string) (bool, int) {
	timeTemplate1 := "2006-01-02 15:04:05"                                                           //常规类型
	stamp, _ := time.ParseInLocation(timeTemplate1, fmt.Sprintf("%v 23:59:59", endTime), time.Local) //使用parseInLocation将字符串格式化返回本地时区时间
	notice := &model.NoticeCollect{
		Id:       uitls.GetUUID(),
		Title:    title,
		Desc:     desc,
		CreateId: openId,
		GroupId:  groupId,
		Enable:   true,
		EndTime:  stamp,
	}
	_, err := datasource.Engine.Insert(*notice)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("发起通知失败 %v", err))
		return false, config.STATUS_ERROR
	}
	logger.Logger.Info("发起通知成功")
	return true, config.STATUS_SUE
}
