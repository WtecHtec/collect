package main

import (
	"collect/config"
	"collect/logger"
)

func main() {
	// 初始化日志
	logger.InitLogger()
	// 初始化配置
	config.InitConfig()
	// 1.创建路由
	// r := gin.Default()
	// 2.绑定路由规则，执行的函数
	// gin.Context，封装了request和response
	// r.GET("/", func(c *gin.Context) {
	// 	c.String(http.StatusOK, "hello World!")
	// })
	// 3.监听端口，默认在8080
	// r.Run(":" + baseInfo.Port)
}
