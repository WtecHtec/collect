package model

import (
	"collect/datasource"
	"collect/logger"
	"fmt"
)

func InitModel() {
	logger.Logger.Info("DataTable init start")
	err := datasource.Engine.Sync2(new(User), new(ClassGroup), new(Member), new(FeedBack), new(NoticeCollect), new(MsgCollect))
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("DataTable error %v", err))
		return
	}
	logger.Logger.Info("DataTable init success")
}
