from django.db import models


class NetWorkManager(models.Model):
    name = models.CharField(max_length=100)
    path = models.URLField()
    type = models.CharField(max_length=100,null=True)
    labels_node = models.TextField(null=True)
    labels_edge = models.TextField(null=True)
    num_node = models.IntegerField()
    num_link = models.IntegerField()

    class Meta:
        db_table = 'network_manager'


class NetworkEntireStatistics(models.Model):
    key = models.CharField(max_length=300)
    content = models.TextField()
    network = models.ForeignKey("NetWorkManager",on_delete=models.CASCADE)

    class Meta:
        db_table = 'entire_statistics'
