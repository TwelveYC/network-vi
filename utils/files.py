from datetime import datetime
import os
from django.conf import settings
import networkx as nx


def make_dir(network_name,file):
    name = datetime.now().strftime('%Y\\%m')
    dir_path = os.path.join(settings.MEDIA_ROOT, name, network_name)
    exists = os.path.exists(dir_path)
    if not exists:
        os.makedirs(dir_path)
    path = os.path.join(dir_path, file.name)
    type = file.name.split('.')[-1]
    with open(path, 'wb') as fp:
        for chunk in file.chunks():
            fp.write(chunk)
    db_path = os.path.join(name, network_name, file.name)
    return db_path,type


def read_network_with_type(network,type=None):
    path = network.path
    if type:
        # 有type
        return read_network(path,type)
    else:
        type = network.type
        return read_network(path,type)


def read_network(path, type):
    path = os.path.join(settings.MEDIA_ROOT,path)
    if type == 'gml':
        return nx.read_gml(path,label='id')


def wirte_network_with_type(G,network,type=None):
    path = network.path
    if type:
        write_network(G,path,type)
    else:
        type = network.type
        write_network(G, path, type)
    return True


def write_network(G,path,type):
    path = os.path.join(settings.MEDIA_ROOT,path)
    if type == 'gml':
        nx.write_gml(G,path)
    return True


def get_labels_from_graph(G):
    nodes = G.nodes()
    edges = G.edges()
    labels = list(nodes[1].keys())

    if labels:
        node_labels = '?'.join(labels)
    else:
        node_labels = ''
    for edge in edges:
        start = edge[0]
        end = edge[1]
        labels = G.get_edge_data(start, end)
        break
    if labels:
        edge_labels = labels.keys()
        edge_labels = '?'.join(edge_labels)
    else:
        edge_labels = ''
    return node_labels,edge_labels


def get_labels_from_db(network,is_node=True):
    node_labels = network.labels_node
    edge_labels = network.labels_edge
    if is_node:
        if node_labels == '':
            labels = ['id']
        else:
            labels = ['id']
            node_labels = node_labels.split('?')
            if "graphics" in node_labels:
                node_labels.remove("graphics")
            if "tagShape" in node_labels:
                node_labels.remove("tagShape")
            labels.extend(node_labels)
    else:
        if edge_labels == '':
            labels = ['source','target']
        else:
            labels = ['source','target']
            edge_labels = edge_labels.split('?')
            labels.extend(edge_labels)
    return labels


def get_size_from_network(network):
    return network.num_node



def handle_network_labels(G,network):
    wirte_network_with_type(G, network)
    node_labels, edge_labels = get_labels_from_graph(G)
    network.labels_node = node_labels
    network.labels_edge = edge_labels
    network.save()