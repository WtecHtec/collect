package middleware

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

// 登录逻辑
func Authenticator(c *gin.Context) (interface{}, error) {
	var loginVals login
	if err := c.ShouldBind(&loginVals); err != nil {
		return "", jwt.ErrMissingLoginValues
	}
	if loginVals.Code == "admin" {
		return &User{
			OpenId:      "openid",
			UserName:    "Bo-Yi",
			PhoneNumber: "14785968565",
		}, nil
	}
	return nil, jwt.ErrFailedAuthentication
}
