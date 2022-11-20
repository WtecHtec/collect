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

func CreateSgNotice(openId string, targetNum int, title string, desc string, endTime string) (bool, int, string) {
	timeTemplate1 := "2006-01-02 15:04:05"                                                           //常规类型
	stamp, _ := time.ParseInLocation(timeTemplate1, fmt.Sprintf("%v 23:59:59", endTime), time.Local) //使用parseInLocation将字符串格式化返回本地时区时间
	noticeId := uitls.GetUUID()
	notice := &model.NoticeCollect{
		Id:        noticeId,
		Title:     title,
		Desc:      desc,
		CreateId:  openId,
		Enable:    true,
		EndTime:   stamp,
		TargetNum: targetNum,
	}
	_, err := datasource.Engine.Insert(*notice)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("发起通知失败 %v", err))
		return false, config.STATUS_ERROR, noticeId
	}
	logger.Logger.Info("发起通知成功")
	return true, config.STATUS_SUE, noticeId
}

func UpdateSgNotice(openId string, noticeId string, targetNum int, title string, desc string, endTime string) (bool, int, string) {
	timeTemplate1 := "2006-01-02 15:04:05"                                                           //常规类型
	stamp, _ := time.ParseInLocation(timeTemplate1, fmt.Sprintf("%v 23:59:59", endTime), time.Local) //使用parseInLocation将字符串格式化返回本地时区时间
	notice := &model.NoticeCollect{
		Title:     title,
		Desc:      desc,
		EndTime:   stamp,
		TargetNum: targetNum,
	}
	_, err := datasource.Engine.Where("notice_id = ?", noticeId).Cols("notice_title, notice_desc, target_num, end_time").Update(notice)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("更新通知失败 %v", err))
		return false, config.STATUS_ERROR, noticeId
	}
	logger.Logger.Info("更新通知成功")
	return true, config.STATUS_SUE, noticeId
}

type NoticeSg struct {
	NoticeId    string `json:"notice_id"`
	NoticeTitle string `json:"notice_title"`
	NoticeDesc  string `json:"notice_desc"`
	EndTime     string `json:"end_time"`
	TargetNum   int    `json:"target_num"`
	NoticeTotal int    `json:"notice_total"`
	Enable      int    `json:"enable"`
}

func GetHomeSgNotice(openId string) (bool, int, []NoticeSg) {
	datas := make([]NoticeSg, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select nc.notice_id, nc.notice_desc,  nc.notice_title, nc.end_time , nc.target_num , tmc.notice_total   FROM  notice_collect nc 
	left join (select count(mc.notice_id) as notice_total, mc.notice_id from msg_collect mc group by  mc.notice_id) tmc  on tmc.notice_id = nc.notice_id
	WHERE  nc.create_id = '%v' and nc.enable = 1 ORDER BY  nc.update_time DESC LIMIT 4 `, openId)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("获取首页收集通知失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("获取首页收集通知成功")
	return true, config.STATUS_SUE, datas
}

func GetSgNotices(openId string, noticeId string, enable string, order string) (bool, int, []NoticeSg) {
	datas := make([]NoticeSg, 0)
	enableExp := ""
	oderTime := ""
	noticeIdExp := ""
	if enable != "-1" {
		enableExp = fmt.Sprintf("and nc.enable = %v", enable)
	}
	if order != "-1" {
		oderTime = "ORDER BY  nc.update_time DESC "
	}
	if noticeId != "-1" {
		noticeIdExp = fmt.Sprintf("and nc.notice_id = '%v'", noticeId)
	}

	err := datasource.Engine.SQL(fmt.Sprintf(`select nc.enable, nc.notice_id, nc.notice_title,  nc.notice_desc, nc.update_time,  nc.end_time , nc.target_num , tmc.notice_total   FROM  notice_collect nc 
	left join (select count(mc.notice_id) as notice_total, mc.notice_id from msg_collect mc group by  mc.notice_id) tmc  on tmc.notice_id = nc.notice_id
	WHERE  nc.create_id = '%v' %v %v %v`, openId, noticeIdExp, enableExp, oderTime)).Find(&datas)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("获取收集通知详情失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("获取收集通知详情成功")
	return true, config.STATUS_SUE, datas
}

func GetSgNoticeById(noticeId string) (bool, int, *model.NoticeCollect) {
	datas := make([]model.NoticeCollect, 0)
	err := datasource.Engine.Where("notice_id = ?", noticeId).Cols("notice_id, notice_title, notice_desc, update_time, end_time, target_num,enable ").Find(&datas)
	if err != nil || len(datas) == 0 {
		logger.Logger.Error(fmt.Sprintf("GetSgNoticeById获取收集通知详情失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("GetSgNoticeById获取收集通知详情成功")
	return true, config.STATUS_SUE, &datas[0]
}
