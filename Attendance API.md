# Attendance API
## Response
status code
```
200: OK
400: failed, bad request
401: no token or the token expired
500: server error
```
error message will be added to the response body if any
## account API
### /login POST
```json
{
    "username": string,
    "password": string,
    "remember": boolean(default=false)
}
```

### /signup POST
```json
{
    "username": string,
    "password": string
}
```

### /account/update POST
更改账户信息，目前仅支持密码修改
To change the account information, only for password currently
```json
{
    "username": string,
    "newVal" :{
        "password": string,
    }
}
```

## Courses
### /courses/list GET
获取当前用户的课程列表以及课程相关授课班级名
To get the courses list and the related classes name of current user

```json
[
    {
        "course": string,
        "classes": string[]
    }
]
```

### /courses/add POST
当前用户新增课程
To add a course to the courses list of current user
```json
{
    "course": string
}
```

### /courses/remove POST
删除当前用户的课程
To remove a course from the courses list of current user
```json
{
    "course": string
}
```
### /courses/update POST
更新课程名
To change the name of a course
```json
{
    "course": string,
    "newVal": {
        "course": string,
    }
}
```
### /courses/class/add POST
为某个课程添加授课班级
To add a class to a course
```json
{
    "course": string,
    "className": string,
}
```

### /courses/class/remove POST
从某个课程的班级中删除某个班级
To remove a class from the related classes list of a course
```json
{
    "course": string,
    "className": string,
}
```

### /courses/class/update POST
更新班级的信息，可用于或者更改班名
To update the information of a class, including changing the name of the class
```json
{
    "course": string,
    "className": string,
    "newVal": {
	"className": string,
    }
}
```

### /upload/rota POST
上传班级花名册
To upload the rota of a class
```json
{
    "course": string,
    "className": string
}
```

## Attend
### /attend POST
一次签到记录
To log an attendance record
```json
{
    "course": string,
    "className": string,
    "records": [
        {
            "uid": string,
            "name": string,
            "status": boolean
            "absentDetail": {
                "reason": ABSENT_RESON,
                "ps": string,
            }
        }
    ]
}
```
