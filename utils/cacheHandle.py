from django_redis import get_redis_connection
coon = get_redis_connection('default')
from.data import is_edge_attr
from apps.analysis.models import NetWorkManager
import json


def hash_set_data(dictionary, type, network_id):
    #  type指的是要什么物理量
    key = get_key(network_id,type)
    if is_edge_attr(type):
        temp = {}
        for info,value in dictionary.items():
            inf = str(info[0]) + '_' + str(info[1])
            temp.update({inf: value})
        coon.hmset(key, temp)
    else:
        coon.hmset(key, dictionary)
    return True


def hash_check_data(network_id, type):
    if is_edge_attr(type):
        exists = NetWorkManager.objects.filter(pk=network_id).filter(labels_edge__icontains=type).exists()
    else:
        key = get_key(network_id,type)
        exists = coon.hexists(key, '0')
    return exists


def hash_get_data(network_id, type):
    key = get_key(network_id,type)
    return coon.hgetall(key)


def get_key(network_id, type):
    return network_id + "_" + type


def str_set_data(info,type,network_id):
    key = get_key(network_id,type)
    coon.set(key,info)
    return True


def str_get_data(network_id, type):
    key = get_key(network_id, type)
    temp = json.loads(coon.get(key))
    return temp


def str_check_data(network_id, type):
    key = get_key(network_id, type)
    return coon.exists(key)