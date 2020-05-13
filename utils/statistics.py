import networkx as nx
from networkx.algorithms import centrality, shortest_paths, core, connectivity, assortativity
from networkx.algorithms import community
from networkx.algorithms.cluster import clustering
from . import data, files, node_modularity
import json
statistics_quantities = ['degree','betweenesscentrality','closenesscentrality','clustering','edgebetweeness',
                         'shortpath','degreehistogram','kcore','radar','node_connectivity',
                         'averageNeighborDegree','graphdensity',
                         'communitiesGirvanNewman','communitiesGreedyModularity',
                         'communitiesAsynLpa','communitiesLabelPropagation',
                         'communitiesAsynFluidc','betweenesshistogram','degreecentrality','eigenvectorcentrality',
                             'katzcentrality','currentflowbetweennesscentrality','communicabilitybetweennesscentrality',
                         'loadcentrality','subgraphcentrality','harmoniccentrality','secondordercentrality','informationcentrality',
                         'pagerank','modularitystrengthGirvanNewman','modularitystrengthGreedyModularity','modularitystrengthAsynLpa','modularitystrengthLabelPropagation',
                         'modularitystrengthAsynFluidc']

# degree_centrality betweenness_centrality closeness_centrality


def get_statistics_data(network, type, node_id=0):
    G = files.read_network_with_type(network)
    if type == statistics_quantities[0]:
        return data.get_dict_from_tuple(G.degree())
    elif type == statistics_quantities[1]:
        return centrality.betweenness_centrality(G)
    elif type == statistics_quantities[2]:
        return centrality.closeness_centrality(G)
    elif type == statistics_quantities[3]:
        return clustering(G)
    elif type == statistics_quantities[4]:
        return centrality.edge_betweenness_centrality(G)
    elif type == statistics_quantities[5]:
        return shortest_paths.shortest_path_length(G)
    elif type == statistics_quantities[6]:
        return nx.degree_histogram(G)
    elif type == statistics_quantities[7]:
        G.remove_edges_from(nx.selfloop_edges(G))
        return core.k_core(G)
    elif type == statistics_quantities[8]:
        nodes = G.nodes()
        return nodes[int(node_id)]
    elif type == statistics_quantities[9]:
        return connectivity.node_connectivity(G)
    elif type == statistics_quantities[10]:
        return assortativity.average_neighbor_degree(G)
    elif type == statistics_quantities[11]:
        return nx.density(G)
    elif type == statistics_quantities[12]:
        return community.girvan_newman(G)
    elif type == statistics_quantities[13]:
        return community.greedy_modularity_communities(G)
    elif type == statistics_quantities[14]:
        return community.asyn_lpa_communities(G)
    elif type == statistics_quantities[15]:
        return community.label_propagation_communities(G)
    elif type == statistics_quantities[16]:
        return get_best_community(G)
    elif type == statistics_quantities[17]:
        return centrality.betweenness_centrality(G)
    elif type == statistics_quantities[18]:
        return centrality.degree_centrality(G)
    elif type == statistics_quantities[19]:
        return centrality.eigenvector_centrality_numpy(G)
    elif type == statistics_quantities[20]:
        return centrality.katz_centrality_numpy(G)
    elif type == statistics_quantities[21]:
        return centrality.current_flow_betweenness_centrality(G)
    elif type == statistics_quantities[22]:
        return centrality.communicability_betweenness_centrality(G)
    elif type == statistics_quantities[23]:
        return centrality.load_centrality(G)
    elif type == statistics_quantities[24]:
        return centrality.subgraph_centrality(G)
    elif type == statistics_quantities[25]:
        #  要归一化处理
        return centrality.harmonic_centrality(G)
    elif type == statistics_quantities[26]:
        #  要归一化处理
        return centrality.second_order_centrality(G)
    elif type == statistics_quantities[27]:
        return centrality.information_centrality(G)
    elif type == statistics_quantities[28]:
        return nx.pagerank(G)
    elif type in statistics_quantities[29:34:1]:
        return get_node_modularity(G,network,type)
    else:
        raise NotImplementedError('还没有制作的统计物理量')


def get_statistics_data_with_type(statistics_data, type, node_num=None, G=None):
    if type == statistics_quantities[0]:
        return handle_statistics_degree(statistics_data)
    elif type == statistics_quantities[1]:
        return handle_statistics_betweeness(statistics_data)
    elif type == statistics_quantities[2]:
        return handle_statistics_closeness(statistics_data)
    elif type == statistics_quantities[3]:
        return handle_statistics_clustering(statistics_data)
    elif type == statistics_quantities[4]:
        return handle_statistics_edgebetweeness(statistics_data)
    elif type == statistics_quantities[5]:
        return handle_statistics_shortpath(statistics_data, node_num)
    elif type == statistics_quantities[6]:
        return handle_statistics_degreehistogram(statistics_data)
    elif type == statistics_quantities[7]:
        return handle_statistics_kcore(statistics_data)
    elif type == statistics_quantities[8]:
        return handle_statistics_radar(statistics_data, G)
    elif type == statistics_quantities[9]:
        return handle_statistics_node_connectivity(statistics_data)
    elif type == statistics_quantities[10]:
        return handle_statistics_average_neighbor_degree(statistics_data)
    elif type == statistics_quantities[11]:
        return handle_statistics_graph_density(statistics_data)
    elif type == statistics_quantities[12]:
        return handle_statistics_community_grivan_newman(statistics_data)
    elif type == statistics_quantities[13]:
        return handle_statistics_community_greedy(statistics_data)
    elif type == statistics_quantities[14]:
        return handle_statistics_community_asyn_lpa(statistics_data)
    elif type == statistics_quantities[15]:
        return handle_statistics_community_label_propagation(statistics_data)
    elif type == statistics_quantities[16]:
        return handle_statistics_community_asyn_fludic(statistics_data)
    elif type == statistics_quantities[17]:
        return handle_statistics_betweeness_histogram(statistics_data)
    elif type == statistics_quantities[18]:
        return handle_statistics_degree_centrality(statistics_data)
    elif type == statistics_quantities[19]:
        return handle_statistics_eigenvector_centrality(statistics_data)
    elif type == statistics_quantities[20]:
        return handle_statistics_katz_centrality(statistics_data)
    elif type == statistics_quantities[21]:
        return handle_statistics_current_flow_betweenness_centrality(statistics_data)
    elif type == statistics_quantities[22]:
        return handle_statistics_communicability_betweeness_centrality(statistics_data)
    elif type == statistics_quantities[23]:
        return handle_statistics_load_centrality(statistics_data)
    elif type == statistics_quantities[24]:
        return handle_statistics_subgraph_centrality(statistics_data)
    elif type == statistics_quantities[25]:
        #  要归一化处理
        return handle_statistics_harmonic_centrality(statistics_data)
    elif type == statistics_quantities[26]:
        #  要归一化处理
        return handle_statistics_second_order_centrality(statistics_data)
    elif type == statistics_quantities[27]:
        return handle_statistics_information_centrality(statistics_data)
    elif type == statistics_quantities[28]:
        return handle_statistics_page_rank_centrality(statistics_data)
    elif type in statistics_quantities[29:34:1]:
        return handle_statistics_modularity(statistics_data,type)
    else:
        raise NotImplementedError('还没有制作的统计物理量')


#  前4个返回的都是关于点id的字典
#  get_dictofdict_from_dict的用处是将关于点节点id的度，转化为{1:{'degree':值}}
#  由于不再使用哈希，而使用字符串，这里考虑将_statistics_data直接dump成json字符串返回
#  更新 对于计算出来的数据，点线可以放到网络文件当中，整体属性依旧使用缓存记录
def handle_statistics_degree(statistics_data):
    type = statistics_quantities[0]
    infos = data.get_dictofdict_from_dict(statistics_data, type)
    return infos


def handle_statistics_betweeness(statistics_data):
    type = statistics_quantities[1]
    infos = data.get_dictofdict_from_dict(statistics_data, type)
    return infos


def handle_statistics_closeness(statistics_data):
    type = statistics_quantities[2]
    infos = data.get_dictofdict_from_dict(statistics_data, type)
    return infos


def handle_statistics_clustering(statistics_data):
    type = statistics_quantities[3]
    infos = data.get_dictofdict_from_dict(statistics_data, type)
    return infos


#   {(1,2):值}转化为{(1,2):{'edgebetweeness':值}}
def handle_statistics_edgebetweeness(statistics_data):
    type = statistics_quantities[4]
    infos = data.get_dictofdict_from_dict(statistics_data, type)
    return infos


#  k核返回的是子图
def handle_statistics_kcore(statistics_data):
    nodes = statistics_data.nodes()
    infos = []
    for node in nodes:
        infos.append(node)
    datum = json.dumps(infos)
    return infos, datum


#  得到的是网络G的某个点的数据
def handle_statistics_radar(statistics_data, G):
    types = [statistics_quantities[0], statistics_quantities[1], statistics_quantities[2], statistics_quantities[3]]
    temp = {}
    for type in types:
        infos = nx.get_node_attributes(G, type)
        average = get_average_from_dict(infos)
        temp.update({type: statistics_data[type] / average})
    return temp


#  一个生成器，
def handle_statistics_shortpath(statistics_data, node_num):
    return data.get_list_from_dict(statistics_data, node_num)


#  得到的是一个整数
def handle_statistics_node_connectivity(statistics_data):
    infos = json.dumps(statistics_data)
    return statistics_data, infos


def handle_statistics_degreehistogram(statistics_data):
    return data.get_dict_from_list(statistics_data)


#  得到的是每个节点的平均邻居度
def handle_statistics_average_neighbor_degree(statistics_data):
    type = statistics_quantities[10]
    infos = data.get_dictofdict_from_dict(statistics_data, type)
    return infos


def handle_statistics_graph_density(statistics_data):
    infos = json.dumps(statistics_data)
    return statistics_data, infos

# 一些关于社团划分的算法，返回的属性放在节点上，即使用数字来表示
def handle_statistics_community_grivan_newman(statistics_data,type=statistics_quantities[12]):
    return data.get_girvan_newman_community_from_generator(statistics_data,type)


def handle_statistics_community_greedy(statistics_data,type=statistics_quantities[13]):
    return data.get_community_from_generator(statistics_data,type)


def handle_statistics_community_asyn_lpa(statistics_data,type=statistics_quantities[14]):
    return data.get_community_from_generator(statistics_data,type)


def handle_statistics_community_label_propagation(statistics_data,type=statistics_quantities[15]):
    return data.get_community_from_generator(statistics_data,type)


def handle_statistics_community_asyn_fludic(statistics_data,type=statistics_quantities[16]):
    return data.get_community_from_generator(statistics_data,type)


def handle_statistics_betweeness_histogram(statistics_data):
    return data.get_histogram(statistics_data)


def handle_statistics_degree_centrality(statistics_data):
    return data.get_dictofdict_from_dict(statistics_data, statistics_quantities[18])


def handle_statistics_eigenvector_centrality(statistics_data):
    return data.get_dictofdict_from_dict(statistics_data, statistics_quantities[19])


def handle_statistics_katz_centrality(statistics_data):
    return data.get_dictofdict_from_dict(normalization_processing(statistics_data), statistics_quantities[20])


def handle_statistics_current_flow_betweenness_centrality(statistics_data):
    return data.get_dictofdict_from_dict(statistics_data, statistics_quantities[21])


def handle_statistics_communicability_betweeness_centrality(statistics_data):
    return data.get_dictofdict_from_dict(statistics_data, statistics_quantities[22])


def handle_statistics_load_centrality(statistics_data):
    return data.get_dictofdict_from_dict(statistics_data, statistics_quantities[23])


def handle_statistics_subgraph_centrality(statistics_data):
    return data.get_dictofdict_from_dict(normalization_processing(statistics_data), statistics_quantities[24])


def handle_statistics_harmonic_centrality(statistics_data):
    #  归一化处理
    return data.get_dictofdict_from_dict(normalization_processing(statistics_data), statistics_quantities[25])


def handle_statistics_second_order_centrality(statistics_data):
    #  归一化处理
    return data.get_dictofdict_from_dict(normalization_processing(statistics_data), statistics_quantities[26])


def handle_statistics_information_centrality(statistics_data):
    return data.get_dictofdict_from_dict(statistics_data, statistics_quantities[27])


def handle_statistics_page_rank_centrality(statistics_data):
    return data.get_dictofdict_from_dict(statistics_data, statistics_quantities[28])

def handle_statistics_modularity(statistics_data,type):
    print(statistics_data)
    return data.get_dictofdict_from_dict(statistics_data,type)

def get_average_from_dict(dictionary):
    Len = len(dictionary)
    Sum = 0
    for value in dictionary.values():
        Sum += float(value)
    Avg = Sum / Len
    return Avg


def get_average_from_list(li, is_exists):
    Len = len(li)
    Sum = 0
    if is_exists:
        for index in li:
            Sum = float(index) + Sum
    else:
        Sum = sum(li)
    Avg = Sum / Len
    return Avg


# 将['1','2']这样的列表转化为百分比
# 根据百分比和输入的字典，计算avg
def get_average_from_percent(percents, dictionary):
    infos = list(dictionary.values())
    Len = len(infos)
    temp = []
    # Sum = 0
    for percent in percents:
        if percent == '0':
            start = 0
            end = int(0.2 * Len)
        elif percent == '1':
            start = int(0.2 * Len)
            end = int(0.4 * Len)
        elif percent == '2':
            start = int(0.4 * Len)
            end = int(0.6 * Len)
        elif percent == '3':
            start = int(0.6 * Len)
            end = int(0.8 * Len)
        elif percent == '4':
            start = int(0.8 * Len)
            end = int(Len) + 1
        temp.extend(infos[start:end])
    return get_average_from_list(temp, True)


def get_best_community(G):
    x = 0
    for i in range(2, 10):
        infos = community.asyn_fluidc(G, i)
        datum = tuple(infos)
        coverage = community.coverage(G, datum)
        if coverage > x:
            x = coverage
            index = datum
    return index


def get_coverage(network, partition):
    G = files.read_network_with_type(network)
    return community.coverage(G,partition)


def normalization_processing(statistics_data):
    print(statistics_data)
    values = statistics_data.values()
    maxValue = max(values)
    minValue = min(values)
    delta = maxValue - minValue
    print(delta)
    for key,value in statistics_data.items():
        statistics_data.update({key:(value-minValue)/delta})
    return statistics_data


def get_node_modularity(G,network,type):
    community_type = "communities" + type[18::1]
    communities = nx.get_node_attributes(G,community_type)
    def get_communities(infos):
        datum = []
        module_number = max(list(infos.values()))
        for i in range(module_number):
            datum.append(set())
        for key,value in infos.items():
            datum[value-1].add(key)
        return datum
    if communities:
        return node_modularity.node_modularity(G,get_communities(communities))
    else:
        infos = get_statistics_data_with_type(get_statistics_data(network,community_type),community_type)
        datum = {}
        for key,value in infos.items():
            datum[key] = value.get(community_type)
        return node_modularity.node_modularity(G,get_communities(datum))