package model

import "time"

type Member struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'member_id' comment('成员表id')"`
	Name       string    `xorm:"varchar(64) notnull unique 'member_name' comment('成员名字')"`
	UserId     string    `xorm:"varchar(64) notnull unique 'user_id' comment('用户id')"`
	GroupId    string    `xorm:"varchar(64) notnull unique 'group_id' comment('组织id')"`
	Level      int8      `xorm:"Int notnull unique 'level' default 0 comment('成员等级0：成员、1：管理者')"`
	Enable     bool      `xorm:"Bool notnull unique 'enable' default 1 comment('是否可用')"`
	CreateTime time.Time `xorm:"DateTime notnull created unique 'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated unique 'update_time' comment('更新时间')"`
}