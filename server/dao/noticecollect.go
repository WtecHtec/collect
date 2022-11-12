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
	GroupTotal   int    `json:"group_total"`
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

// 本人下发通知收集情况,总人数，上传人数
func GeCountNotices(openId string) (bool, int, []CountNotice) {
	datas := make([]CountNotice, 0)
	err := datasource.Engine.SQL(fmt.Sprintf(`select wg.group_id,  wg.group_name, wg.notice_id, wg.notice_title, nt.collect_total, gt.group_total, wg.create_time
	from
	(select cg.group_id , cg.group_name, nc.notice_id, nc.notice_title,nc.create_time  
		FROM  notice_collect nc  
		left join  class_group cg on nc.group_id  = cg.group_id and cg.create_id = 'otrlc5XUmCRfBsYHd7lLlg3uAOUs' 
		where nc.create_id = '%v' 
	) as wg
	left join  
		(
		select count(nc.notice_id) as collect_total, nc.group_id, mc.notice_id
		from notice_collect nc
		left join msg_collect mc on  mc.group_id = nc.group_id and mc.notice_id = nc.notice_id and nc.enable = 1 and mc.img_urls != ''
		where  nc.create_id = '%v' 
		group by mc.notice_id, nc.group_id
		)  as nt
	on nt.group_id = wg.group_id and nt.notice_id = wg.notice_id
	left join  
	( select count(cg.group_id) as group_total, m.group_id
		from class_group cg
		left join member m  on cg.group_id = m.group_id
		where cg.create_id = '%v'
		group by m.group_id ) as gt
	on gt.group_id = wg.group_id 
	ORDER  by wg.create_time LIMIT 4`, openId, openId, openId)).Find(&datas)

	if err != nil {
		logger.Logger.Error(fmt.Sprintf("拉取本人创建通知收集情况失败 %v", err))
		return false, config.STATUS_ERROR, nil
	}
	logger.Logger.Info("拉取本人创建通知收集情况成功")
	return true, config.STATUS_SUE, datas

}
