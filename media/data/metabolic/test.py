import networkx as nx
import json

# G = nx.read_gml("power.gml",label='id')
# nx.write_gexf(G,'power.gexf')

G = nx.read_gml('metabolic.gml',label='id')
nx.write_gexf(G,'metabolic.gexf')


nodes = G.nodes()
edges = G.edges()


elements = []
len_nodes = len(nodes)
len_edges = len(edges)


for node_id in range(len_nodes):
    node = nodes[node_id]
    label = int(node['label'])
    u = {'data':{'id':("%d" %node_id),'label':label}}
    elements.append(u)

edge_id = 0
for edge in edges:
    source = edge[0]
    target = edge[1]
    u = {'data':{'id':("%d_%d_%d" %(source,target,edge_id)),'source':("%d" %source),'target':("%d" %target)}}
    edge_id +=1
    elements.append(u)

with open('metabolic.json','w') as fp:
    ele = json.dump(elements,fp)
    
