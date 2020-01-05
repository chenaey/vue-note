#  记事本api
  
##  用户端
  
###  注册登录
  
请求路径 `/login`
请求方法 `POST`
  
请求参数
```JavaScript
{email :"email",
password :"password",
createTime:"createTime"
}
```
返回示例
```JavaScript
 {"code": 200, "data": {
            "message": "登录成功", "email": email,"isVip":user.get("isVip")
 }}
```
  
###  用户信息相关
  
请求路径 `/operatorUser`
请求方法 `POST`
####  新增用户
  
请求参数
```JavaScript
body={
    type:"add" ,
    email:"注册邮箱",
    password:"密码"
}
```
返回示例
```JavaScript
   {"code": 200, "data": {
                "message": "成功", "folder": result.get("folder")
            }}
  
```
####  删除用户
  
请求参数
```JavaScript
body={
    type:"del",
    id:"用户ID"
}
```
返回示例
```JavaScript
  {"code": 200, "data": {
                "message": "操作成功"
            }}
  
```
####  获取所有用户
  
请求参数
```JavaScript
body={
    type:"getAll",
}
```
返回示例
```JavaScript
{"code": 200, "data": {
            "message": "成功","list": list
        }}
```
####  设置Vip权限
  
请求参数
```JavaScript
body={
    type:"updateVip",
    isVip:"0",//0表示设置为Vip 1表示取消ViP
    id:"用户Id"
}
```
返回示例
```JavaScript
{"code": 200, "data": {
                "message": "操作成功"
            }}
```
  
###  新增记事本
  
请求路径 `/addnote` 
请求方法 `POST`
请求参数
```JavaScript
body={
{
    "email":"email",
    "isShare": 0,
    "folder": "folder",
    "createTime":"createTime",
    "content": {"title": "title",
                "tags": "tags",
                "text": "text",
                "imgs": "imgs",
                "video": "video"
                }
}
```
返回示例
```JavaScript
 {"code": 200, "data": {
            "message": "删除笔记成功"
        }}
```
###  导出笔记到word
  
请求路径 `/word`
请求方法 `POST`
  
请求参数
```JavaScript
body={
    type:"export",
    data:"笔记数据Json"
}
```
返回示例
  
```JavaScript
 {"code": 200,
                    "message": "操作成功", "file": name
                }
```
  
  
  
###  获取分享的笔记
  
请求路径 `/getsharenote`
请求方法 `POST`
  
请求参数
```JavaScript
无
```
返回示例
  
```JavaScript
 {"code": 200, "data": {
            "message": "获取成功", "list": list
        }}
```
###  获取所有笔记内容
  
请求路径 `/getnote`
请求方法 `POST`
  
请求参数
```JavaScript
无
```
返回示例
  
```JavaScript
     {"code": 200, "data": {
            "message": "获取笔记成功", "note": list
        }}
```
###  更新笔记内容
  
请求路径 `/updatenote`
请求方法 `POST`
  
请求参数
```JavaScript
body={_id: ,
        isShare,
        folder,
        content,
}
```
返回示例
  
```JavaScript
         {"code": 200, "data": {
            "message": "操作成功"
        }}
  
```
  
###  删除笔记内容
  
请求路径 `/delnote`
请求方法 `POST`
  
请求参数
```JavaScript
body={_id:"用户ID"}
  
```
返回示例
  
```JavaScript
        {"code": 200, "data": {
            "message": "删除笔记成功"
        }}
  
```
  
###  反馈相关
  
请求路径 `/feedback`
请求方法 `POST`
  
####  新增反馈
  
  
请求参数
```JavaScript
body={type:"add",
email:"用户邮箱",
createTime:"反馈时间",
content:"内容"
}
  
```
返回示例
  
```JavaScript
       {"code": 200, "data": {
                "message": "成功"
            }}
```
  
  
####  删除反馈
  
  
请求参数
```JavaScript
body={type:"del",
id:"用户id"
}
  
```
返回示例
  
```JavaScript
  {"code": 200, "data": {
                "message": "删除成功"
            }}
```
  
  
####  回复反馈
  
  
请求参数
```JavaScript
body={type:"replay",
reply:"回复内容"
}
  
```
返回示例
  
```JavaScript
 {"code": 200, "data": {
                "message": "成功"
            }}
```
  
####  获取我的所有反馈
  
  
请求参数
```JavaScript
body={email:"email",
reply:"回复内容"
}
  
```
返回示例
  
```JavaScript
{"code": 200, "data": {
            "message": "成功", "list": list,
        }}
```
  
  
###  版本管理
  
请求路径 `/version`
请求方法 `POST`
  
请求参数
```JavaScript
body={
type,
version,
createTime,
description,
url,
}
```
返回示例
```JavaScript
if type == "get":
    return {"code": 200, "data": {
                "message": "成功","list": list
            }}
if type=="add":
    return {"code": 200,"message": "操作成功"}
  
if type=="update":
    return {"code": 200, "data": { "message": "操作成功" }}
```
  
#  管理端
  
###  管理员登录
  
请求路径 `/adminlogin` 
请求方法 `POST`
请求参数
```
user = data.get("email")
password = data.get("password")
```
返回示例
```JavaScript
 {"code": 200, "data": {"message": "登录成功" }}
```
###  用户管理
  
请求路径 `/adminuser` 
请求方法 `POST`
####  新增用户
  
请求参数
```JavaScript
body={
    type:"add",
    email:"email",
    password:"password"
}
```
返回示例
```JavaScript
 {"code": 200, "data": {"message": "操作成功" }}
```
####  删除用户
  
请求参数
```JavaScript
body={
    type:"del",
    id:"id",
}
```
返回示例
```JavaScript
 {"code": 200, "data": {"message": "操作成功" }}
```
####  获取所有用户信息
  
请求参数
```JavaScript
body={
    type:"getAll",
}
```
返回示例
```JavaScript
{"code": 200, "data": {
            "message": "成功","list": list
        }}
```
####  设置用户ViP权限
  
请求参数
```JavaScript
body={
    type:"updateVip",
    isVip:"0",//0表示设置为Vip 1表示取消ViP
    id:"用户Id"
}
```
返回示例
```JavaScript
{"code": 200, "data": {
                "message": "操作成功"
            }}
```
###  获取所有反馈
  
请求路径 `/feedback` 
请求方法 `POST`
请求参数
```JavaScript
body={
    type:"getAll",
    isVip:"0",//0表示设置为Vip 1表示取消ViP
    id:"用户Id"
}
```
返回示例
```JavaScript
{"code": 200, "data": {
            "message": "成功", "list": list
        }}
```
  