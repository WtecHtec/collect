package router

import (
	"collect/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitRouter(r *gin.Engine) {
	authMiddleware := middleware.AuthMiddleware
	//登录接口
	r.POST("/login", authMiddleware.LoginHandler)
	// 跨域中间件
	r.Use(middleware.Cors())
	//加载静态资源，一般是上传的资源，例如用户上传的图片
	r.StaticFS("/upload", http.Dir("upload"))
	auth := r.Group("/auth")
	//退出登录
	auth.POST("/logout", authMiddleware.LogoutHandler)
	// 刷新token，延长token的有效期
	auth.POST("/refresh_token", authMiddleware.RefreshHandler)
	// JWT中间件
	auth.Use(authMiddleware.MiddlewareFunc())
	{
		AuthHelloHander(auth)
		InitAuthGroupRouter(auth)
		InitMember(auth)
		UpLoadFile(auth)
		InitAuthFeebBackRouter(auth)
		InitNotice(auth)
		InitMsgCollect(auth)
		InitAuthUserRouter(auth)
		InitSgNotice(auth)
		InitSgMsgCollect(auth)
	}
	TestHello(r)
}
