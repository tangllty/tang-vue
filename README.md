# tang-vue

#### 项目简介

tang-vue 是基于 Spring Boot3 的权限管理系统

* 采用 Spring Boot3 + Spring Security + MyBatis + Redis + Jwt

#### 环境要求

* OpenJDK 17.0.6
* Apache Maven 3.8.7
* Mysql 8.0.29
* Redis 7.0.2

#### 项目启动

1. 执行 databases/20221210.sql 文件 ( **包含 drop database 语句, 请仔细查看后执行 sql 文件** )
2. 修改 tang-admin/src/main/resources/application.yml password 等信息
3. 修改 tang-admin/src/main/resources/logback.xml 日志存放路径
4. ```
   $ mvn package && cd tang-admin/target && java -jar tang-admin.jar
   ```

#### 项目地址

| 项目 | Gitee                                        | GitHub                                         |
| ---- | -------------------------------------------- | ---------------------------------------------- |
| 后端 | [tang-vue](https://gitee.com/tangllty/tang-vue) | [tang-vue](https://github.com/tangllty/tang-vue)  |
| 前端 | [tang-ui](https://gitee.com/tangllty/tang-ui)   | [tang-ui](https://github.com/tangllty/tang-ui)    |
