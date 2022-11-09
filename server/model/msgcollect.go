package model

import "time"

type MsgCollect struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'collect_id' comment('收集id')"`
	NoticeId   string    `xorm:"varchar(64) notnull  'notice_id' comment('通知id')" form:"notice_id" json:"notice_id" binding:"required"`
	CreateId   string    `xorm:"varchar(64) notnull  'create_id' comment('用户id')"`
	GroupId    string    `xorm:"varchar(64) notnull  'group_id' comment('组织id')" form:"group_id" json:"group_id" binding:"required"`
	RelaId     string    `xorm:"varchar(64) notnull  'rela_id' comment('关系id')"`
	Desc       string    `xorm:"varchar(255) notnull  'collect_desc' comment('备注')" form:"desc" json:"desc" binding:"required"`
	ImgUrls    string    `xorm:"varchar(255) notnull  'img_urls' comment('图片路径')" form:"img_urls" json:"img_urls" binding:"required"`
	CreateTime time.Time `xorm:"DateTime notnull created unique 'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated unique 'update_time' comment('更新时间')"`
}
