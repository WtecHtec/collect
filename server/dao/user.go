package dao

import (
	"collect/config"
	"collect/datasource"
	"collect/logger"
	"collect/model"
	"collect/uitls"
	"fmt"
)

//  注册新用户
func CreateUser(openId string, avatarUrl string, nickName string) bool {
	user := &model.User{
		Id:       uitls.GetUUID(),
		Name:     nickName,
		HeadeImg: avatarUrl,
		OpenId:   openId,
		Enable:   true,
	}
	has, e := datasource.Engine.Where("wx_openid = ?", openId).Get(&model.User{})
	if e != nil {
		logger.Logger.Error(fmt.Sprintf("查询用户失败%v, error: %v", openId, e.Error()))
		return false
	}
	if has == true {
		logger.Logger.Info("用户已存在")
		return true
	}
	_, err := datasource.Engine.Insert(*user)
	fmt.Print(err)
	if err != nil {
		logger.Logger.Error("创建新用户失败")
		return false
	}
	logger.Logger.Info("创建新用户成功")
	return true
}

// 获取用户信息
func GetUserInfoByOpenId(openId string) (model.User, bool) {
	userInfo := make([]model.User, 0)
	err := datasource.Engine.Cols("user_id", "user_name", "user_phone", "user_gender", "user_head", "create_time").Where("wx_openid = ?", openId).Find(&userInfo)
	if err != nil || len(userInfo) == 0 {
		logger.Logger.Error(fmt.Sprintf("获取用户信息失败, Openid: %v", openId))
		return model.User{}, false
	}
	logger.Logger.Info(fmt.Sprintf("获取用户信息成功, Openid: %v; Info: %v", openId, userInfo[0]))
	return userInfo[0], true
}

// 修改数据
func UpdateUser(openId string, info *model.UserUpdate) (bool, int) {
	_, err := datasource.Engine.Cols("user_name", "user_phone", "user_gender").Where("wx_openid = ?", openId).Update(&model.User{
		Name:       info.Name,
		PhoneNumer: info.PhoneNumer,
		Gender:     info.Gender,
	})
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("更新用户信息失败, Openid: %v, %v", openId, err))
		return false, config.STATUS_ERROR
	}
	logger.Logger.Error("更新用户信息成功")
	return true, config.STATUS_SUE
}
