package main

import (
	"collect/config"
	"collect/datasource"
	"collect/logger"
	"collect/middleware"
	"collect/model"
	"collect/router"
	"collect/uitls"
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化日志
	logger.InitLogger()
	// 初始化配置
	config.InitConfig()
	// 初始化MySQL
	datasource.InitMysqlXORM()
	// 初始化Redis
	datasource.InitRedis()
	// 同步数据结构
	model.InitModel()
	// 初始化JWT
	middleware.InitJWT()

	// 任务调度初始化
	uitls.InitTimeTask()
	// 1.创建路由
	r := gin.Default()
	// 加载路由
	router.InitRouter(r)
	// 3.监听端口，默认在8080
	r.Run(fmt.Sprintf(":%v", config.BASE_CONFIG.Port))
}

// package main

// import "collect/test"

// func main() {
// 	test.DrawImg()
// }
