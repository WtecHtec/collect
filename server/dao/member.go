package dao

import (
	"collect/config"
	"collect/datasource"
	"collect/logger"
	"collect/model"
	"collect/uitls"
	"fmt"
)

func CreateMemer(name string, groupId string, openId string) (bool, int) {
	logger.Logger.Info(fmt.Sprintf("加入群聊 start"))
	member := &model.Member{
		Id:      uitls.GetUUID(),
		GroupId: groupId,
		Name:    name,
		Enable:  true,
	}
	ok, _ := datasource.Engine.Where("user_id = ? ", openId).And("group_id = ?", groupId).Get(&model.Member{})
	if ok == true {
		return false, config.STATUS_RE
	}
	_, err := datasource.Engine.Insert(*member)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("加入失败群聊： %v", err))
		return false, config.STATUS_ERROR
	}
	logger.Logger.Info(fmt.Sprintf("加入群聊 success"))
	return true, config.STATUS_SUE
}
