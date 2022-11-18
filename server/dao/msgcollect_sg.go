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

type MsgList struct {
	ImgUrls     string `json:"img_urls"`
	UpdateTime  string `json:"update_time"`
	UserName    string `json:"user_name"`
	UserGender  string `json:"user_gender"`
	NoticeTitle string `json:"notice_title"`
	Enable      string `json:"enable"`
	CollectDesc string `json:"collect_desc"`
	NoticeId    string `json:"notice_id"`
	CollectId   string `json:"collect_id"`
	EndTime     string `json:"end_time"`
	NoticeDesc  string `json:"notice_desc"`
}

func GetSgMsgCollects(noticeId string) (bool, int, []MsgList) {
	datas := make([]MsgList, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select mc.img_urls, mc.update_time , u.user_name, u.user_gender FROM msg_collect mc 
		left join user u on u.wx_openid = mc.create_id 
		WHERE  mc.notice_id = '%v' ORDER BY mc.update_time DESC `, noticeId)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetSgMsgCollects获取收集数据失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetSgMsgCollectById获取收集数据成功")
	return true, config.STATUS_SUE, datas
}

func GetSgMsgCollectRaleOwn(openId string, collectId string, order string) (bool, int, []MsgList) {
	datas := make([]MsgList, 0)
	collectIdExp := ""
	orderExp := ""
	if collectId != "-1" {
		collectIdExp = fmt.Sprintf("and mc.collect_id = '%v'", collectId)
	}
	if order != "-1" {
		orderExp = "ORDER BY mc.update_time DESC "
	}
	err := datasource.Engine.SQL(fmt.Sprintf(`select nc.end_time, nc.update_time, nc.notice_desc, nc.notice_id, nc.notice_title, nc.enable, mc.img_urls, mc.collect_desc, mc.collect_id  FROM msg_collect mc 
	left join notice_collect nc on nc.notice_id = mc.notice_id 
	WHERE mc.create_id='%v' %v %v `, openId, collectIdExp, orderExp)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("GetSgMsgCollectRaleOwn获取与我相关上传失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetSgMsgCollectRaleOwn获取与我相关上传成功")
	return true, config.STATUS_SUE, datas
}
