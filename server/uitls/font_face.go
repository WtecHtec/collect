package uitls

import (
	"collect/logger"
	"fmt"

	"github.com/fogleman/gg"
	"golang.org/x/image/font"
)

var GG_FONT_FACE font.Face
var GG_FONT_STATUS bool

func InitFontFace() (bool, font.Face) {
	logger.Logger.Info("初始化字体 start")
	ft, err := gg.LoadFontFace("./config/font.ttf", 10)
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("初始化字体失败%v", err))
		GG_FONT_STATUS = false
		return false, nil
	}
	GG_FONT_FACE = ft
	GG_FONT_STATUS = true
	logger.Logger.Info("初始化字体 success")
	return true, ft
}

func DrawWaterMarker(imgPath string, word string) bool {
	im, err := gg.LoadImage(fmt.Sprintf("./upload/%v", imgPath))
	if err != nil {
		logger.Logger.Error(fmt.Sprintf("加载图片失败%v", err))
		return false
	}
	w := im.Bounds().Size().X
	h := im.Bounds().Size().Y
	fmt.Print(w, h)
	dc := gg.NewContext(w, h)
	// dc.SetFontFace(GG_FONT_FACE)
	rd := w / 375
	if err := dc.LoadFontFace("./config/font.ttf", float64(rd*24)); err != nil {
		fmt.Print(err)
	}
	dc.DrawImage(im, 0, 0)
	sw, sh := dc.MeasureString(word)
	dc.SetRGBA(99, 99, 99, 0.6)
	dc.Rotate(-0.4)
	for j := 0; j < h*2*rd; j += (int(sh + float64(30*rd))) {
		for i := -w / 2; i < w-(24*rd); i += (int(sw + float64(24*rd))) {
			dc.Push()
			dc.DrawString(word, float64(i), float64(j))
			dc.Pop()
		}
	}
	dc.SavePNG(fmt.Sprintf("./upload/%v", imgPath))
	return true
}
