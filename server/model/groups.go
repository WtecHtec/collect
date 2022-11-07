package model

import "time"

type ClassGroup struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'group_id' comment('团体id')"`
	Name       string    `xorm:"varchar(64) notnull unique 'group_name' comment('团体名称')" form:"name" json:"name" binding:"required"`
	Desc       string    `xorm:"varchar(255) notnull  'group_desc' comment('团体介绍')" form:"desc" json:"desc" binding:"required"`
	CreateId   string    `xorm:"varchar(64) notnull  'create_id' comment('创建用户id')"`
	Enable     bool      `xorm:"Bool notnull  'enable' default 1 comment('是否可用')"`
	CreateTime time.Time `xorm:"DateTime notnull created unique 'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated unique 'update_time' comment('更新时间')"`
}

type RequestClassGroup struct {
	Name     string `form:"name" json:"name" binding:"required"`
	Desc     string `form:"desc" json:"desc" binding:"required"`
	UserName string `form:"username" json:"username" binding:"required"`
}
