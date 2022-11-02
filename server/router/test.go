package router

import (
	"collect/logger"
	"collect/middleware"
	"fmt"
	"net/http"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

func TestHello(r *gin.Engine) {
	// // gin.Context，封装了request和response
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "hello World!")
	})
}

func AuthHelloHander(r *gin.RouterGroup) {
	r.GET("/hello", helloHandler)
}

func helloHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	user, _ := c.Get(middleware.Identity_Key)
	logger.Logger.Error(fmt.Sprintf("helloHandler====%v %v", user, middleware.Identity_Key))
	c.JSON(200, gin.H{
		"userID": claims[middleware.Identity_Key],
		"text":   "Hello World.",
	})
}
