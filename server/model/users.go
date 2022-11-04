package model

import "time"

type User struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'user_id' comment('用户id')"`
	Name       string    `xorm:"varchar(64) notnull unique 'user_name' comment('用户名称')"`
	OpenId     string    `xorm:"varchar(64) notnull unique 'wx_openid' comment('用户微信OpenId')"`
	PhoneNumer string    `xorm:"varchar(64) notnull unique 'user_phone' comment('用户手机号码')"`
	HeadeImg   string    `xorm:"varchar(255) notnull unique 'user_head' comment('用户手机号码')"`
	Enable     bool      `xorm:"Bool notnull unique 'enable' default 1 comment('是否可用')"`
	CreateTime time.Time `xorm:"DateTime notnull created unique 'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated unique 'update_time' comment('更新时间')"`
}
