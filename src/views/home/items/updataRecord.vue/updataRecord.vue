<script setup lang="ts">

</script>

<template>
  <div class="h-100 overflow-auto">
    <table>
      <thead>
        <tr>
          <th>版本号</th>
          <th>更新日期</th>
          <th>更新内容</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>beta0.1</td>
          <td>2025.7.26</td>
          <td>
            <div>
              1、具有编辑员工，岗位信息，可添加休息人员，并约束每天休息人员数量以及节假日员工数。
            </div>
            <div>
              2、可把机动岗位的工作人员安插到休息人员岗位
            </div>
            <div>
              3、钉钉免登：打开小程序，自动获取钉钉账号信息，实现一键登录
            </div>
            <div>
              4、周六周日节假日部分岗位数量以及上班时间有变化
            </div>
            <div>
              5、岗位分时段：减少工价高员工工作时长，用低价员工替班，减少人工费用
            </div>
            <div>
              6、表格导入，系统读取表格上面信息，自动获取员工信息
            </div>
            <div>
              7、男女卫生间岗位限制男女
            </div>
            <div>
              8、一键排班按钮：完善员工信息后，从机动人员中随机选人一键排班
            </div>
          </td>
        </tr>
        <tr>
          <td>beta0.2</td>
          <td>2025.8.3</td>
          <td>1、替班表：录入岗位替班人员，从替班人员中随机选择生成排班表</td>
        </tr>
        <tr>
          <td>beta0.3</td>
          <td>2025.8.6</td>
          <td>
            <div>
              1、在员工休假表上选择休假人员时后面显示员工距离上次休假已上多少天班。
            </div>
            <div>
              2、增加一个指定岗位功能，在某一天指定一名员工去替岗
            </div>
          </td>
        </tr>
        <tr>
          <td>beta0.4</td>
          <td>2025.8.12</td>
          <td>
            <div>
              1、要可以查看休假历史记录。
            </div>
            <div>
              2、收餐区上班时间变动，员工一早班一晚班自动变动
            </div>
            <div>
              3、岗位人员支援，一个员工上早班就把另一个人晚班早上的活一起做了，一个员工晚班就把另一个早班人员的工作一起做了，不需要其他岗位人员顶岗
            </div>
            <div>
              4、低价替高价人员，必须要在高价人员替岗人员名单之内
            </div>
            <div>
              5、一早一晚岗位的人员休息，替班人员也按照原岗位早晚班时间替岗
            </div>
          </td>
        </tr>
        <tr>
          <td>beta0.5</td>
          <td>2025.8.13</td>
          <td>
            <div>
              生成表格要生成两个，一个是自用表格，一个是发给甲方的表格，格式也要和平时自己发的一样
            </div>
          </td>
        </tr>
        <tr>
          <td>beta0.6</td>
          <td>2025.8.14</td>
          <td>
            <div>
              满足某岗位最低要求人数
            </div>
          </td>
        </tr>
        <tr>
          <td>beta0.7</td>
          <td>2025.8.18</td>
          <td>
            <div>
              1、自己可以设置岗位固定时间的变动.
            </div>
            <div>
              2、生成排班表可以自己进行修改
            </div>
            <div>
              3、可以查看生成表格的历史记录，可以预览排班表
            </div>
            <div>
              4、能查看生成排班表员工的总工时以及人工费用
            </div>
            <div>
              5、可以在已生成的排班表上互换岗位人员
            </div>
            <div>
              6、周六周天只有美食街岗位有变动，其他岗位时间变动是节假日不是周六周日
            </div>
            <div>
              7、生成排班表替班人员不是自己想要的，需要自己修改，岗位分时段系统分的混乱，要自己来分时段
            </div>
          </td>
        </tr>
        <tr>
          <td>beta0.8</td>
          <td>2025.9.12</td>
          <td>
            <div>
              1、没有排到班的岗位标注红色，并添加安排岗位功能.
            </div>
            <div>
              2、更改了自用表的格式
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
    max-width: 900px;
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin: 20px 0;
}

header {
    text-align: center;
    padding: 20px 15px;
    background: #2c3e50;
    color: white;
}

h1 {
    font-size: 28px;
    margin-bottom: 8px;
}

.subtitle {
    font-size: 16px;
    opacity: 0.8;
}

.table-container {
    overflow-x: auto;
    padding: 0 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

th, td {
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

th {
    background-color: #3498db;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

tr:nth-child(even) {
    background-color: #f8f9fa;
}

tr:hover {
    background-color: #e8f4fc;
    transition: background-color 0.3s ease;
}

footer {
    text-align: center;
    padding: 20px;
    font-size: 14px;
    color: #7f8c8d;
    background: #f8f9fa;
    border-top: 1px solid #e0e0e0;
}

@media (max-width: 600px) {
    th, td {
        padding: 12px 15px;
    }

    h1 {
        font-size: 22px;
    }
}
</style>
