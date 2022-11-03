package model

import "time"

type Mul_Model struct {
	Enable     bool      `xorm:"Bool notnull unique 'enable' default 1 comment('是否可用')"`
	CreateTime time.Time `xorm:"DateTime notnull created unique 'create_time' comment('创建时间')"`
	UpdateTime time.Time `xorm:"DateTime notnull updated unique 'update_time' comment('更新时间')"`
}
