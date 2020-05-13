import networkx as nx
import json


G = nx.read_gml('metabolicpos.gml',label='id')

nodes = G.nodes()
edges = G.edges()


elements = []
len_nodes = len(nodes)
len_edges = len(edges)

for node_id in range(len_nodes):
    node = nodes[node_id]
    label = int(node['label'])
    posX = int(node['graphics']['x'])
    posY = int(node['graphics']['y'])
    u = {'data':{'id':("%d" %node_id),'weight':label,'posX':posX,'posY':posY}}
    elements.append(u)

edge_id = 0
for edge in edges:
    source = edge[0]
    target = edge[1]
    u = {'data':{'id':("%d_%d_%d" %(source,target,edge_id)),'source':("%d" %source),'target':("%d" %target)}}
    edge_id +=1
    elements.append(u)

with open('metabolicpos.json','w') as fp:
    ele = json.dump(elements,fp)
print("ok")