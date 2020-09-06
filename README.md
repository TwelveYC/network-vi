# network-vi
复杂网络可视化工具
---
## ![Image text](https://s1.ax1x.com/2020/09/06/wZbg6e.jpg)
## 工具由复旦大学超复杂网络科学与智慧系统实验室开发
这个工程是复杂网络可视化工具network-vi的开源库，它是使用Django作为web后台，使用Cytoscape.js作为前端网络渲染库，使用echarts来进行相应的作图。

复杂网络中的物理实体与逻辑信息之间的联系由数据驱动，执行完成网络特征分析及其可视化。复杂网络可视
化工具的迅速发展有利于用户直接洞察网络结构, 获取网络信息。当用户分析网络时, 既需要统计各种物理量，帮助分析网
络拓扑, 又要通过不同的视觉通道映射帮助分析统计物理量, 二者密不可分。

这个工程的提出一个复杂网络可视交互分析系统——Network-VI, 整合了一整套交互操作, 计算网络元素（节点或边）统计物理量，自定义的网络元素查询引擎以及视觉通道控制
操作。用户能够实现多种属性之间的组合查询, 通过统计物理量和拓扑结构的精确映射, 获得直观体现网络属性和结构的布
局和图表, 达到分析网络的目的。实证研究了复杂网络中的社团划分和多中心性评估(MCA), 证明了该可视化系统的有效性
和实用性。


## 怎么使用它

### 软件要求
Python >=3.7   
Django >=2.2.7  
numpy  
matplotlib  
scipy  
pymysql  
and so on 
### 具体使用方式
因为Django服务器在移植的时候有一些要求，需要按照以下的步骤才行成功运行：
1. 删除在/apps/anaylsis/migrations and /apps/generate/migrations/目录下的迁移文件
2. 在本地的mysql数据库中创建一个数据库名字可以任取
3. 更改settings文件中的 DATABASES 选项,特别是数据库名字和密码
4. 执行以下迁移脚本的命令  
`python manage.py makemigrations`  
`python manage.py migrate`
5. 然后执行下面命令开启服务器，即可在`http://localhost:8000/analysis/`进入界面。  
`python manage.py runserver`
## 二次开发
如果你想要二次开发，需要使用gulp打包工具。
1. 首先安装全局安装gulp3.9(注意版本)
`npm install gulp@3.9 -g`
2. 然后cd 到front文件夹下执行 `npm install`,即可开启gulp的监听打包任务，即可二次开发。





