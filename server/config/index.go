package config

import (
	"fmt"
	"io/ioutil"

	"gopkg.in/yaml.v2"
)

//解析yml文件
type BaseInfo struct {
	Port  string    `yaml:"port"`
	Redis RedisData `yaml:"redis"`
}

type RedisData struct {
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	DataBase string `yaml:"dataBase"`
	Timeout  string `yaml:"timeout"`
}

func (c *BaseInfo) GetConf() *BaseInfo {
	yamlFile, err := ioutil.ReadFile("./server_config.yml")
	if err != nil {
		fmt.Println(err.Error())
	}
	err = yaml.Unmarshal(yamlFile, c)
	if err != nil {
		fmt.Println(err.Error())
	}
	return c
}
