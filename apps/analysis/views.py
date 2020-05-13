from django.shortcuts import render
from django.views.generic import View
from utils import restful, files, data, statistics, visualMap
from django.views.decorators.http import require_POST, require_GET
from django.conf import settings
import os
from .models import NetWorkManager,NetworkEntireStatistics
import networkx as nx
from networkx.algorithms import community
import json
import numpy as np
from scipy.stats import pearsonr


class TableView(View):
    def get(self, request):
        networks = NetWorkManager.objects.all()
        content = {
            'networks': networks,
        }
        return render(request, 'table/index.html', context=content)


@require_GET
def network_detail(request):
    state = request.GET.get('state')
    ids = request.GET.getlist('ids[]')
    if not ids:
        ids = request.GET.get('ids')
    index = []
    print(ids)
    if type(ids) == 'list':
        index.extend(id)
    else:
        index.append(ids)
    networks = NetWorkManager.objects.filter(id__in=index)
    datas = []
    columns = []
    names = []
    if state == 'false':
        #  edge
        for network in networks:
            network_data = data.get_data_from_label_edge(network)
            datas.append(network_data)
            column = data.get_label(network, False)
            columns.append(column)
            name = data.get_name(network)
            names.append(name)
    elif state == 'true':
        #  node
        for network in networks:
            network_data = data.get_data_from_label_node(network)
            datas.append(network_data)
            column = data.get_label(network, True)
            columns.append(column)
            name = data.get_name(network)
            names.append(name)
    columns = json.dumps(columns)
    message = {'len': len(datas), 'columns': columns, 'names': names}
    datas = json.dumps(datas)
    return restful.result(message=message, data=datas)


class NetWorkStatistics(View):
    def get(self, request):
        network_id = request.GET.get('id')
        type = request.GET.get('type')
        is_node = request.GET.get('is_node')
        network = NetWorkManager.objects.get(pk=network_id)
        if type == 'radar':
            #  radar 比较特殊所以采取这种方法处理
            node_id = request.GET.get('node_id')
            infos,is_right = self.handle_radar_event(network,type,node_id)
            if is_right:
                size = len(infos)
                labels = ['degree', 'betweeness', 'closeness', 'clustering']
                infos = json.dumps(infos)
                message = {'labels': labels,'size': size}
                return restful.result(message=message, data=infos)
            else:
                return restful.method_error(message='Please Calculate degree,betweeness, closeness and clustering firstly')

        if data.is_edge_attr(is_node):
            exists = NetWorkManager.objects.filter(pk=network_id).filter(labels_edge__contains=type).exists()
        else:
            exists = NetWorkManager.objects.filter(pk=network_id).filter(labels_node__contains=type).exists()
        print(exists)
        if exists:
            G = files.read_network_with_type(network)
            if data.is_edge_attr(is_node):
                infos = nx.get_edge_attributes(G, type)
                infos = data.handle_tulpe_key(infos)
            else:
                infos = nx.get_node_attributes(G, type)
            average = self.handle_info_event(G=G,statistics_data=infos,type=type,infos=infos)
        else:
            G = files.read_network_with_type(network)

            statistics_data = statistics.get_statistics_data(network, type)

            infos = statistics.get_statistics_data_with_type(statistics_data, type)
            # 上一步的处理是为了插入方便

            if data.is_edge_attr(is_node):
                nx.set_edge_attributes(G, infos)
                infos = data.handle_tulpe_key(infos)
            else:
                nx.set_node_attributes(G, infos)

            files.handle_network_labels(G, network)
            average = self.handle_info_event(statistics_data=statistics_data,type=type,infos=infos,is_start=True,G=G)
        infos = json.dumps(infos)
        size = data.get_size(network,is_node)
        message = {'average': average, 'size': size}
        return restful.result(message=message, data=infos)

    #  重构1，使用字符串代替哈希
    #  定义一个使用type进行数据迁移的函数
    #  迁移的方法要返回两个数据，第一个是送出，第二个是用作送入设置字典

    #  重构2，对于点线的属性，不再使用缓存存储，直接使用网络文件存储
    #  对于要用的网络的全局属性才使用缓存，见hotmap_sta

    # 重构3将社团划分的结果放到节点上
    #

    def handle_radar_event(self, network, type, node_id):
        ids = node_id.split('?')
        infos = []
        G = files.read_network_with_type(network)
        try:
            for id in ids:
                statistics_data = statistics.get_statistics_data(network, type, node_id=id)
                info = statistics.get_statistics_data_with_type(statistics_data, type, G=G)
                infos.append(info)
            return infos,True
        except ZeroDivisionError:
            return 1,False

    def handle_info_event(self,G=None,statistics_data=None, type=None, infos=None,is_start=False):
        if is_start:
            if type.startswith("communities"):
                datum = nx.get_node_attributes(G,type)
                return self.get_modularity(G,datum)
            else:
                return statistics.get_average_from_dict(statistics_data)
        else:
            if type.startswith("communities"):
                return self.get_modularity(G,infos)
            else:
                return statistics.get_average_from_dict(statistics_data)

    def get_modularity(self, G, infos):
        datum = []
        module_number = max(list(infos.values()))
        for i in range(module_number):
            datum.append(set())
        for key,value in infos.items():
            datum[value-1].add(key)
        print(datum)
        return community.modularity(G,datum)


class IndexView(View):
    def get(self, request):
        networks = NetWorkManager.objects.all()
        content = {
            'networks': networks
        }
        return render(request, 'analysis/index.html', context=content)


class NetWorkEntireStatisticsHandle(View):
    def get(self,request):
        network_id = request.GET.get('id')
        type = request.GET.get('type')
        network = NetWorkManager.objects.get(pk=network_id)
        node_num = network.num_node
        entire_statistics = network.networkentirestatistics_set.all()
        exists = entire_statistics.filter(key__contains=type).exists()
        if exists:
            infos = entire_statistics.filter(key=type).first().content
        else:
            statistics_data = statistics.get_statistics_data(network, type)
            infos, datum = statistics.get_statistics_data_with_type(statistics_data, type, node_num=node_num)
            NetworkEntireStatistics.objects.create(key=type,content=datum,network_id=network_id)
            infos = json.dumps(infos)
        size = data.get_size(network, type)
        message = {'size': size}
        return restful.result(message=message, data=infos)


@require_GET
def cy_data(request):
    ids = request.GET.getlist('ids[]')
    if not ids:
        ids = request.GET.get('ids')
    index = []
    if type(ids) == 'list':
        index.extend(id)
    else:
        index.append(ids)
    networks = NetWorkManager.objects.filter(id__in=index)
    network = networks[0]
    infos = []
    names = []
    element = data.get_cy_data_from_network_group(network)
    infos.append(element)
    names.append(network.name)
    Len = len(infos)
    datum = json.dumps(infos)
    message = {'size': Len, 'name': names}
    return restful.result(message=message, data=datum)



@require_POST
def upload_network(request):
    network_name = request.POST.get('network_name')
    file = request.FILES.get('file')
    network_name = network_name.strip()
    db_path, type = files.make_dir(network_name, file)
    file_path = os.path.join(settings.MEDIA_ROOT, db_path)
    try:
        G = files.read_network(file_path, type)
        node_labels, edge_labels = files.get_labels_from_graph(G)
        name = network_name
        db_path = db_path
        num_node = G.number_of_nodes()
        num_link = G.number_of_edges()
        NetWorkManager.objects.create(name=name, path=db_path, type=type, num_node=num_node, num_link=num_link,
                                      labels_node=node_labels, labels_edge=edge_labels)
        url = request.build_absolute_uri(settings.MEDIA_URL + db_path)
        return restful.success()
    except:
        return restful.parameter_error(message="Please Check Your Network File, Which is illicit")


class DeleteNetworkFileView(View):
    def post(self, request):
        id = request.POST.get('id')
        type = request.POST.get('type')
        is_node = request.POST.get('is_node')
        if is_node == "Node":
            exists = NetWorkManager.objects.filter(pk=id).filter(labels_node__icontains=type)
        else:
            exists = NetWorkManager.objects.filter(pk=id).filter(labels_edge__icontains=type)

        if exists:
            network = NetWorkManager.objects.get(pk=id)
            G = files.read_network_with_type(network)
            nodes = G.nodes()
            edges = G.edges()
            H = nx.Graph()
            H.add_nodes_from(nodes)
            H.add_edges_from(edges)
            if is_node == 'Node':
                labels = files.get_labels_from_db(network,True)
                for label in labels:
                    if label != type:
                        attrs = nx.get_node_attributes(G, label)
                        attrs = data.get_dictofdict_from_dict(attrs, label)
                        nx.set_node_attributes(H, attrs)

                labels = files.get_labels_from_db(network,False)
                for label in labels:
                    attrs = nx.get_edge_attributes(G, label)
                    attrs = data.get_dictofdict_from_dict(attrs, label)
                    nx.set_edge_attributes(H, attrs)
                self.operate_db_node(network,type,True)
            else:
                labels = files.get_labels_from_db(network,False)
                for label in labels:
                    if label != type:
                        attrs = nx.get_edge_attributes(G, label)
                        attrs = data.get_dictofdict_from_dict(attrs, label)
                        nx.set_edge_attributes(H, attrs)
                labels = files.get_labels_from_db(network, True)
                for label in labels:
                    attrs = nx.get_edge_attributes(G, label)
                    attrs = data.get_dictofdict_from_dict(attrs, label)
                    nx.set_edge_attributes(H, attrs)
                self.operate_db_node(network, type,False)
            files.wirte_network_with_type(H, network)
            return restful.result(message="success")
        else:
            return restful.result(message="This property does not exist")

    def operate_db_node(self, network, type,is_node):
        if is_node:
            labels_node = network.labels_node
            node_labels = labels_node.split("?")
            node_labels.remove(type)
            network.labels_node = "?".join(node_labels)
        else:
            labels_edge = network.labels_edge
            edge_labels = labels_edge.split("?")
            edge_labels.remove(type)
            network.labels_edge = "?".join(edge_labels)
        network.save()

@require_POST
def delete_graph(request):
    id = request.POST.get("id")
    network = NetWorkManager.objects.get(pk=id)
    network.delete()
    return restful.success()


def get_layout(request):
    id = request.GET.get('id')
    layout_algorithm = request.GET.get('layout')
    network = NetWorkManager.objects.get(pk=id)
    G = files.read_network_with_type(network)
    position_dict = {
        '12':nx.kamada_kawai_layout(G),
        '13':nx.fruchterman_reingold_layout(G),
        '14':nx.spring_layout(G)
    }
    positions = position_dict.get(layout_algorithm)
    datum = []
    for value in positions.values():
        datum.append([300*value[0],300*value[1]])
    return restful.result(data=datum)


class VisualMapView(View):
    def get(self,request):
        id = request.GET.get('id')
        mapChannel = request.GET.get('map')
        type = request.GET.get('type')
        is_node = request.GET.get('is_node')
        #  1，根据属性拿数据
        #  2，根据属性做映射
        #  3，根据映射得到颜色
        network = NetWorkManager.objects.get(pk=id)
        G = files.read_network_with_type(network)
        if data.is_edge_attr(is_node):
            infos = nx.get_edge_attributes(G,type).values()
        else:
            infos = nx.get_node_attributes(G,type).values()
        components = mapChannel.split("?")

        if components[0] == "Color":
            map_control = visualMap.MapColorControl(components[1],components[2],self.handle_data(infos))
            datum = map_control.get_map_data()
        elif components[0] == "Size":
            map_control = visualMap.MapControl(float(components[1]),float(components[2]),components[3],self.handle_data(infos))
            datum = map_control.get_map_data(is_round=False)
        else:
            map_control = visualMap.MapControl(1, 0.2, components[1], self.handle_data(infos))
            datum = map_control.get_map_data(is_round=True)
        return restful.result(data=json.dumps(datum))

    def handle_data(self,infos):
        return np.array(list(infos))


class RefreshVisualMapView(View):
    def get(self,request):
        types = json.loads(request.GET.get('types'))
        type_Value = json.loads(request.GET.get('typeValue'))
        id = request.GET.get('id')
        mapChannel = request.GET.get('map')
        components = mapChannel.split("?")
        network = NetWorkManager.objects.get(pk=id)
        G = files.read_network_with_type(network)
        infos = np.zeros(G.number_of_nodes())
        index = 0
        type_node_attributes = []
        print(len(types))
        messages = []
        messages.append(types)
        for type in types:
            value = list(nx.get_node_attributes(G,type).values())
            infos += np.array(value) * (type_Value[index]/100)

            type_node_attributes.append(value)
            index += 1
        if len(types) == 2:
            a = list(nx.get_node_attributes(G,types[0]).values())
            b = list(nx.get_node_attributes(G,types[1]).values())
            print(a)
            print(b)
            ers = pearsonr(a,b)
            print(ers)
            messages.append(ers[0])
        if components[0] == "Color":
            map_control = visualMap.MapColorControl(components[1],components[2],infos)
            datum = map_control.get_map_data()
        elif components[0] == "Size":
            map_control = visualMap.MapControl(float(components[1]),float(components[2]),components[3],infos)
            datum = map_control.get_map_data(is_round=False)
        else:
            map_control = visualMap.MapControl(1, 0.2, components[1], infos)
            datum = map_control.get_map_data(is_round=True)
        return_data = []
        return_data.append(datum)
        return_data.append(type_node_attributes)

        return restful.result(message=messages,data=json.dumps(return_data))


def sort_value(request):
    id = request.GET.get("id")
    types = json.loads(request.GET.get("types"))
    top_number = int(request.GET.get("topnumber"))
    kind = request.GET.get("kind")
    types_value = json.loads(request.GET.get("typesValue"))
    network = NetWorkManager.objects.get(pk=id)
    G = files.read_network_with_type(network)
    infos = np.zeros(G.number_of_nodes())
    type_length = len(types)
    for index in range(type_length):
        infos += np.array(list(nx.get_node_attributes(G, types[index]).values())) * (int(types_value[index])/100)
    info = {}
    for index in range(G.number_of_nodes()):
        info.update({index:infos[index]})
    if kind.lower() == "top":
        values = sorted(info.items(),key= lambda x:x[1],reverse=True)[0:top_number:1]
    elif kind.lower() == "low":
        values = sorted(info.items(), key=lambda x: x[1], reverse=False)[0:top_number:1]
    datum = []
    for info in values:
        datum.append(info[0])
    return restful.result(data=json.dumps(datum))





class StoreStyleView(View):
    def post(self,request):
        id = request.POST.get('id')
        datum = json.loads(request.POST.get('data'))
        network = NetWorkManager.objects.get(pk=id)
        G = files.read_network_with_type(network)
        G = self.handle_style_data(G,datum)
        files.wirte_network_with_type(G,network)
        files.handle_network_labels(G, network)
        return restful.success()

    def handle_style_data(self,G,datum):
        nodes_style = {}
        posX = {}
        posY = {}
        index = 0
        for node_style in datum[0]:
            nodes_style.update({index:{"color":node_style[0],"weight":node_style[1],"height":node_style[2],"shape":node_style[3],"bordercolor":node_style[4],"borderwidth":node_style[5],"opacity":node_style[6]}})
            posX.update({index:node_style[7]})
            posY.update({index:node_style[8]})
            index +=1

        nx.set_node_attributes(G,nodes_style,"graphics")
        nx.set_node_attributes(G,posX,"posX")
        nx.set_node_attributes(G,posY,"posY")
        index = 0
        edges = G.edges()
        edges_style = {}
        for edge in edges:
            info = datum[1][index]
            edges_style.update({edge:{"color":info[0],"width":info[1],"shape":info[2],"curveStyle":info[3],"opacity":info[4]}})
            index +=1

        nx.set_edge_attributes(G,edges_style,"graphics")

        nodes_style.clear()
        index = 0
        for tag_style in datum[2]:
            nodes_style.update({index:{"color":tag_style[0],"width":tag_style[1],"shape":tag_style[2]}})
            index +=1
        nx.set_node_attributes(G,nodes_style,"tagShape")
        return G


def get_style_data(request):
    id = request.GET.get("id")
    network = NetWorkManager.objects.get(pk=id)
    G = files.read_network_with_type(network)
    node_style =  list(nx.get_node_attributes(G,"graphics").values())
    tag_style = list(nx.get_node_attributes(G,"tagShape").values())
    edge_style = list(nx.get_edge_attributes(G,"graphics").values())
    datum = []
    datum.append(node_style)
    datum.append(edge_style)
    datum.append(tag_style)
    return restful.result(data=json.dumps(datum))

def test(request):
    id = request.GET.get("id")
    times = request.GET.get("times")
    if id == "11":
        path = os.path.join(settings.MEDIA_ROOT, "data.json")
        with open(path,"r") as fp:
            infos = json.load(fp)
        return restful.result(data=json.dumps(infos[int(times)]))
    else:
        return restful.parameter_error()
