package uitls

import (
	"collect/datasource"
	"collect/logger"
	"collect/model"
	"fmt"
	"time"

	"github.com/robfig/cron/v3"
)

// 任务调度
func InitTimeTask() {
	c := cron.New()
	logger.Logger.Info("任务调度启动")
	// 添加一个任务，每 天凌晨0:0:0（0 0 * * *） 执行一次
	// */1 * * * * ? 每1分钟
	// @every 2s 每2秒
	// @daily 每天凌晨0点
	_, ok := c.AddFunc("@every 30s", func() {
		logger.Logger.Info("任务调度启动")
		updateNoticeEnable()
	})
	if ok != nil {
		logger.Logger.Error(fmt.Sprintf("任务调度失败 %v", ok))
		return
	}
	// 开始执行（每个任务会在自己的 goroutine 中执行）
	c.Start()
}

func updateNoticeEnable() {
	notices := make([]model.NoticeCollect, 0)
	err := datasource.Engine.Where("enable = ?", 1).Find(&notices)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("获取通知失败 %v", err))
		return
	}
	if len(notices) == 0 {
		return
	}
	nowTime := time.Now().Unix()
	updateParmas := make([]string, 0)
	for i := 0; i < len(notices); i++ {
		endTime := notices[i].EndTime
		if nowTime-endTime.Unix() >= 0 {
			updateParmas = append(updateParmas, notices[i].Id)
		}
	}
	if len(updateParmas) == 0 {
		return
	}
	_, uerr := datasource.Engine.In("notice_id", updateParmas).Cols("enable").Update(&model.NoticeCollect{Enable: false})
	if uerr != nil {
		fmt.Println(fmt.Sprintf("更新通知失败 %v", uerr))
		logger.Logger.Error(fmt.Sprintf("更新通知失败 %v", uerr))
		return
	}
	logger.Logger.Info(fmt.Sprintf("更新通知状态 %v", updateParmas))
}
