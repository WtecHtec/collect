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
		logger.Logger.Error(fmt.Sprintf("修改收集记录失败 %v", ok))
		return false, config.STATUS_ERROR
	}
	logger.Logger.Info("修改收集记录成功")
	return true, config.STATUS_SUE
}

func GetSgMsgCollectById(openId string, noticeId string) (bool, int, *model.MsgCollect) {
	datas := make([]model.MsgCollect, 0)
	err := datasource.Engine.Where("notice_id = ?", noticeId).And("create_id = ? ", openId).Cols("collect_id, notice_id, collect_desc, img_urls, create_time ").Find(&datas)
	if err != nil || len(datas) == 0 {
		logger.Logger.Error(fmt.Sprintf("GetSgMsgCollectById获取收集详情失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetSgMsgCollectById获取收集详情成功")
	return true, config.STATUS_SUE, &datas[0]
}
