Graph.prototype.initStyle = function () {
    var self = this;
   // self.nodeColor.colorpicker();
    self.nodeColor.spectrum({
        'color':'#cccccc',
        'showInput':true,
        'showInitial':true,
        'showAlpha': false,
        'showPalette':true,
        "preferredFormat": "hex",
        'togglePaletteOnly': true,
        'palette':[
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]],
        'togglePaletteMoreText': 'more',
        'togglePaletteLessText': 'less',
    });

   self.linkColor.spectrum({
        'color':'#999999',
        'showInput':true,
        'showInitial':true,
        'showAlpha': false,
        'showPalette':true,
        "preferredFormat": "hex",
        'togglePaletteOnly': true,
        'palette':[
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]],
        'togglePaletteMoreText': 'more',
        'togglePaletteLessText': 'less',
    });
   self.tagColor.spectrum({
        'color':'#ffffff',
        'showInput':true,
        'showInitial':true,
        'showAlpha': false,
        'showPalette':true,
        "preferredFormat": "hex",
        'togglePaletteOnly': true,
        'palette':[
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]],
        'togglePaletteMoreText': 'more',
        'togglePaletteLessText': 'less',
    });

   self.nodeSize.inputmask("999-999",{ 'placeholder': ' w - h '});
   self.linkWidth.inputmask("999",{'placeholder':" w "});
   self.tagBorder.inputmask("99",{'placeholder':'05'});
   self.selectorElement();
   self.initStyleBtn();

};
//设计只有勾选之后第一个才能编辑

Graph.prototype.editCheckBox = function () {

};
Graph.prototype.initStyleBtn = function () {
    var self = this;
    self.json = [];
    self.applyBut.click(function () {
        var is_edit = $('input[name="editCheckBox"]:checked');
        var is_all_graph = $("input[name='entireCheckBox']:checked");
        var is_all = is_all_graph.val();
        var is_edit_value = is_edit.val();
        if(is_edit_value){
            //编辑
            //编辑全部还是选择的部分
            if(is_all){
                //编辑全部
                if(self.is_recombination_network()){
                    var nodes =  self.cy.nodes().filter(":child");
                }else{
                    var nodes = self.cy.nodes();
                }
                self.editNodeStyle(nodes);
                self.editTagStyle(nodes);
                var edges = self.cy.edges();
                self.editEdgeStyle(edges);
            }else{
                //编辑选择的b部分
                var selectorval = self.elementSelector.val();
                if(selectorval!=''){
                    var eles = self.handleSelector(selectorval);
                    self.add_table_element(eles);
                    if(self.is_recombination_network()){
                        var nodes = eles.filter(":child");
                    }else{
                        var nodes = eles.filter("node");
                    }
                    var edges = eles.filter("edge");
                     self.editNodeStyle(nodes);
                     self.editEdgeStyle(edges);

                     if(self.is_recombination_network()){
                         self.editTagStyle(nodes);
                     }
                     self.imgBtn.click();
                     return;
                }
                if(self.pendingData.length>0){
                    for(var key in self.pendingData){
                        var ele = self.pendingData[key];
                        if(ele.isParent()){
                            continue;
                        }
                        if(ele.isNode()){
                            self.editNodeStyle(ele);
                            self.editTagStyle(ele);
                        }
                        if(ele.isEdge()){
                            self.editEdgeStyle(ele);
                        }
                    }
                }
            }
        }else{
            return;
        }
    });
    self.shapeReset.click(function () {
         var is_edit = $('input[name="editCheckBox"]:checked');
        var is_edit_value = is_edit.val();
        if(is_edit_value){
            if(self.is_recombination_network()){
                var nodes = self.cy.nodes().filter(":child");
            }else{
                var nodes = self.cy.nodes();
            }
            nodes.style("width","");
            nodes.style("height","");
            nodes.style("shape",'ellipse');
            nodes.style("background-color","");
            nodes.style("border-width",0);
            nodes.style("opacity",1);
            var edges = self.cy.edges();
            edges.style("width",10);
            edges.style("line-color","");
            edges.style("line-style","solid");
            var parent = self.cy.nodes().filter(":parent");
            parent.style("border-width",0);
            parent.style("background-color","#ffffff");
        }
    });
    self.clearBtn.click(function () {
        self.pendingData.length = 0;
    });
    self.imgBtn.click(function () {
        var num = self.png.attr("num");
        var num = parseInt(num);
        if(num!=1){
            var appendSpring = "<div class=\"img-col\" id='img-col-" + num +
                "'>\n" +
                "        <a class=\"delete-tag\" num='" + num +
                "' id='img-close-" + num +
                "'>\n" +
                "             <i class=\"fa fa-times\"></i>\n" +
                "        </a>\n" +
                "        <img src=\"\" alt=\"\" num='" +  num+
                "' class=\"pngImg\" id='pngImg" + num +
                "'>\n" +
                "    </div>";
            self.pngBox.append($(appendSpring));
        }
        var imgId = "pngImg" + num;
        var png64 = self.cy.png();
        $("#" + imgId).attr("src",png64);
        self.json.push(self.storeStyle(false));
        //在里面
        var state = self.png.attr("state");
        if(state=="false"){
            self.png.attr("state","true");
            self.png.stop().animate({"left":0},500);
            $("#openImg").children("img").attr("src","/static/images/Chevron_left.png")
        }
        num ++;
        self.png.attr("num",num);
        var url =
        $("#pngImg" + (num -1)).click(function () {
            var it = $(this);
            var num = it.attr("num");
            num = parseInt(num);
            var styleArray = self.json[num-1];
            if(self.is_recombination_network()){
                var nodes = self.cy.filter(":child");
            }else{
                var nodes = self.cy.nodes();
            }
            var nodesStyle = styleArray[0];
            nodes.forEach(function (ele,i,eles) {
                var nodeStyle = nodesStyle[i];
                ele.style("background-color",rgbToString(nodeStyle[0]));
                ele.style("width",nodeStyle[1]);
                ele.style("height",nodeStyle[2]);
                ele.style("shape",nodeStyle[3]);
                ele.style("border-color",nodeStyle[4]);
                ele.style("border-width",nodeStyle[5]);
                ele.style("opacity",nodeStyle[6]);
            });
            var edges = self.cy.edges();
            var edgesStyle = styleArray[1];
            //color ,width,line-style
            edges.forEach(function (ele,i,eles) {
                var edgeStyle = edgesStyle[i];
                ele.style("line-color",edgeStyle[0]);
                ele.style("width",edgeStyle[1]);
                ele.style("line-style",edgeStyle[2]);
                ele.style("curve-style",edgeStyle[3]);
                ele.style("opacity",edgeStyle[4]);
            });
            if(self.is_recombination_network()){
                var tagsStyle = styleArray[2];
                var parents = self.cy.filter(":parent");
                parents.forEach(function (ele,i,eles) {
                    var tagStyle = tagsStyle[i];
                    ele.style("border-color",tagStyle[0]);
                    ele.style("border-width",tagStyle[1]);
                    ele.style("border-style",tagStyle[2]);
                });
            }
        });
        $("#img-close-" + (num-1)).click(function () {
            var it = $(this);
            var num = it.attr("num");
            $("#img-col-" + num).remove();
        });
    });

    $("#openImg").click(function () {
        var state = self.png.attr("state");
        var it = $(this);
        if(state=="false"){
            self.png.attr("state","true");
            self.png.stop().animate({"left":0},500);
            it.children("img").attr("src","/static/images/Chevron_left.png")
        }else{
            self.png.attr("state","false");
            self.png.stop().animate({"left":-400},500);
            it.children("img").attr("src","/static/images/Chevron_right.png")
        }
    });
    self.drapControl.click(function () {
        var it = $(this);
        var state = it.attr("state");
        //向上或者向下
        var boxState = self.drapBox.attr("state");
        var page = self.drapBox.attr("page");
        if(state==="down"){
            if(page==="1"){
                var bottomMiddleNumber = -168;
                var bottomUpNumber = -118;
            }else{
                var bottomMiddleNumber = -168;
                var bottomUpNumber = -118;
            }
            if(boxState==="middle"){
                self.drapBox.animate({"bottom":bottomMiddleNumber},200);
                self.drapBox.attr("state","down");
            }else if(boxState==="up"){
                self.drapBox.animate({"bottom":bottomUpNumber},200);
                self.drapBox.attr("state","middle");
            }else if(boxState==="down"){
            }
        }else if(state==="up"){
            if(page==="1"){
                var bottomMiddleNumber = -68;
                var bottomDownNumber = -118;
            }else{
                var bottomMiddleNumber = 0;
                var bottomDownNumber = -118;
            }
            if(boxState==="middle"){
                self.drapBox.animate({"bottom":bottomMiddleNumber},200);
                self.drapBox.attr("state","up");
            }else if(boxState==="down"){
                self.drapBox.animate({"bottom":bottomDownNumber},200);
                self.drapBox.attr("state","middle");
            }else if(boxState==="up"){

            }
        }
    });
    self.inputReset.click(function () {
        self.nodeColor.spectrum("set","#cccccc");
        self.nodeShape.val("ellipse");
        self.nodeSize.val("");

        self.linkColor.spectrum("set","#999999");
        self.linkWidth.val("");
        self.linkShape.val("solid");

        self.tagColor.spectrum("set","#ffffff");
        self.tagBorder.val("");
        self.tagShape.val("null");

    });

    self.labelSize.change(function () {
        var it = $(this);
         if(self.is_recombination_network()){
             self.cy.filter(":child").style("font-size",it.val());
         }else{
             self.cy.nodes().style("font-size",it.val());
         }
        self.cy.edges().style("font-size",it.val());
    });
    self.labeleColor.spectrum({
        'color':'#000000',
        'showInput':true,
        'showInitial':true,
        'showAlpha': false,
        'showPalette':true,
        "preferredFormat": "hex",
        'togglePaletteOnly': true,
        'palette':[
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]],
        'togglePaletteMoreText': 'more',
        'togglePaletteLessText': 'less',
        'change':function (color) {
            var hexColor = color.toHexString();
            if(self.is_recombination_network()){
                self.cy.filter(":child").style("color",hexColor);
            }else{
                self.cy.nodes().style("color",hexColor);
            }
        }
    });
    $("#shortpath-color").spectrum({
        'color':'#ff0000',
        'showInput':true,
        'showInitial':true,
        'showAlpha': false,
        'showPalette':true,
        "preferredFormat": "hex",
        'togglePaletteOnly': true,
        'palette':[
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]],
        'togglePaletteMoreText': 'more',
        'togglePaletteLessText': 'less',
        'change':function (color) {
            self.color = color.toHexString();
        }
    });

    self.saveStyleDataButton.click(function () {
        var data = self.storeStyle(true);
        var data = JSON.stringify(data);
        wnatajax.post({
            'url':"/analysis/storestyle/",
            'data':{
                'id':self.id,
                "data":data
            },"success":function (result) {
                if(result['code']==200){
                    console.log(result);
                    wnatalert.alertSuccess(
                        "successfully up load style data!"
                    )
                }
            },'fail':function (result) {

            }
        });
    });

    self.updateStyleDataButton.click(function () {
        wnatajax.get({
            'url':'/analysis/getstyle/',
            'data':{
                'id':self.id
            },'success':function (result) {
                if(result['code']==200){
                    console.log(result);
                    var data = JSON.parse(result['data']);
                    if (self.is_recombination_network()){
                        var nodes = self.cy.filter(":child");
                    }else{
                        var nodes = self.cy.nodes();
                    }
                    var nodesStyle = data[0];
                    nodes.forEach(function (ele,i,eles) {
                        var nodeStyle = nodesStyle[i];
                        ele.style("background-color",nodeStyle['color']);
                        ele.style("width",nodeStyle["weight"]);
                        ele.style("height",nodeStyle["height"]);
                        ele.style("shape",nodeStyle['shape']);
                        ele.style("border-color",nodeStyle['bordercolor']);
                        ele.style("border-width",nodeStyle['borderwidth']);
                        ele.style("opacity",nodeStyle['opacity']);
                    });

                    var edges = self.cy.edges();
                    var edgesStyle = data[1];
                    //color ,width,line-style
                    edges.forEach(function (ele,i,eles) {
                        var edgeStyle = edgesStyle[i];
                        ele.style("line-color",edgeStyle['color']);
                        ele.style("width",edgeStyle['width']);
                        ele.style("line-style",edgeStyle['shape']);
                        ele.style("curve-style",edgeStyle['curveStyle']);
                        ele.style("opacity",edgeStyle['opacity']);
                    });

                    if(self.is_recombination_network()){
                        var tagsStyle = data[2];
                        var parents = self.cy.filter(":parent");
                        parents.forEach(function (ele,i,eles) {
                            var tagStyle = tagsStyle[i];
                            ele.style("border-color",tagStyle['color']);
                            ele.style("border-width",tagStyle['width']);
                            ele.style("border-style",tagStyle['shape']);
                        });
                    }
                }
            },'fail':function (result) {

            }
        })
    });
};
Graph.prototype.selectorElement = function () {
    var self = this;
    self.pendingData = [];
    self.cy.on('select',function (evt) {
        var is_edit = $('input[name="editCheckBox"]:checked');
        var is_all_graph = $("input[name='entireCheckBox']:checked");
        var is_all = is_all_graph.val();
        var is_edit_value = is_edit.val();
        var is_edit_single_dot = is_edit_value=="on" && is_all == undefined;
        if(is_edit_single_dot){
            self.pendingData.push(evt.target);
        }
    });
};

Graph.prototype.editNodeStyle = function (ele) {
    var self = this;
    var nodeColor = self.nodeColor.val();
    var nodeSize = self.nodeSize.val();
    var nodeShape = self.nodeShape.val();

    var colorOptionValue = $('input[name="color-option"]:checked').val();
    var sizeOptionValue = $('input[name="size-option"]:checked').val();
    var shapeOptionValue = $('input[name="shape-option"]:checked').val();
    if(colorOptionValue){
        if(nodeColor!=''){
            ele.style("background-color",nodeColor);
        }
    }
    if(sizeOptionValue){
        nodeSize = nodeSize.split("-");
        var w = nodeSize[0];
        var h = nodeSize[1];
        if(w=="000"){
            //透明度
            ele.style("opacity", h/100);
        }else if(h=="000"){
            //border
            ele.style("border-width",w);
             if(nodeColor!=''){
                 ele.style("border-color",nodeColor);
            }
        }else{
            ele.style("width",w);
            ele.style("height",h);

        }
    }
    if(shapeOptionValue){
         ele.style("shape",nodeShape);
    }
};
Graph.prototype.editTagStyle = function (ele) {
    var self = this;
    var tagshape = self.tagShape.val();
    var parent = ele.parent();
    var tagValue = $('input[name="tag-option"]:checked').val();
    if (tagValue){
        if(tagshape=='null'){
            parent.style("border-width",0);
        }else{
            var tagColor = self.tagColor.val();
            var tagBorder = self.tagBorder.val();

            if(tagColor!=""){
                parent.style("border-color",tagColor);
            }

            if(tagBorder==""){
                parent.style("border-width",5);
            }else{
                parent.style("border-width",tagBorder);
            }
            parent.style("border-style",tagshape);
        }
    }
};
Graph.prototype.editEdgeStyle = function (ele) {
    var self = this;
    var linkColor = self.linkColor.val();
    var linkWidth = self.linkWidth.val();
    var linkShape = self.linkShape.val();
    var colorOptionValue = $('input[name="color-option"]:checked').val();
    var sizeOptionValue = $('input[name="size-option"]:checked').val();
    var shapeOptionValue = $('input[name="shape-option"]:checked').val();
    var curveLinkOptionValue = self.linkCurseLineStyle.val();
    if(colorOptionValue){
        if(linkColor!=''){
            ele.style("line-color",linkColor);
        }
    }
    if(sizeOptionValue){
        if(linkWidth!=''){
            if(linkShape=="opacity"){
                ele.style("opacity",linkWidth/100);
            }else{
                ele.style("width",linkWidth);
            }
        }
    }
    if(shapeOptionValue){
        ele.style('line-dash-pattern',[10,20]);
        ele.style("line-style",linkShape);
        ele.style("curve-style",curveLinkOptionValue);
    }
};
//编辑模式下的双击用作邻居样式
//编辑模式下的右击用作样式的恢复

Graph.prototype.handleSelector = function (str) {
    var self = this;
    if(str=="node"||str=="edge"||str=="*"){
        return self.cy.filter(str);
    }

    if(str.substring(0,1)=="#"){
        return self.cy.filter(str);
    }
    if(self.numOfString(str,"[")==1&&self.numOfString(str,"]")==1){
        if(str[0]=="["&&str[str.length-1]=="]") {
             return self.graphFilter(str);
        }
    };
    var datum = str.split("");
    var Len = datum.length;
    var operators = [];
    var operationNumber = [];
    var operatorsInsort = ["{" ,"(","|","&","!","^"];
    var operatorsPop = [")" ,"}"];
    var operatorsStart = ["{","("];
    var loop = true;
    var i = 0;
    while (loop){
        var value = datum[i];
        if(operatorsInsort.indexOf(value) > -1){
            operators.push(value);
        }else if(operatorsPop.indexOf(value) > -1){
            //进行运算,碰到结尾的括号
            do{
                var operator = operators.pop();
                if(operatorsStart.indexOf(operator)==-1){
                    var element1 = operationNumber.pop();
                    var element2 = operationNumber.pop();
                    var element = self.calculate(operator,element1,element2);
                    operationNumber.push(element);
                }
            }while (operatorsStart.indexOf(operator)==-1);
            //不成立的时候退出，计算到最后一个是{(括号为止
            if(operators.length===0){
                loop = false;
            }
        }else if(value==="["){
            var temp = value;
            var condition = true;
            var j = 0;
            while (condition){
                j ++;
                if(datum[i+j]!="]"){
                    temp = temp + datum[i+j];
                }else{
                    temp = temp + "]";
                    condition = false;
                    i = i + j;
                    var element = self.graphFilter(temp);
                    operationNumber.push(element);
                }
            }
        }else if(i===Len&&operators.length!=0){
            do{
                var operator = operators.pop();
                var element1 = operationNumber.pop();
                var element2 = operationNumber.pop();
                var element = self.calculate(operator,element1,element2);
                operationNumber.push(element);
            }while (operators.length!=0);
            if(operators.length===0){
                loop = false;
            }
        }
        i = i+1;
    }
    return operationNumber.pop();
};
Graph.prototype.calculate = function (operator,element1,element2) {
    var self = this;
    if(operator==="&"){
        //二者求交
        return element1.intersection(element2);
    }else if(operator==="|"){
        //二者求并
        return element1.union(element2);
    }else if(operator==="^"){
        //二者求异或
        return element1.symmetricDifference(element2);
    }else if(operator==="!"){
        //二者求补
        return element1.difference(element2);
    }
};

Graph.prototype.numOfString = function (str,char) {
    var self = this;
    var infos = str.split("");
    var num = 0;
    for(var key in infos){
        var value = infos[key];
        if(char===value){
            num = num + 1;
        }
    }
    return num;
};

Graph.prototype.storeStyle = function (is_position) {
    var self = this;
    var data = [];
    if(self.is_recombination_network()){
        //复合
        var nodes = self.cy.filter(":child");
    }else{
        //单纯
        var nodes = self.cy.filter("node");
    }
    var nodesStyle = [];
    nodes.forEach(function (ele,i,eles) {
        var nodeStyle = [];
        //颜色,w,h,shape,border-color,border-width
        nodeStyle.push(ele.style("background-color"));
        nodeStyle.push(ele.style("width"));
        nodeStyle.push(ele.style("height"));
        nodeStyle.push(ele.style("shape"));
        nodeStyle.push(ele.style("border-color"));
        nodeStyle.push(ele.style("border-width"));
        nodeStyle.push(ele.style("opacity"));
        if(is_position){
            nodeStyle.push(ele.position("x"));
            nodeStyle.push(ele.position("y"));
        }
        nodesStyle.push(nodeStyle);
    });
    data.push(nodesStyle);
    var edges = self.cy.edges();
    var edgesStyle = [];
    //color ,width,line-style
    edges.forEach(function (ele,i,eles) {
        var edgeStyle = [];
        edgeStyle.push(ele.style("line-color"));
        edgeStyle.push(ele.style("width"));
        edgeStyle.push(ele.style("line-style"));
        edgeStyle.push(ele.style("curve-style"));
        edgeStyle.push(ele.style("opacity"));
        edgesStyle.push(edgeStyle);
    });
    data.push(edgesStyle);
    if(self.is_recombination_network()){
        var tagsStyle = [];
        var parents = self.cy.filter(":parent");
        parents.forEach(function (ele,i,eles) {
            var tagStyle = [];
            tagStyle.push(ele.style("border-color"));
            tagStyle.push(ele.style("border-width"));
            tagStyle.push(ele.style("border-style"));
            tagsStyle.push(tagStyle);
        });
    }
    data.push(tagsStyle);
    return data;
};

function rgbToString(rgb) {
    var regexp = /[0-9]{0,3}/g;
    var re = rgb.match(regexp);
    var arrRbg = [];
    for(var key in re){
        var value = re[key];
        if(value!=""){
            arrRbg.push(value);
        }
    }
    var returnSpring = "#";

    for(var key in arrRbg){
        var value = arrRbg[key];
        if(value=="0"){
            returnSpring += "00";
        }else{
            var temp  = parseInt(value).toString(16);
            if(temp.length==1){
                var tempValue = "0" + temp;
            }else{
                 var tempValue = temp;
            }
            returnSpring += tempValue;
        }
    }
    return returnSpring
}

Graph.prototype.add_table_element = function (eles) {
    var self = this;
    var num = self.selectorTable.attr("num");
    num = parseInt(num);
    self.selectorTable.attr("num",num+1);
    var ele = eles.first();
    var colorOptionValue = $('input[name="color-option"]:checked').val();
    var sizeOptionValue = $('input[name="size-option"]:checked').val();
    var shapeOptionValue = $('input[name="shape-option"]:checked').val();
    var tagValue = $('input[name="tag-option"]:checked').val();
    var is_node = ele.isNode();
    if(is_node){
        var element = "Node";
    }else{
        var element = "Edge";
    }
    var visualChannel = "";
    var detail = "";
    if(colorOptionValue){
        visualChannel += " color";
        detail = detail + "color:";
        if(is_node){
            detail += self.nodeColor.val();
        }else{
            detail += self.linkColor.val();
        }
    }
    detail +=" ";
    if(sizeOptionValue){
        visualChannel += " size";
        detail = detail + "size:";
        if(is_node){
            detail += self.nodeSize.val()?self.nodeSize.val():"30-30";
        }else{
            detail += self.linkWidth.val()?self.linkWidth.val():5;
        }
    }
    detail +=" ";
    if(shapeOptionValue){
        visualChannel += " shape";
        detail = detail + "shape:";
        if(is_node){
            detail += self.nodeShape.val();
        }else{
            detail += self.linkShape.val();
            detail += self.linkCurseLineStyle.val();
        }
    }
    var appendSpring = "<tr id='tableTr" + num+ "'>\n" +
        "                    <td>" + num + "</td>\n" +
        "                    <td>" + element + "</td>\n" +
        "<td>" + self.elementSelector.val() +"</td>\n" +
        "                    <td>" + visualChannel + "</td>\n" +
        "                    <td>" + detail +  "</td>\n" +
        "                    <td>" + "<button type=\"button\" id=\"tableDeleteBtn" + num +"\" class=\"btn btn-block btn-danger btn-xs\">Delete</button>" +
        "" +  "</td>\n" +
        "                </tr>";
    self.selectorTable.children("tbody").append($(appendSpring));
    $("#tableDeleteBtn" + num).click(function () {
        $("#tableTr" + num).remove();
    });
    if(tagValue){
        if(self.tagShape=="null"){
            return;
        }else{
            self.selectorTable.attr("num",num+2);
            var x = num +1;
            visualChannel = "";
            visualChannel = "color size shape";
            detail = "";
            var a = self.tagBorder.val()?self.tagBorder.val():"5px";
            detail = "color:" + self.tagColor.val() + " width:" + a + " shape:" + self.tagShape.val();

            var appendSpring = "<tr id='tableTr" + x+ "'>\n" +
                "                    <td>" + x + "</td>\n" +
                "                    <td>" + "Tag" + "</td>\n" +
                "<td>" + self.elementSelector.val() +"</td>\n" +
                "                    <td>" + visualChannel + "</td>\n" +
                "                    <td>" + detail +  "</td>\n" +
                "                    <td>" + "<button type=\"button\" id=\"tableDeleteBtn" + x +"\" class=\"btn btn-block btn-danger btn-xs\">Delete</button>" +
                "" +  "</td>\n" +
                "                </tr>";
            self.selectorTable.children("tbody").append($(appendSpring));
            $("#tableDeleteBtn" + x).click(function () {
                $("#tableTr" + x).remove();
            });
        }
    }
};

Graph.prototype.graphFilter = function (operatorNum) {
    var self = this;
    var kind = operatorNum.substring(1,4).toLowerCase();
    if(kind==="low"||kind==="top"){
        var atSignPosition = operatorNum.indexOf("@");
        var equalsSignPosition = operatorNum.indexOf("=");
        var types = [];
        var types_value = [];
        if(atSignPosition==-1){
            //针对所有
           self.centralityRange.each(function (index,element) {
                var it = $(element);
                var disabled_value = it.attr("disabled");
                if(!disabled_value){
                    var value = parseInt(it.val());
                    if(value!==0){
                        types.push(it.attr("centrality_type"));
                        types_value.push(parseInt(it.val()));
                    }
                }
           });
        }else{
            //针对单一
            types_value.push(100);
            types.push(operatorNum.substring(atSignPosition+1,equalsSignPosition));
        }
        var topnumber  = operatorNum.substring(equalsSignPosition +1,operatorNum.length-1);
        if(equalsSignPosition!=-1&&types.length!=0){
            var data;
            var element = $.ajax({
                url:'/analysis/sort/',
                type:"GET",
                data:{
                    "id":self.id,
                    "kind":kind,
                    "types":JSON.stringify(types),
                    "typesValue" : JSON.stringify( types_value),
                    "topnumber":topnumber
                },
                async:false,
                dataType:'json',
                success:function (result) {
                    if(result['code']==200){
                        data = JSON.parse(result['data']);
                    }
                }, error:function (result) {

                }
            });
             var eleSpring = "";
             for(var key in data){
                 var value = data[key];
                 if(key == data.length-1){
                     eleSpring += "node#" + value;
                 }else{
                     eleSpring += "node#" + value +",";
                 }
             }
             return self.cy.elements(eleSpring);
        }else{
            return self.cy.nodes();
        }
    }else{
        return self.cy.filter(operatorNum);
    }

    //[top=33]
    //[top@centrality=3]
};

// if(selectorval.substring(0,3).toLowerCase()==="top"||selectorval.substring(0,3).toLowerCase()==="low"){
//                         ///top[xxxx=3]
//                         var equalsSignPosition = selectorval.indexOf("=");
//                         var type = selectorval.substring(4,equalsSignPosition);
//                         var topnumber = selectorval.substring(equalsSignPosition+1,selectorval.length-1);
//                         var kind = selectorval.substring(0,3);
//                         wnatajax.get({
//                             'url':"/analysis/sort/",
//                             'data':{
//                                 'id':self.id,
//                                 'type':type,
//                                 'topnumber':topnumber,
//                                 "kind":kind
//                             },'success':function (result) {
//                                 if(result['code']==200){
//                                     var data = JSON.parse(result['data']);
//                                     var eleSpring = "";
//                                     for(var key in data){
//                                         var value = data[key];
//                                         if(key == data.length-1){
//                                             eleSpring += "node#" + value;
//                                         }else{
//                                             eleSpring += "node#" + value +",";
//                                         }
//                                     }
//                                     var eles = self.cy.elements(eleSpring);
//                                     console.log(eleSpring);
//                                     console.log(eles);
//                                     self.add_table_element(eles);
//                                     if(self.is_recombination_network()){
//                                         var nodes = eles.filter(":child");
//                                     }else{
//                                         var nodes = eles.filter("node");
//                                     }
//                                     var edges = eles.filter("edge");
//                                      self.editNodeStyle(nodes);
//                                      self.editEdgeStyle(edges);
//                                      if(self.is_recombination_network()){
//                                          self.editTagStyle(nodes);
//                                      }
//                                      self.imgBtn.click();
//                                      return;
//                                 }
//                             },'fail':function (result) {
//
//                             }
//                         });
//                         return;
//                     }