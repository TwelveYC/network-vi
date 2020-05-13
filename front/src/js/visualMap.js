Graph.prototype.initMapChannel = function () {
    var self = this;
    self.mapChannel.change(function () {
        var it = $(this);
        var value = it.val();
       switch (value) {
           case "Size":{
               self.mapColorBox.hide();
               self.mapSizeBox.show();
               break;
           }
           case "Color":{
               self.mapColorBox.show();
               self.mapSizeBox.hide();
               break;
           }
           default:{
               self.mapColorBox.hide();
               self.mapSizeBox.hide();
               break;
           }
       }
    });
    self.colorSelector.change(function () {
        var it = $(this);
        var value = it.val();
        switch (value) {
            case "viridis":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(68,1,84,1),rgba(54,90,140,1),rgba(30,151,139,1),rgba(254,231,36,1))");
                break;
            }case "plasma":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(12,7,135,1),rgba(99,0,167,1),rgba(254,188,43,1),rgba(240,249,33,1))");
                break;
            }case "inferno":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(0,0,0,1),rgba(111,24,110,1),rgba(252,150,6,1),rgba(253,255,165,1))");
                break;
            }case "magma":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(0,0,0,1),rgba(121,34,130,1),rgba(246,107,92,1),rgba(253,253,191,1))");
                break;
            }case "cividis":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(0,34,78,1),rgba(0,50,113,1),rgba(120,120,119,1),rgba(254,232,54,1))");
                break;
            }case "Oranges":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(255,245,235,1),rgba(250,130,47,1),rgba(218,73,1,1),rgba(127,39,1,1))");
                break;
            }case "YlGn":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(255,255,299,1),rgba(180,224,145,1),rgba(0,104,55,1),rgba(0,69,41,1))");
                break;
            }case "binary":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(255,255,255,1),rgba(200,200,200,1),rgba(120,120,120,1),rgba(0,0,0,1))");
                break;
            }case "hot":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(10,0,0,1),rgba(255,0,0,1),rgba(255,255,0,1),rgba(255,255,255,1))");
                break;
            }case "copper":{
                self.gradientRamp.css("background-image","linear-gradient(to right, rgba(0,0,0,1),rgba(100,63,40,1),rgba(256,162,103,1),rgba(255,199,127,1))");
                break;
            }default :{
                break;
            }
        }
    });
};

Graph.prototype.visualMap = function (type,is_node) {
    var self = this;
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
        'url':'/analysis/visualmap/',
        'data':{
            'id':self.id,
            'map':mapChannel,
            'type':type,
            'is_node':is_node
        },'success':function (result) {
            if(result['code']==200){
                var data = JSON.parse(result['data']);
                self.handleVisualMap(data,channel,is_node);
            }
        },'fail':function (result) {

        }
    })
};


Graph.prototype.handleVisualMap = function (data,channel,is_node) {
    var self = this;
        if(channel==="Color"){
            if(is_node==="Node"){
                self.cy.filter(":child").forEach(function (ele,i,eles) {
                    ele.style("background-color",data[i]);
                });
            }else{
                self.cy.edges().forEach(function (ele,i,eles) {
                    ele.style("line-color",data[i]);
                });
            }
        }else if(channel==="Size"){
            if(is_node==="Node"){
                self.cy.filter(":child").forEach(function (ele,i,eles) {
                    ele.style("width",data[i]);
                    ele.style("height",data[i]);
                });
            }else{
                self.cy.edges().forEach(function (ele,i,eles) {
                    ele.style("width",data[i]);
                });
            }
        }else if(channel==="Opacity"){
            if(is_node==="Node"){
                self.cy.filter(":child").forEach(function (ele,i,eles) {
                    ele.style("opacity",data[i]);
                });
            }else{
                self.cy.edges().forEach(function (ele,i,eles) {
                    ele.style("opacity",data[i]);
                });
            }
        }
};