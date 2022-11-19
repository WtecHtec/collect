package model

import "time"

type User struct {
	Id         string    `xorm:"varchar(64) pk notnull unique 'user_id' comment('用户id')"`
	Name       string    `xorm:"varchar(64) 'user_name' comment('用户名称')"`
	OpenId     string    `xorm:"varchar(64) notnull unique 'wx_openid' comment('用户微信OpenId')" json:"openid"`
	PhoneNumer string    `xorm:"varchar(64) notnull unique 'user_phone' comment('用户手机号码')"`
	HeadeImg   string    `xorm:"varchar(255) notnull  'user_head' comment('用户头像')"`
	Gender     string    `xorm:"varchar(4) notnull  'user_gender' comment('用户性别 M代表男性,W代表女性')"`
	Enable     bool      `xorm:"Bool notnull  'enable' default 1 comment('是否可用')"`
	CreateTime time.Time `xorm:"DateTime notnull created  'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated  'update_time' comment('更新时间')"`
}

// 用户数据更新
type UserUpdate struct {
	Name       string `form:"user_name" json:"user_name" binding:"required"`
	PhoneNumer string `form:"phone_numer" json:"phone_numer" binding:"required"`
	Gender     string `form:"user_gender" json:"user_gender" binding:"required"`
}
