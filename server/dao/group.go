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

// 获取团体人数总人员信息
func FindGroupUsers(groupId string, noticeId string) ([]model.MemberGroups, bool) {
	users := make([]model.MemberGroups, 0)
	ok := datasource.Engine.Table("member").Alias("m").
		Select("m.group_id, m.member_name as user_name, m.level, mc.img_urls").
		Join("LEFT", []string{"msg_collect", "mc"}, fmt.Sprintf("mc.create_id = m.user_id AND mc.notice_id = '%v'", noticeId)).
		Join("LEFT", []string{"class_group", "cg"}, "cg.group_id = m.group_id").
		Where("m.group_id =  ?", groupId).And("m.enable = ?", 1).Find(&users, &model.ClassGroup{})
	if ok != nil {

		logger.Logger.Error(fmt.Sprintf("获取群全人数失败, %v", ok))
		return nil, false
	}
	logger.Logger.Info("获取群全人数")
	return users, true
}

type RaleGroup struct {
	GroupName string `json:"group_name"`
	GroupDesc string `json:"group_desc"`
	Level     string `json:"level"`
	GroupId   string `json:"group_id"`
	UserName  string `json:"user_name"`
}

// 获取与自己相关的群
func FindRaletionGroupByOwn(openId string) (bool, []RaleGroup) {
	infos := make([]RaleGroup, 0)
	err := datasource.Engine.Table("member").Alias("m").
		Select("m.group_id, m.member_name as user_name, m.level, cg.group_desc, cg.group_name").
		Join("LEFT", []string{"class_group", "cg"}, "cg.group_id = m.group_id").
		Where("m.user_id = ?", openId).Desc("m.level").Find(&infos)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("获取与自己相关群信息失败 %v", err))
		return false, nil
	}
	return true, infos
}
