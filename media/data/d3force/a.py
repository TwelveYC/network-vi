import json
import networkx as nx


d3force = open('media/data/d3force/d3force.json',encoding='utf-8')
datum = json.load(d3force)
edges = []
nodes = []
for data in datum:
    temp = data['data']
    if 'target' in temp.keys():
        ids = temp['id']
        target = temp['target']
        source = temp['source']
        num = temp['name']
        infos = (source,target,{'num':num})
        edges.append(infos)
    else:
        ids = temp['id']
        posX = temp['position']['x']
        posY = temp['position']['y']
        infos = (ids,{'posX':posX,'posY':posY})
        nodes.append(infos)
# {"group":"nodes","data":{"id":"node_1uonaqmk9cv400","position":{"x":844.8827468386969,"y":69.45217360487739},
# "group":"hospital","parent":"hospital","label":"hospital-node3297"},"id":"node_1uonaqmk9cv400"}
# G.add_nodes_from([(1, dict(size=11)), (2, {'color':'blue'})])
# G.add_edges_from([(0, 1), (1, 2)]) # using a list of edge tuples
# 3-tuples (u, v, d) where d is a dictionary containing edge data.
G = nx.Graph()
G.add_nodes_from(nodes)
G.add_edges_from(edges)
nx.write_gml(G,'asdf.gml')
