package model

import (
	"time"
)

type NoticeCollect struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'notice_id' comment('通知id')"`
	Title      string    `xorm:"varchar(64) pk notnull  'notice_title' comment('通知标题')" form:"title" json:"title" binding:"required"`
	Desc       string    `xorm:"varchar(255) notnull  'notice_desc' comment('通知内容')" form:"desc" json:"desc" binding:"required"`
	CreateId   string    `xorm:"varchar(64) notnull  'create_id' comment('创建用户id')"`
	GroupId    string    `xorm:"varchar(64) notnull  'group_id' comment('组织id')"  form:"group_id" json:"group_id" binding:"required"`
	Enable     bool      `xorm:"Bool notnull  'enable' default 1 comment('是否可用')"`
	EndTime    time.Time `xorm:"DateTime notnull  'end_time' comment('结束时间')" form:"end_time" json:"end_time" binding:"required"`
	CreateTime time.Time `xorm:"DateTime notnull created unique 'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated unique 'update_time' comment('更新时间')"`
}

type RequestNotice struct {
	Title   string `form:"title" json:"title" binding:"required"`
	Desc    string `form:"desc" json:"desc" binding:"required"`
	GroupId string `form:"group_id" json:"group_id" binding:"required"`
	EndTime string `form:"end_time" json:"end_time" binding:"required"`
}
