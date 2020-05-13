Graph.prototype.initSideBarEvent = function () {
    var self = this;
    self.sideBarNav.click(function () {
        var direction  = $(this).attr("direction");
        if (direction==="left"){
            //向左移动
            self.drapBox.css("bottom",-68);
            self.secondFloor.animate({"left":0},500);
            self.drapBox.attr("page",1);
        }else{
            self.drapBox.css("bottom",0);
            self.secondFloor.animate({"left":-1150},500);
            self.drapBox.attr("page",2);
        }
    });
};

Graph.prototype.initCentralityRangeChange = function () {
    var self = this;
    self.centralityRange.each(function (index,element) {
        var it = $(element);
        it.change(function () {
            var type = it.attr("centrality_type");
            var value = it.val();
            var text = it.attr("text");
            $("#text-" + type).text(text + ":" + parseFloat(value)/100);
        });
    });
    self.refreshButton.click(function () {
        var types = [];
        var type_values = [];
        self.centralityRange.each(function (index,element) {
            var it = $(element);
            var disabled_value = it.attr("disabled");
            if(!disabled_value){
                var value = parseInt(it.val());
                if(value!==0){
                    types.push(it.attr("centrality_type"));
                    type_values.push(parseInt(it.val()));
                }
            }
        });
        if(types.length!==0){
           var typesSpring = JSON.stringify(types);
           var typesValueSpring = JSON.stringify(type_values);
           var mapChannel = self.mapChannel.val();
           var channel = self.mapChannel.val();
           switch (mapChannel) {
               case "Size":{
                   var maxValue = self.maxSizeInput.val();
                   var minValue = self.minSizeInput.val();
                   if(maxValue!=""&minValue!=""){
                       mapChannel +="?";
                       mapChannel +=maxValue;
                       mapChannel +="?";
                       mapChannel +=minValue;
                   }else{
                       return;
                   }
                   break;
               }case "Color":{
                   mapChannel +="?";
                   mapChannel += self.colorSelector.val();
                   break;
               }case "Opacity":{
                   break;
               }
           }
           mapChannel +="?";
           mapChannel +=self.mapNormalization.val();
           wnatajax.get({
                'url':'/analysis/refresh/',
               'data':{
                 'id':self.id,
                 "types":typesSpring,
                 'typeValue':typesValueSpring,
                 'map':mapChannel
               },'success':function (result) {
                    if(result['code']==200){
                        var data = JSON.parse(result['data']);
                        var message = result['message'];
                        var is_node="Node";
                        var visual_data = data[0];
                        var line_data = data[1];
                        self.handleVisualMap(visual_data,channel,is_node);
                        self.drawMultiLine(line_data,message[0]);
                        self.resultInput.val("pearsonr:" + message[1])
                    }
               },'fail':function (result) {

               }
           })
        }
    });
};
Graph.prototype.initCentralityRangeReset = function () {
    var self = this;
    self.centralityRange.each(function (index,element) {
        var it = $(element);
        it.val("0");
        var centrality_type = it.attr("centrality_type");
        if(self.node_key.indexOf(centrality_type) === -1){
            it.attr("disabled",true);
        }else{
            it.attr("disabled",false);
        }
    });
};

Graph.prototype.drawMultiLine = function (data,message) {
    var self = this;
    var dimensions = [];
    var size = data[0].length;
    for(var i =0;i<=size-1;i++){
        dimensions.push(i);
    }
    var series = [];
    for(var i in data){
        var values = data[i];
       series.push({
           name:message[i],
           type:"line",
           label:{
               position:'bottom'
           },
           data:values
       })
    }
    var option = {
        title: {
            text: 'MCA',
            left: 'center'
        },
        tooltip: {
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dimensions
        },
        yAxis: {
            type: 'value'
        },
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
        series: series
    };
    self.mychart.setOption(option,true);
};