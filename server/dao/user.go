package dao

import (
	"collect/datasource"
	"collect/logger"
	"collect/model"
)

func CreateUser(openId string, avatarUrl string, nickName string) bool {
	user := &model.User{
		Name:     nickName,
		HeadeImg: avatarUrl,
		OpenId:   openId,
	}
	_, err := datasource.Engine.Insert(*user)
	if err != nil {
		logger.Logger.Error("创建用户失败")
		return false
	}
	logger.Logger.Info("创建用户成功")
	return true
}
