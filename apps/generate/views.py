from django.shortcuts import render
from django.views.generic import View
from utils import restful,files
from apps.analysis.models import NetWorkManager
import networkx as nx
import matplotlib.pyplot as plt
from datetime import datetime
import os
from django.conf import settings



class NetworkGenerate(View):
    def post(self, request):
        # name type kind val1 val2 val3
        info = request.POST.get("data")
        infos = info.split("^")
        G ,name = self.generate_network(infos)
        db_path, type = self.make_dir(G,name)
        G = files.read_network(db_path,type)
        node_labels, edge_labels = files.get_labels_from_graph(G)
        db_path = db_path
        num_node = G.number_of_nodes()
        num_link = G.number_of_edges()
        NetWorkManager.objects.create(name=name, path=db_path, type=type, num_node=num_node, num_link=num_link,
                                      labels_node=node_labels, labels_edge=edge_labels)
        return restful.success()

    file_type = "gml"

    def generate_network(self,infos):
        name = infos[0]
        type = infos[1]
        kind = infos[2]
        if type == "Atlas":
            if kind == "Atlas":
                i = infos[3]
                G = nx.graph_atlas(int(i))
        elif type == "Classic":
            if kind == "balanced_tree":
                r = int(infos[3])
                h = int(infos[4])
                G = nx.balanced_tree(r,h)
            elif kind == "complete_graph":
                n = int(infos[3])
                G = nx.complete_graph(n)
            elif kind == "binomial_tree":
                n = int(infos[3])
                G = nx.binomial_graph(n)
            elif kind == "circular_ladder_graph":
                n = int(infos[3])
                G = nx.circular_ladder_graph(n)
            elif kind == "full_rary_tree":
                r = int(infos[3])
                n = int(infos[4])
                G = nx.full_rary_tree(r,n)
            elif kind== "ladder_graph":
                n = int(infos[3])
                G = nx.ladder_graph(n)
            elif kind == "lollipop_graph":
                m = int(infos[3])
                n = int(infos[4])
                G = nx.lollipop_graph(m,n)
            elif kind == "path_graph":
                n = int(infos[3])
                G = nx.path_graph(n)
            elif kind == "star_graph":
                n = int(infos[3])
                G = nx.star_graph(n)
            elif kind == "turan_graph":
                n = int(infos[3])
                r = int(infos[4])
                G = nx.turan_graph(n,r)
            elif kind == "wheel_graph":
                n = int(infos[3])
                G = nx.wheel_graph(n)
        elif type == "Lattice":
            m = int(infos[3])
            n = int(infos[4])
            if kind == "grid_2d_graph":
                G = nx.grid_2d_graph(m, n)
            elif kind == "hexagonal_lattice_graph":
                G = nx.hexagonal_lattice_graph(m, n)
            elif kind == "triangular_lattice_graph":
                G = nx.triangular_lattice_graph(m, n)
        elif type == "Small":
            index = self.kinds.index(kind)
            G = self.functions[index]
        elif type == "Random":
            if kind == "erdos_renyi_graph":
                n = int(infos[3])
                p = int(infos[4])
                G = nx.erdos_renyi_graph(n,p)
            elif kind == "small_world_graph":
                n = int(infos[3])
                k = int(infos[4])
                p = int(infos[5])
                G = nx.newman_watts_strogatz_graph(n,k,p)
            elif kind == "connected_small_world_graph":
                n = int(infos[3])
                k = int(infos[4])
                p = int(infos[5])
                G = nx.connected_watts_strogatz_graph(n, k, p)
            elif kind == "random_regular_graph":
                d = int(infos[3])
                n = int(infos[4])
                G = nx.random_regular_graph(d,n)
            elif kind == "barabasi_albert_graph":
                n = int(infos[3])
                m = int(infos[4])
                G = nx.barabasi_albert_graph(n, m)
            elif kind == "powerlaw_cluster_graph":
                n = int(infos[3])
                m = int(infos[4])
                p = int(infos[5])
                G = nx.powerlaw_cluster_graph(n,m,p)
            elif kind == "random_lobster":
                n = int(infos[3])
                p1 = float(infos[4])
                p2 = float(infos[5])
                G = nx.random_lobster(n,p1,p2)
        elif type =="Directed":
            if kind == "gnr_graph":
                n = int(infos[3])
                p = float(infos[4])
                G = nx.gnr_graph(n,p)
            elif kind == "scale_free_graph":
                n = int(infos[3])
                G = nx.scale_free_graph(n)
        elif type == "Geometric":
            if kind == "random_geometric_graph":
                n = int(infos[3])
                radius = float(infos[4])
                H = nx.random_geometric_graph(n,radius)
            elif kind == "waxman_graph":
                n = int(infos[3])
                H = nx.waxman_graph(n)

            pos_x,pos_y = self.get_pos_attribute(H)
            G = nx.Graph()
            G.add_nodes_from(H.nodes)
            G.add_edges_from(H.edges)
            nx.set_node_attributes(G,pos_x)
            nx.set_node_attributes(G,pos_y)
        elif type == "AS":
            if kind == "random_internet_as_graph":
                n = int(infos[3])
                G = nx.random_internet_as_graph(n)
        elif type == "Social":
            index = self.social_kinds.index(kind)
            G = self.social_functions[index]
            if kind in ["davis_southern_women_graph","florentine_families_graph","les_miserables_graph"]:
                nodes = G.nodes
                data = {}
                for node in nodes:
                    temp = {"name":node}
                    data.update({node:temp})
                nx.set_node_attributes(G,data)
        elif type == "Community":
            l = int(infos[3])
            k = int(infos[4])
            if kind == "caveman_graph":
                G = nx.caveman_graph(l,k)
            elif kind == "connected_caveman_graph":
                G = nx.connected_caveman_graph(l, k)
            elif kind == "ring_of_cliques":
                G = nx.ring_of_cliques(l,k)
            elif kind == "windmill_graph":
                G = nx.windmill_graph(l,k)
        elif type == "Trees":
            if kind == "random_tree":
                n = int(infos[3])
                G = nx.random_tree(n)
        elif type == "Cographs":
            if kind == "random_cograph":
                n = int(infos[3])
                G = nx.random_cograph(n)
        return G, name

    kinds = ["bull_graph", "chvatal_graph", "cubical_graph", "desargues_graph",
             "diamond_graph", "dodecahedral_graph", "frucht_graph", "heawood_graph", "house_graph", "house_x_graph",
             "hoffman_singleton_graph", "icosahedral_graph", "krackhardt_kite_graph", "moebius_kantor_graph",
             "octahedral_graph", "petersen_graph", "sedgewick_maze_graph", "tetrahedral_graph",
             "truncated_tetrahedron_graph",
             "tutte_graph"]
    functions = [nx.bull_graph(), nx.chvatal_graph(), nx.cubical_graph(), nx.desargues_graph(),
                 nx.diamond_graph(), nx.dodecahedral_graph(), nx.frucht_graph(), nx.heawood_graph(), nx.heawood_graph(),
                 nx.house_graph(), nx.house_x_graph(),
                 nx.hoffman_singleton_graph(), nx.icosahedral_graph(), nx.krackhardt_kite_graph(),
                 nx.moebius_kantor_graph(),
                 nx.octahedral_graph(), nx.petersen_graph(), nx.sedgewick_maze_graph(), nx.tetrahedral_graph(),
                 nx.truncated_cube_graph(), nx.tutte_graph()]
    social_kinds = ["karate_club_graph","davis_southern_women_graph","florentine_families_graph","les_miserables_graph"]
    social_functions = [nx.karate_club_graph(),nx.davis_southern_women_graph(),nx.florentine_families_graph(),nx.les_miserables_graph()]

    def make_dir(self,G,network_name):
        name = datetime.now().strftime('%Y\\%m')
        dir_path = os.path.join(settings.MEDIA_ROOT,name,network_name)
        exists = os.path.exists(dir_path)
        if not exists:
            os.makedirs(dir_path)
        path = os.path.join(dir_path,network_name + "." + self.file_type)
        nx.write_gml(G,path)
        db_path = os.path.join(name,network_name,network_name +"." + self.file_type)
        return db_path,self.file_type

    def get_pos_attribute(self,G):
        k = 3000
        poses = nx.get_node_attributes(G, "pos")
        print(poses)
        datum_x = {}
        datum_y = {}
        index = 0
        for pos in poses.values():
            datum_x.update({index:{"posX": k * pos[0]}})
            datum_y.update({index:{"posY": k * pos[1]}})
            index +=1
        return datum_x, datum_y
