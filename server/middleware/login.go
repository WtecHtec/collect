package middleware

import (
	"collect/config"
	"collect/dao"
	"collect/logger"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

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
		dao.CreateUser(openId, loginVals.AvatarUrl, loginVals.NickName)
		// return &User{
		// 	OpenId:      "openid",
		// 	UserName:    "Bo-Yi",
		// 	PhoneNumber: "14785968565",
		// }, nil
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
