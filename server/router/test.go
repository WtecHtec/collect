package router

import (
	"collect/dao"
	"collect/logger"
	"collect/uitls"
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
	user, _ := c.Get(uitls.Identity_Key)
	logger.Logger.Error(fmt.Sprintf("helloHandler====%v %v", user, uitls.Identity_Key))
	dao.FindGroupAndCollectCount("dc774e0f-1861-4695-9ddf-52b8e4fa394e", "")
	c.JSON(200, gin.H{
		"userID": claims[uitls.Identity_Key],
		"text":   "Hello World.",
	})
}
