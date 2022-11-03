package datasource

import (
	"collect/config"
	"collect/logger"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
)

var Engine *xorm.Engine

func InitMysqlXORM() {
	logger.Logger.Info("MySQL start ")
	mysqlConfig := config.BASE_CONFIG.Mysql
	configData := fmt.Sprintf("%v:%v@(%v:%v)/%v?charset=utf8&interpolateParams=true&parseTime=true&loc=Local", mysqlConfig.User, mysqlConfig.Password, mysqlConfig.Host, mysqlConfig.Port, mysqlConfig.DataBase)
	db, err := xorm.NewEngine("mysql", configData)

	if err != nil {
		logger.Logger.Error("MySQL error ")
		return
	}
	err = db.Ping()
	if err != nil {
		logger.Logger.Error("MySQL Ping error ")
		return
	}
	// db.SetMaxOpenConns(50)
	// db.SetMaxIdleConns(50)
	Engine = db
	logger.Logger.Info("MySQL success ")
}
