# network-vi
complex network visualization tool 
---
This project is my first visualization production. 
**there are some good qualities in complex network analysis filed.**
---
In complex network filed, physical quantities and algorithms such as centrality and community detection develop rapidly, complex network visualization tools are also developing quickly, which help users intuitively observe the network strcture and obtain network knowledge.

When users analyze network visually, users not only need the help of various network statistical physical quantities to analyze the network topology, but also need the help of topology to analyze statistical physical quantities through different visual channels, which are inseparable from each other. This paper proposes a complex network visualization interaction analysis system, Network-VI,  which integrates a whole set of interactive operations, including computing statistical physical quantities of network elements (nodes or edges), a custom network element query engine, and visual channel control operations.

Users can realize the combination of a variety of attributes query, obtain the layout and diagram that directly reflect network attributes and structure, to achieve the purpose of network analysis through the accurate mapping of statistical physical quantities and topological structure . 

## How to use network-vi

I use Django as backend server, and Cytoscape.js and Echarts.js are used as fontend.

### software requirement
Python >=3.7
Django >2.2.7
numpy
matplotlib
scipy
pymysql
and so on
## How to use it
Because Django server has some requirement on local mysql database,you should follow those steps:
1. delete migration files in /apps/anaylsis/migrations and /apps/gengrate/migrations/
2. creat a mysql database which You can name anything you want.
3. change settings file DATABASES option, especially NAME and password. I use shengming as my local mysql db password, it's my personal habit.
4. execute following commands to creat migration file. 
### *python manage.py makemigrations* and *python manage.py migrate*
5.then use following command to run local server, then you can enter http://localhost:8000/analysis/
### python manage.py runserver
## second development
if you want to develop this project, remeber cd /front folder and execute 
### npm install




