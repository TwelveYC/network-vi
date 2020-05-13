Graph.prototype.initDiagramSubmitButton = function () {
    var self = this;
    self.diagramButton.click(function () {
        event.preventDefault();
        var is_node = self.directChoose.val();
        var is_tuple = self.diagramChoose.val();
        var type = self.conceptChoose.val();
        var diagramType = self.typeChoose.val();

        if (is_node == 'Entirety') {
            //单个网络整体的处理
            self.ajaxGetEntireNetworkStatistics(self.id,type,is_tuple,diagramType)
        } else {
            //单个网络点线的处理
            if (is_tuple == 'topology') {
                //单个网络点线映射到拓扑
                self.visualMap(type,is_node);
                console.log("视觉映射点线");
            } else {
                //单个网络点线映射到图表
                // if(){
                self.ajaxGetNetworkStatistics(self.id, type, diagramType,is_node);
            }
        }

    });
};
//entire的分流
Graph.prototype.ajaxGetEntireNetworkStatistics = function(id,type,is_tuple,diagramType){
    var self = this;
     wnatajax.get({
         'url':'/analysis/hotmap/',
        'data':{
            'id':id,
            'type':type
        },'success':function (result) {
            if(result['code']==200){
                var size = result['message']['size'];
                var dim = [];
                 for(var i=0 ; i <= size-1;i++){
                     dim.push(i.toString());
                }
                 var data = result['data'];
                data = JSON.parse(data);
                if(type=='shortpath'){
                    var da = [];
                    for(var i=0;i<=size-1;i++){
                        var temp = 0;
                        for(var j=0;j<=size-1;j++){
                            temp += data[i*size+j][2];
                        }
                        da.push(temp);
                        temp = 0;
                    }
                    var sum = 0;
                    for(var i=0;i<da.length-1 ;i++){
                        sum += da[i];
                    }
                    var average = sum/size;
                    self.resultInput.val('average:' + average);
                    if(is_tuple=='topology'){
                        console.log("视觉映射");
                    }else{
                        if(diagramType=='line'||diagramType=='bar') {
                            self.drawLineOrBar(dim,da,type,diagramType);
                        }else if(diagramType=='polar'){
                            var d = [];
                            for (var i = 0; i < size; i++) {
                                var theta = i / size * 360;
                                d.push([da[i], theta]);
                            }
                            self.drawPolar(d, type, 'line');
                        }else if(diagramType=='bar-polar'){
                             var d = [];
                            for (var i = 0; i < size; i++) {
                                var theta = i / size * 360;
                                d.push([da[i], theta]);
                            }
                            self.drawPolar(d, type, 'bar');
                        }
                    }
                }else if(type=='degreehistogram'){
                    self.degreeHistogramScatter(data,type)
                }else if(type=='kcore'){
                    var data = result['data'];
                    data = JSON.parse(data);
                    if(is_tuple=='topology'){
                        self.kCoreTopology(data);
                    }else{
                        var data = result['data'];
                        data = JSON.parse(data);
                        if(diagramType=='bar'){
                            self.kCoreBar(data,size);
                        }else if(diagramType=='pie'){
                            self.kCorePie(data,size);
                        }
                    }
                }else if(type=='node_connectivity'){
                    self.resultInput.val('node_connectivity:' + data);
                }
                else if(type=='graphdensity'){
                    self.resultInput.val('graph density:' + data);
                }else if(type=="betweenesshistogram"){
                    self.degreeHistogramScatter(data,type)
                }
            }
        },'fail':function (result) {

        }
    })
};
Graph.prototype.ajaxGetNetworkStatistics = function (id, type, diagramType,is_node) {
    var self = this;
    if (diagramType == 'radar') {
        //输入点的id
        wnatalert.alertOneInput({
            'title': 'Please Input Node ID With Radar',
            'text':'You Can Join Multi Node ID with ?',
            'inputValue': 1,
            'confirmButtonText': 'Confirm',
            'cancelButtonText': 'Cancel',
            'confirmCallback': function (inputValue) {
                wnatalert.close();
                wnatajax.get({
                    'url': '/analysis/statistics/',
                    'data': {
                        'id': id,
                        'type': diagramType,
                        'node_id': inputValue
                    }, 'success': function (result) {
                        if (result['code'] == 200) {
                            var nodes = inputValue.split('?');
                            var lables = result['message']['labels'];
                            var size = result['message']['size'];
                            var data = result['data'];
                            data = JSON.parse(data);
                            var indi = [];
                            var da = [];
                            for (var i=0; i<=lables.length-1 ; i++){
                                var temp = {name:lables[i],max:1.5};
                                indi.push(temp);
                            }
                            var t = {};
                            var x = [];
                            for(var i=0; i<size; i++){
                                var q = data[i];
                                for(var j=0;j<lables.length; j++){
                                    x.push(q[lables[j]])
                                }
                                t = {
                                    name:nodes[i],
                                    value: x
                                };
                                x = [];
                                da.push(t);
                            }
                            var option = {
                                title: {
                                    text: 'Radar'
                                },
                                tooltip: {},
                                legend: {},
                                radar: {
                                    name: {
                                        textStyle: {
                                            color: '#fff',
                                            backgroundColor: '#999',
                                            borderRadius: 3,
                                            padding: [3, 5]
                                        }
                                    },
                                    indicator: indi
                                },
                                series: [{
                                    name: 'Radar',
                                    type: 'radar',
                                    data: da
                                }]
                            };

                            self.mychart.setOption(option,true);
                        }else{
                            var message = result['message'];
                            wnatalert.alertError(message);
                        }
                    }, 'fail': function (result) {

                    }
                })
            }
        });
    } else {
        wnatajax.get({
            'url': '/analysis/statistics/',
            'data': {
                'id': id,
                'type': type,
                'is_node':is_node
            }, 'success': function (result) {
                if (result['code'] == 200) {

                    var size = result['message']['size'];
                    var average = result['message']['average'];
                    if(type.indexOf("communities")!=-1){
                        var valSpring = "modularity:" + average;
                    }else{
                        var valSpring = 'average:' + average;
                    }
                    self.resultInput.val(valSpring);
                    var data = result['data'];
                    data = JSON.parse(data);

                    if (diagramType == 'line') {
                        var dim = [];
                        var da = [];
                        for (var i = 0; i < size; i++) {
                            dim.push(i.toString());
                            da.push(data[i]);
                        }
                        self.drawLineOrBar(dim, da, type, 'line');
                    } else if (diagramType == 'polar') {
                        var da = [];
                        for (var i = 0; i < size; i++) {
                            var theta = i / size * 360;
                            da.push([data[i], theta]);
                        }
                        self.drawPolar(da, type, 'line');
                    } else if (diagramType == 'bar') {
                        var dim = [];
                        var da = [];
                        for (var i = 0; i < size; i++) {
                            dim.push(i.toString());
                            da.push(data[i]);
                        }
                        self.drawLineOrBar(dim, da, type, 'bar');
                    } else if (diagramType == 'bar-polar') {
                        var da = [];
                        for (var i = 0; i < size; i++) {
                            var theta = i / size * 360;
                            da.push([data[i], theta]);
                        }
                        self.drawPolar(da, type, 'bar');
                    }else if(diagramType == "pie"){
                        self.drawPie(data,type);
                    }
                }
            }, 'fail': function (result) {

            }
        })
    }
};

Graph.prototype.drawLineOrBar = function (dim, data_source, type, chartType) {
    var self = this;
    var option = {
        title: {
            text: type,
            left: 'center'
        },
        legend: {},
        tooltip: {},
        dataZoom: [
        {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10,      // 左边在 10% 的位置。
            end: 60         // 右边在 60% 的位置。
        },
        {   // 这个dataZoom组件，也控制x轴。
            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            start: 10,      // 左边在 10% 的位置。
            end: 60         // 右边在 60% 的位置。
        }],
        xAxis: {
            type: 'category',
            data: dim
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: chartType,
                data: data_source
            },
        ]
    };
    self.mychart.setOption(option, true);
};

Graph.prototype.drawPolar = function (data_source, type, chartType) {
    var self = this;
    var option = {
        title: {
            text: type,
        },
        legend: {},
        polar: {},
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        angleAxis: {
            type: 'value',
            startAngle: 0
        },
        radiusAxis: {},
        series: [{
            name: 'line',
            type: chartType,
            coordinateSystem: 'polar',
            data: data_source
        }]
    };
    self.mychart.setOption(option, true);
};

Graph.prototype.degreeHistogramScatter = function (data,type) {
    var self = this;
    var infos = [];
    for(var key in data){
        var value = data[key];
        if(value[1]==0){

        }else{
            infos.push(value);
        }
    }
    var option = {
        title: {
            text: type,
            left: 'center'
        },
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'cross'
        //     }
        // },
          dataZoom: [
        {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10,      // 左边在 10% 的位置。
            end: 60         // 右边在 60% 的位置。
        },
        {   // 这个dataZoom组件，也控制x轴。
            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            start: 10,      // 左边在 10% 的位置。
            end: 60         // 右边在 60% 的位置。
        }],
        xAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: 'scatter',
            type: 'scatter',
            emphasis: {
                label: {
                    show: true,
                    position: 'left',
                    color: 'blue',
                    fontSize: 16
                }
            },
            data: infos
        }]
    };

    self.mychart.setOption(option,true);
};

Graph.prototype.kCoreTopology = function (data) {
    var self = this;
    var j = 0;
    self.cy.nodes().forEach(function (ele, i, eles) {
        if(i == data[j]){
             ele.style('background-color', self.color);
             j ++ ;
        }else{
            ele.style('background-color', '');
        }
    });
};

Graph.prototype.kCorePie = function (data,size) {
    var self = this;
    var value1 = data.length;
    var value2 = size - data.length;
    var option = {
        title: {
            text: 'kcore-pie',
            left: 'center'
        },
        tooltip: {},
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['kcore','other-subgraph',]
        },
        series: [
            {
                name: 'kcore',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: value1, name: 'kcore'},
                    {value: value2, name: 'other-subgraph'},
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    self.mychart.setOption(option);
};

Graph.prototype.kCoreBar = function (data,size) {
    var self = this;

    var option = {
        xAxis: {
            type: 'category',
            data: ['all-graph','kcore']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [size, data.length],
            type: 'bar'
        }]
    };
     self.mychart.setOption(option);
};

Graph.prototype.communitiesVisualMap = function (data) {
    var self = this;
    var colors = self.colors;
    for(var i=0;i<data.length -1; i++){
        var temp = data[i];
        for(var j=0; j< temp.length;j++){
            var node = self.cy.$("#" + temp[j]);
            node.style('background-color',colors[i]);
        }
    }
};

Graph.prototype.communitiesDiagram = function (data,diagramType,type) {
    var self = this;
    console.log(data);
    if(diagramType=='pie'){
        var legendData = [];
        var seriesData = [];
        for(var i=0;i<=data.length-1;i++){
            legendData.push((i+1).toString());
            seriesData.push({value:data[i].length,name:(i+1).toString()});
        }
        var option = {
            title: {
                text: 'community-pie',
                left: 'center'
            },
            tooltip: {},
            legend: {
                orient: 'vertical',
                left: 'left',
                data: legendData
            },
        series: [
            {
                name: type,
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: seriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    }else if(diagramType == 'bar'){
        var xAxisData = [];
        var seriesData = [];
        for(var i=0;i<=data.length-1;i++){
            xAxisData.push(i.toString());
            seriesData.push(data[i].length);
        }
        var option = {
            title:{
                text:'community-pie',
                left:'center'
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: seriesData,
                type: 'bar'
            }]
        };
    }else if(diagramType == 'pie+bar'){
        var xAxisData = [];
        var seriesBarData = [];
        var seriesPieData = [];
        for(var i=0;i<=data.length-1;i++){
            xAxisData.push(i.toString());
            seriesBarData.push(data[i].length);
            seriesPieData.push({value:data[i].length,name:i.toString()});
        }
        var option = {
            title:{
                text:'community-pie+bar',
                left:'center'
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: [{
                orient: 'vertical',
                left: 'left',
                data: xAxisData
            },{
                orient: 'vertical',
                left: 'left',
                data: xAxisData
            }],
            xAxis: {type: 'category'},
            yAxis: {gridIndex: 0},
            grid:[{
                top: '50%',
                bottom: 30,
                left: 100,
            }],
            series: [
                 {
                     type: 'pie',
                     data: seriesPieData,
                     radius: '30%',
                     center:['50%','25%']
                 },
                {
                    type: 'bar',
                    data: seriesPieData
                }
            ]
        };
    }
    self.mychart.setOption(option,true);
};

Graph.prototype.drawPie = function (data,type) {
    var self = this;
    var infos = [];
    var max = 0;
    for(var key in data){
        var temp = data[key]
        infos.push(temp);
        if(temp > max){
            max = temp;
        }
    }
    var datum = [];
    for(var i = 1; i<= max;i++){
        datum.push(0);
    }
    for(var key in infos){
        var temp = infos[key];
        datum[temp-1] +=1;
    }
    infos = [];
    for (var key in datum){
        infos.push({
            name: parseInt(key) + 1,
            value:datum[key]
        })
    }
    var self = this;
    var option = {
        title:{
            text:type,
            left:'center'
        },
        tooltip: {
            trigger: 'item',
            formatter:"{b}:{c}"
        },
        series: [
            {
                type: 'pie',
                data: infos,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
            },
        ]
    };
    self.mychart.setOption(option,true);
};


Graph.prototype.visualColorMapping = function (type, is_node) {
    var self = this;
    if (is_node == 'Node') {
        //点的颜色映射
        var max = self.cy.nodes().max(function (ele, i, eles) {
            return parseFloat(ele.data(type));
        });
        var min = self.cy.nodes().min(function (ele, i, eles) {
            return parseFloat(ele.data(type));
        });
        max = max['value'];
        min = min['value'];
        self.cy.nodes().forEach(function (ele, i, eles) {
            if(ele.isParent()){
                return
            }
            var weight = parseFloat(ele.data(type));
            //max = #ff0000
            //min = #ffff00
            weight = parseInt(((weight - min) / max) * 255);
            weight = 255 - weight;
            if (weight <= 15) {
                weight = weight.toString(16);
                weight = "#" + "ff0" + weight + '00';
            } else {
                weight = weight.toString(16);
                weight = "#" + "ff" + weight + '00';
            }
            ele.style('background-color', weight);
        });
    } else {
        //线的颜色映射
        var max = self.cy.edges().max(function (ele, i, eles) {
            return parseFloat(ele.data(type));
        });
        var min = self.cy.edges().min(function (ele, i, eles) {
            return parseFloat(ele.data(type));
        });
        max = max['value'];
        min = min['value'];
        self.cy.edges().forEach(function (ele, i, eles) {
            var weight = parseFloat(ele.data(type));
            //max = #ff0000
            //min = #ffff00
            weight = parseInt(((weight - min) / max) * 255);
            weight = 255 - weight;
            if (weight <= 15) {
                weight = weight.toString(16);
                weight = "#" + "ff0" + weight + '00';
            } else {
                weight = weight.toString(16);
                weight = "#" + "ff" + weight + '00';
            }
            ele.style('line-color', weight);
        });
    }
};

Graph.prototype.entireVisualMapping = function (data) {
    var self = this;
    var min = data[0];
    var max = data[0];
    for(var i= 1;i < data.length-1  ;i++){
        if(min > data[i]){
            min = data[i];
        }
        if(max < data[i]){
            max = data[i];
        }
    }
    self.cy.nodes().forEach(function (ele, i, eles) {
        if(ele.isParent()){
            return
        }
        var weight = data[i];
        weight = parseInt(((weight - min) / max) * 255);
        weight = 255 - weight;
        if (weight <= 15) {
            weight = weight.toString(16);
            weight = "#" + "ff0" + weight + '00';
        } else {
            weight = weight.toString(16);
            weight = "#" + "ff" + weight + '00';
        }
        ele.style('background-color', weight);
    });

};
