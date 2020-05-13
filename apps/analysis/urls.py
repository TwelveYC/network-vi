from django.urls import path
from . import views

app_name='analysis'
urlpatterns = [
    path('',views.IndexView.as_view(),name='index'),
    path('upload/',views.upload_network,name='upload'),
    path('table/',views.TableView.as_view(),name='table'),
    path('detail/',views.network_detail,name='detail'),
    path('statistics/',views.NetWorkStatistics.as_view(),name='statistics'),
    path('hotmap/',views.NetWorkEntireStatisticsHandle.as_view(),name='hotmap'),
    path('cy/',views.cy_data,name='cy'),
    path('deletefiled/',views.DeleteNetworkFileView.as_view(),name='delete_filed'),
    path('deletegraph/',views.delete_graph,name='delete_graph'),
    path('getlayout/',views.get_layout,name='get_layout'),
    path('visualmap/',views.VisualMapView.as_view(),name='visual_map'),
    path('refresh/',views.RefreshVisualMapView.as_view(),name='refresh'),
    path('sort/',views.sort_value,name='sort'),
    path('storestyle/',views.StoreStyleView.as_view(),name='store_style'),
    path('getstyle/',views.get_style_data,name='get_style'),
    path('test/',views.test,name='test'),
]