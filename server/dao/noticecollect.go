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

func FindNoticeOwn(openId string) (bool, int, []model.NoticeCollect) {
	notices := make([]model.NoticeCollect, 0)
	err := datasource.Engine.Where("enable = ?", 1).And("create_id = ?", openId).OrderBy("create_time").Find(&notices)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("拉取本人创建通知失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("拉取本人创建通知成功")
	return true, config.STATUS_SUE, notices
}

type CountNotice struct {
	CollectTotal int    `json:"collect_total"`
	GroupId      string `json:"group_id"`
	NoticeId     string `json:"notice_id"`
	NoticeTitle  string `json:"notice_title"`
	NoticeDesc   string `json:"notice_desc"`
	CreateTime   string `json:"create_time"`
}

// 本人下发通知收集情况
func CountNoticeOwn(openId string) (bool, int, []CountNotice) {
	datas := make([]CountNotice, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select count(nc.notice_id) as collect_total, nc.group_id, mc.notice_id, nc.notice_title, nc.notice_desc, nc.create_time
		from notice_collect nc
		left join msg_collect mc on  mc.group_id = nc.group_id and mc.notice_id = nc.notice_id
		where nc.create_id = '%v' and nc.enable = 1 and mc.img_urls != ''
		group by mc.notice_id, nc.group_id order by nc.create_time LIMIT  2 `, openId)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("拉取本人创建通知收集情况失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("拉取本人创建通知收集情况成功")
	return true, config.STATUS_SUE, datas
}
