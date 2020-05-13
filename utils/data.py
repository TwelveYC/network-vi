import networkx as nx
from utils import files,statistics
import json



# 将线的label数据进行处理，最后得到{'label':数值}
def get_data_from_label_edge(network):
    #  source target 其他label
    labels = files.get_labels_from_db(network, False)
    G = files.read_network_with_type(network)
    edges = G.edges()
    data = []
    temp = {}
    # print(nx.get_edge_attributes(G,'value'))
    for label in labels:
        i = 0
        if label == 'source':
            for edge in edges:
                temp['source'] = edge[0]
                data.append(temp)
                temp = {}
        elif label == 'target':
            for edge in edges:
                temp['target'] = edge[1]
                data[i].update(temp)
                i += 1
                temp = {}
        else:
            attrs = nx.get_edge_attributes(G, label)
            for attr in attrs:
                temp[label] = attrs[attr]
                data[i].update(temp)
                i += 1
                temp = {}
    return data

# 将点的label数据进行处理，最后得到{'label':数值}
def get_data_from_label_node(network):
    #  id 其他label
    labels = files.get_labels_from_db(network, True)
    G = files.read_network_with_type(network)
    nodes = G.nodes()
    data = []
    temp = {}
    nodes_len = G.number_of_nodes()
    for index in range(nodes_len):
        node = nodes[index]
        for label in labels:
            if label == 'id':
                temp['id'] = index
                data.append(temp)
                temp = {}
            else:
                temp[label] = node[label]
                data[index].update(temp)
                temp = {}
    return data


#   is_node True是点，False为线
def get_label(network,is_node):
    labels = files.get_labels_from_db(network, is_node)
    data = []
    item = {}
    for label in labels:
        item['data'] = label
        data.append(item)
        item = {}
    return data


def get_name(network):
    name = network.name
    return name


#  将度的元组修改成字典
def get_dict_from_tuple(degs):
    data = {}
    for deg in degs:
        index = deg[0]
        value = deg[1]
        data[index] = value
    return data


# 将数据{0:值，1:值}变为{0:{'degree':值}}这种形式，用作set_node_attributes的插入使用
def get_dictofdict_from_dict(infos,type):
    data = {}
    temp = {}
    for key,value in infos.items():
        temp[key] = {type:value}
        data.update(temp)
        temp = {}
    return data


#  判定是否为线的属性
def is_edge_attr(type):
    if type == 'Link' or type == 'link':
        return True
    else:
        return False



# 比如最短路径算法，返回的数值为一个生成器，调整为得到[0,1,length]的形式
# infos是返回的生成器，num是点的长度

def get_list_from_dict(infos,num):
    # p[0][4] = 4
    infos = dict(infos)
    data = []
    for i in range(num):
        for j in range(num):
            temp = infos[i][j]
            data.append([i, j, temp])
    datum = json.dumps(data)
    return data, datum


# 将从redis里面获得的最短路径数据转化为上面需要的的样子
def get_list_from_redis(infos):
    data = []
    for key,values in infos.items():
        values = json.loads(values)
        i = 0
        for index in values:
            data.append([int(key),i,index])
            i +=1
    # data = sorted(data,key=lambda x:x[0])
    return data


def get_cy_data_from_network(network):
    datum = []
    edge_datum = get_data_from_label_edge(network)
    node_datum = get_data_from_label_node(network)
    for node_data in node_datum:
        info = {'data':node_data}
        datum.append(info)

    index = 0
    for edge_date in edge_datum:
        temp = {}
        info = {}
        temp = {'id':str(index)+'_'}
        index +=1
        temp.update(edge_date)
        info = {'data':temp}
        datum.append(info)
    return datum


#  将度分布的列表变为[[1,2],[2,3],[]]这样的列表，方便显示
def get_dict_from_list(lists):
    data = []
    i = 1
    temp = []
    for info in lists:
        temp.append(i)
        temp.append(info)
        data.append(temp)
        i += 1
        temp = []
    datum = json.dumps(data)
    return data, datum


def handle_tulpe_key(datas):
    infos = {}
    index = 0
    for key, value in datas.items():
        key = index
        infos.update({key:value})
        index +=1
    return infos


def get_size(network,type ,is_hotmap=None):
    if is_hotmap:
        pass
    else:
        if is_edge_attr(type):
            return network.num_link
        else:
            return network.num_node


def get_community_from_generator(generator,type):
    infos = tuple(generator)
    return get_dictofdict_from_set(infos,type)


def get_girvan_newman_community_from_generator(generator, type):
    infos = tuple(sorted(c) for c in next(generator))
    return get_dictofdict_from_set(infos,type)


def get_dictofdict_from_set(infos,type):
    datum = {}
    index = 1
    for info in infos:
        for num in info:
            datum.update({num: {type: index}})
        index += 1
    return datum


class FrozenSetEncode(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bytes):
            return str(obj, encoding='utf-8')
        elif isinstance(obj, frozenset):
            return list(set(obj))
        elif isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


def get_cy_data_from_network_group(network):
    datum = []
    edge_datum = get_data_from_label_edge(network)
    node_datum = get_data_from_label_node(network)
    for node_data in node_datum:
        parent = node_data.copy()
        id = node_data['id']
        node_data.update({'parent':"{0}{1}".format(id,"p")})
        info = {'data': node_data}
        datum.append(info)
        parent["id"] = str(id) + "p"

        if 'posX' in parent.keys():
            parent.pop('posX')
        if 'posY' in parent.keys():
            parent.pop("posY")
        infop = {'data': parent}
        datum.append(infop)

    index = 0
    for edge_date in edge_datum:
        temp = {}
        info = {}
        temp = {'id':str(index)+'_'}
        index += 1
        edge_date['source'] = "{0}".format(edge_date['source'])
        edge_date['target'] = "{0}".format(edge_date['target'])
        temp.update(edge_date)
        info = {'data': temp}
        datum.append(info)
    return datum


def get_histogram(statistics_data):
    histogram_group = 30
    values = sorted(statistics_data.values())
    max_value = max(values)
    min_value = min(values)
    max_min = max_value-min_value
    delta = max_min/histogram_group
    counts = []
    intervals = []
    middle = []
    data = []
    for i in range(histogram_group):
        temp = delta * i + min_value
        intervals.append(temp)
        middle.append(temp + 0.5 * delta)
        counts.append(0)
    for value in values:
        for index in range(histogram_group):
            if index == histogram_group - 1:
                counts[index] += 1
            elif value >= intervals[index] and value < intervals[index+1]:
                counts[index] +=1
                break
    for i in range(histogram_group):
        data.append([middle[i],counts[i]])
    infos = json.dumps(data)
    return  data,infos
