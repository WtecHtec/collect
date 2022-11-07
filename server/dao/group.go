package dao

import (
	"collect/config"
	"collect/datasource"
	"collect/logger"
	"collect/model"
	"collect/uitls"
	"fmt"
)

// 创建群
func CreateGroup(name string, desc string, openId string, userName string) (bool, int) {
	logger.Logger.Info(fmt.Sprintf("创建群 start"))
	groupId := uitls.GetUUID()
	group := &model.ClassGroup{
		Id:       groupId,
		Name:     name,
		Desc:     desc,
		CreateId: openId,
		Enable:   true,
	}
	has, _ := datasource.Engine.Where("group_name = ?", name).Get(&model.ClassGroup{})
	if has {
		logger.Logger.Info(fmt.Sprintf("群名重复,name: %v", name))
		return false, config.STATUS_RE
	}
	_, err := datasource.Engine.Insert(*group)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("创建群失败 %v", err))
		return false, config.STATUS_ERROR
	}
	memId := uitls.GetUUID()
	member := &model.Member{
		Id:      memId,
		GroupId: groupId,
		UserId:  openId,
		Enable:  true,
		Level:   1,
		Name:    userName,
	}
	datasource.Engine.Insert(*member)
	logger.Logger.Info(fmt.Sprintf("创建群 success"))
	return true, config.STATUS_SUE
}

// 查找自己创建
func FindGroupByOwn(openId string) (bool, int, []model.ClassGroup) {
	logger.Logger.Info(fmt.Sprintf("搜索群 start"))
	classGroups := make([]model.ClassGroup, 0)
	err := datasource.Engine.Where("create_id = ?", openId).Omit("create_id").Find(&classGroups)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("搜索群失败"))
		return false, config.STATUS_ERROR, classGroups
	}
	logger.Logger.Info(fmt.Sprintf("搜索群 success"))
	return true, config.STATUS_SUE, classGroups
}
