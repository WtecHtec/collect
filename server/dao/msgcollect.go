package dao

import (
	"collect/config"
	"collect/datasource"
	"collect/logger"
	"collect/model"
	"collect/uitls"
	"fmt"
)

func CreateMsgCollect(openId string, noticeId string, groupId string, imgUrls string, desc string) (bool, int) {
	has, err := datasource.Engine.Where("enable = ?", 1).And("notice_id = ?", noticeId).And(" group_id = ?", groupId).Get(&model.NoticeCollect{})
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("查询通知失败 %v", err))
		return false, config.STATUS_ERROR
	}
	if has == false {
		logger.Logger.Info(fmt.Sprintf("查询通知已过期 %v", noticeId))
		return false, config.STATUS_TIMEOUT
	}
	msg := &model.MsgCollect{
		Id:       uitls.GetUUID(),
		GroupId:  groupId,
		NoticeId: noticeId,
		Desc:     desc,
		ImgUrls:  imgUrls,
		CreateId: openId,
	}
	_, ok := datasource.Engine.Insert(*msg)
	if ok != nil {
		logger.Logger.Error(fmt.Sprintf("创建收集记录失败 %v", ok))
		return false, config.STATUS_ERROR
	}
	logger.Logger.Info("创建收集记录成功")
	return true, config.STATUS_SUE
}
