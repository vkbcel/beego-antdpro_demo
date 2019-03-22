package main

import (
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
	"net/http"
	"strconv"
)

type User struct {
	User   string `json:"user"`
	Passwd string `json:"passwd"`
}

type UserController struct {
	beego.Controller
}

func (c *UserController) Login() {
	var user User
	var err error
	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &user); err == nil {
		if user.User == "zhang" && user.Passwd == "san" {
			c.Data["json"] = &map[string]string{
				"status": "ok",
				"username": user.User,
			}
		} else {
			c.Data["json"] = "authentication error"
		}
	} else {
		c.Data["json"] = err.Error()
	}
	c.ServeJSON()
}

func (c *UserController) CurrentUser() {
	c.Data["json"] = &map[string]interface{}{
		"name": "张三",
		"userid": "000000001",
		"email": "antdesign@alipay.com",
		"signature": "海纳百川，有容乃大",
		"title": "交互专家",
		"group": "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
		"notifyCount": 12,
		"unreadCount": 11,
		"country": "China",
		"address": "西湖区工专路 77 号",
		"phone": "0752-268888888",
	}
	c.ServeJSON()
	return
}

func (c *UserController) List() {
	c.Data["json"] = &[]User{
		User{"zhang", "san"},
		User{"li", "si"},
	}
	c.ServeJSON()
	return
}

type Bank struct {
	Id		int		`json:"id"`
	Name	string	`json:"name"`
	Address string	`json:"address"`
	Mobile  string	`json:"mobile"`
}

var banks = []*Bank{
	&Bank{0, "工商银行", "中关村东路", "156000000"},
}

type BankController struct {
	beego.Controller
}

func (c *BankController) List() {
	c.Data["json"] = &banks
	c.ServeJSON()
	return
}

func (c *BankController) Create() {
	var bank Bank
	var err error
	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &bank); err == nil {
		if len(banks) == 0 {
			bank.Id = 0
		} else {
			bank.Id = banks[len(banks) - 1].Id + 1
		}
		banks = append(banks, &bank)
		c.Data["json"] = "ok"
	} else {
		c.Data["json"] = err.Error()
	}
	c.ServeJSON()
	return
}

func (c *BankController) Delete() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.Data["json"] = err.Error()
		c.ServeJSON()
		return
	}
	for index := range banks {
		fmt.Println(index, banks[index])
		if banks[index].Id == id {
			banks=append(banks[:index],banks[index+1:]...)
		}
	}
	c.Data["json"] = "ok"
	c.ServeJSON()
	return
}

func (c *BankController) Update() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.Data["json"] = err.Error()
		c.ServeJSON()
		return
	}
	var bank Bank
	if err = json.Unmarshal(c.Ctx.Input.RequestBody, &bank); err == nil {
		c.Data["json"] = "not found"
		for index := range banks {
			if banks[index].Id == id {
				banks[index] = &bank
				c.Data["json"] = banks[index]
			}
		}
		c.Data["json"] = "ok"
	} else {
		c.Data["json"] = err.Error()
	}

	c.ServeJSON()
	return
}

func (c *BankController) Get() {
	idStr := c.Ctx.Input.Param(":id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.Data["json"] = err.Error()
		c.ServeJSON()
		return
	}
	c.Data["json"] = &Bank{}
	for index := range banks {
		if banks[index].Id == id {
			c.Data["json"] = banks[index]
		}
	}
	c.ServeJSON()
	return
}

func init() {
	beego.Router("/api/login/account", &UserController{}, "post:Login")
	beego.Router("/api/users", &UserController{}, "get:List")
	beego.Router("/api/current_user", &UserController{}, "get:CurrentUser")

	beego.Router("/api/banks", &BankController{}, "get:List;post:Create")
	beego.Router("/api/bank/:id", &BankController{}, "get:Get;post:Update;delete:Delete")

	beego.Get("/admin/*", func(ctx *context.Context) {
		length := len("/admin")
		name := ctx.Request.URL.Path[length:]
		http.ServeFile(ctx.ResponseWriter, ctx.Request, "front/dist"+name)
	})
}

func main() {
	beego.BConfig.CopyRequestBody = true
	beego.BConfig.WebConfig.Session.SessionOn = true
	beego.Run("0.0.0.0:8080")
}
