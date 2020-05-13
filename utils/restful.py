#   这里写一些公共的文件
from django.http import JsonResponse


class Http_code(object):
    success = 200
    #  成功
    parameter_error = 400
    #  参数错误
    no_licensed = 401
    #  没有授权
    method_error = 405
    #  方法错误
    server_error = 500
    # 服务器错误


#  kwargs用来传递那些其他的参数
def result(code=Http_code.success, message='', data=None,kwargs=None):
    json_dict = {"code": code,'message': message,"data": data}
    #  存在在kwargs,类型是字典，里面有其他值
    if kwargs and isinstance(kwargs,dict) and kwargs.keys():
        json_dict.update(kwargs)
    return JsonResponse(json_dict)


def success():
    return result()


def parameter_error(message="",data=None):
    return result(code=Http_code.parameter_error,message=message,data=data)


def no_licensed_error(message="",data=None):
    return result(code=Http_code.no_licensed,message=message,data=data)


def method_error(message="",data=None):
    return result(code=Http_code.method_error,message=message,data=data)


def server_error(message="",data=None):
    return result(code=Http_code.server_error,message=message,data=data)
