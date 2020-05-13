import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.colors

# G = nx.karate_club_graph()
# x = [3,4,14,2,1,8,22,20,18,13,12,7,17,6,5,11]
# # instructor
#
# attr = {}
# for index in range(G.number_of_nodes()):
#     if index in x:
#         attr.update({index:"instructor"})
#     else:
#         attr.update({index:"admin"})
# nx.set_node_attributes(G,attr,"category")
# print(G.adj)
# nx.write_gml(G,"karate_club")
G = nx.Graph()
G.add_nodes_from([0,1,2])
G.add_edges_from([(0,1),(1,2)])
nx.set_node_attributes(G,{0:{"graphics":{"color":"#dsfs"}}})
print(G.adj)