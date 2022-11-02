package config

import (
	"collect/logger"
	"fmt"
	"io/ioutil"

	"gopkg.in/yaml.v2"
)

//解析yml文件
type BaseInfo struct {
	Port  string    `yaml:"port"`
	Redis RedisData `yaml:"redis"`
	Mysql MySQLData `yam:"mysql"`
}

type RedisData struct {
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	DataBase string `yaml:"dataBase"`
	Timeout  string `yaml:"timeout"`
}

type MySQLData struct {
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	DataBase string `yaml:"dataBase"`
	User     string `yaml:"user"`
	Password string `yaml:"password"`
}

var BASE_CONFIG *BaseInfo

func InitConfig() {
	yamlFile, err := ioutil.ReadFile("./server_config.yml")
	if err != nil {
		logger.Logger.Error(err.Error())
	}
	var c *BaseInfo
	err = yaml.Unmarshal(yamlFile, &c)
	if err != nil {
		logger.Logger.Error(err.Error())
	}
	BASE_CONFIG = c
	logger.Logger.Info(fmt.Sprintf("初始化配置 %v", BASE_CONFIG))
}
