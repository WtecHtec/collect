package middleware

import (
	"collect/config"
	"collect/dao"
	"collect/logger"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

var URL = "https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code"

// 登录逻辑
func Authenticator(c *gin.Context) (interface{}, error) {
	var loginVals login
	if err := c.ShouldBind(&loginVals); err != nil {
		return "", jwt.ErrMissingLoginValues
	}
	openId := getWXOpen(loginVals.Code, loginVals.NickName)
	if openId != "" {
		loginStatus := dao.CreateUser(openId, loginVals.AvatarUrl, loginVals.NickName)
		if loginStatus {
			return &User{
				OpenId: openId,
			}, nil
		} else {
			return nil, jwt.ErrFailedAuthentication
		}
	}
	return nil, jwt.ErrFailedAuthentication
}

func getWXOpen(code string, nickName string) string {
	wxConfig := config.BASE_CONFIG.WxConfig
	url := fmt.Sprintf("%v&appid=%v&secret=%v&js_code=%v", URL, wxConfig.Appid, wxConfig.AppSecret, code)
	resp, err := http.Get(url)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("获取openId 失败：%v", nickName))
		return ""
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	user := &User{}
	json.Unmarshal([]byte(body), user)
	if resp.StatusCode == 200 {
		logger.Logger.Info(fmt.Sprintf("获取openId 成功：%v", nickName))
		return user.OpenId
	}
	logger.Logger.Error(fmt.Sprintf("获取openId 失败：%v", nickName))
	return ""
}

func handleLoginResponse(c *gin.Context, code int, message string, time time.Time) {
	openId := paserToken(message)
	info, ok := dao.GetUserInfoByOpenId(openId)
	if ok == false {
		c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"minikey": message,
		"code":    http.StatusOK,
		"info":    info,
	})
}

// 解析token
func paserToken(token string) string {
	tk, ok := AuthMiddleware.ParseTokenString(token)
	if ok != nil {
		logger.Logger.Error("paserToken error")
		return ""
	}
	claims := jwt.ExtractClaimsFromToken(tk)
	return claims[Identity_Key].(string)
}
