package dao

import (
	"collect/config"
	"collect/datasource"
	"collect/logger"
	"collect/model"
	"collect/uitls"
	"fmt"
)

func CreateSgMsgCollect(openId string, noticeId string, imgUrls string, desc string) (bool, int) {
	has, err := datasource.Engine.Where("enable = ?", 1).And("notice_id = ?", noticeId).Get(&model.NoticeCollect{})
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

func UpdateSgMsgCollect(openId string, collectId string, imgUrls string, desc string) (bool, int) {
	msg := &model.MsgCollect{
		Desc:    desc,
		ImgUrls: imgUrls,
	}
	_, ok := datasource.Engine.Where("collect_id = ?", collectId).Cols("collect_desc, img_urls").Update(msg)
	if ok != nil {
		logger.Logger.Error(fmt.Sprintf("创建收集记录失败 %v", ok))
		return false, config.STATUS_ERROR
	}
	logger.Logger.Info("创建收集记录成功")
	return true, config.STATUS_SUE
}

func GetSgMsgCollectInfos(openId string, collectId string, order string) {

}
