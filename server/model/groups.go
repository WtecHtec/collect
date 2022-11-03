package model

import "time"

type Group struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'group_id' comment('团体id')"`
	Name       string    `xorm:"varchar(64) notnull unique 'group_name' comment('团体名称')"`
	Desc       string    `xorm:"varchar(255) notnull unique 'wx_openid' comment('团体介绍')"`
	CreateId   string    `xorm:"varchar(64) notnull unique 'create_id' comment('创建用户id')"`
	Enable     bool      `xorm:"Bool notnull unique 'enable' default 1 comment('是否可用')"`
	CreateTime time.Time `xorm:"DateTime notnull created unique 'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated unique 'update_time' comment('更新时间')"`
}
