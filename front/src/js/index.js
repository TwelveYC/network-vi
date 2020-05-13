function Graph() {
    this.container = document.getElementById("main-link-view");
    this.resetButton = $(".reset-btn");
    this.chooseLayoutSelector = $("#layout-select");
    this.layoutOptionBox = $("#option-box");
    this.layoutStartButton = $("#start-layout-btn");
    this.labelSelector = $("#label-select");
    this.labelSubmitButton = $("#label-submit-btn");
    this.diagramcontainer = $("#diagram-img");
    this.diagramButton = $("#diagram-submit-btn");
    //修改显示的网络
    this.networkNameSelector = $("#network-name-select");
    //多个网络或者单个网络
    this.directChoose = $("#direct-select");
    this.conceptChoose = $("#concept-select");
    this.diagramChoose = $("#diagram-select");
    this.typeChoose = $("#type-select");

    //结果网格
    this.resultInput = $("#stat-result");
    //最短路径的展示颜色
    this.color = '#ff0000';

    this.colors = [
        '#c23531',
        '#000000',
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3'];


    this.nodeColor = $("#node-color-picker");
    this.nodeSize = $("#node-size-input");
    this.nodeShape = $("#node-shape-select");


    this.linkColor = $("#link-color-picker");
    this.linkWidth = $("#link-width-input");
    this.linkShape = $("#link-shape-select");
    this.linkCurseLineStyle = $("#curve-line-style");

    this.tagColor = $("#tag-color-input");
    this.tagBorder = $("#tag-border-input");
    this.tagShape = $("#tag-shape-select");

    this.applyBut = $("#apply-btn");
    this.shapeReset = $("#reset-style-btn");
    this.clearBtn = $("#clear-btn");
    this.imgBtn = $("#img-btn");
    this.inputReset = $("#reset-value");

    this.png = $("#img-wrapper");

    this.elementSelector = $("#cy-element-select");
    this.pngBox = $("#img-box");
    this.drapControl = $(".arrow-up-down");
    this.drapBox = $(".drop-down-box");

    this.labelSize = $("#label-size");
    this.labeleColor = $("#label-color");

    this.selectorTable = $(".selector-table");
    this.selectorWapper = $(".selector-wrapper");
    this.openTable = $("#openTable");

    this.mapChannel = $("#map-channel");
    //装着二者的选项的盒子
    this.mapSizeBox = $("#map-size-box");
    this.mapColorBox = $("#map-color-box");

    this.minSizeInput = $("#min-size-input");
    this.maxSizeInput = $("#max-size-input");
    this.colorSelector = $("#map-color-option");
    this.gradientRamp = $("#gradient-ramp");
    this.mapNormalization = $("#map-normalization");

    this.sideBarNav = $(".sidebar-nav");
    this.secondFloor = $(".second-floor");

    this.centralityRange = $(".centrality-range");
    this.refreshButton = $("#refresh-button");

    this.saveStyleDataButton = $("#save-style-data");
    this.updateStyleDataButton = $("#update-style-data");
};

//对网络数据的初始化
Graph.prototype.initCyGraph = function () {
    var self = this;
    self.id = 5;
    self.ajaxGetNetworkData(self.id, true);
};

//初始化更改网络的selector的change事件
Graph.prototype.initNetworkNameSelectorEvent = function () {
    var self = this;
    self.networkNameSelector.change(function () {
        var it = $(this);
        var ids = it.val();
        self.id = parseInt(ids);
        self.ajaxGetNetworkData(ids, false);
    });
};

//通过ajax方式获取网络的cy数据
Graph.prototype.ajaxGetNetworkData = function (ids, is_start) {
    var self = this;
    wnatajax.get({
        'url': '/analysis/cy/',
        'data': {
            'ids': ids
        }, 'success': function (result) {
            if (result['code'] == 200) {
                var Len = result['message']['size'];
                var data = result['data'];
                var names = result['message']['name'];
                data = JSON.parse(data);
                if (Len == 1) {
                    names = names[0];
                    self.data = data[0];
                    var options = {
                        container: self.container,
                        elements: self.data,
                        style: [{
                            selector: 'node',
                            style: {
                                // 'background-color':'#999999',
                                // 'width': 50,
                                // 'height': 50,
                                // 'border-color':'#000000',
                                // 'border-style':'solid',
                                // 'border-width':20,
                                // 'label': 'data(id)',
                                // 'background-color': 'green',
                                // 'background-image':'/media/images/bg.bmp',
                                // 'background-fit': 'none',
                                // 'background-clip': 'none',
                                // 'bounds-expansion': 10,
                                // 'background-width':50,
                                // 'background-height':50,
                                // 'background-image-opacity':0.1
                                // 'bounds-expansion':'20px',
                                // 'padding':'20px',
                                // 'shape':'triangle',
                                 // "text-background-opacity": 1,
                                // 'text-background-color':'#f00',
                                // "text-background-shape": "roundrectangle",
                                //  'content': 'data(id)',
                                // 'text-valign': 'center',
                                // 'text-halign': 'center'
                                // 'shape':'triangle',
                            }
                        }, {
                            selector: ':parent',
                            style: {
                                // 'border-color':'#000000',
                                // 'border-style':'dotted',
                                'border-width':0,
                                'background-color': '#ffffff',

                                // // 'display':'none'
                                // // 'visibility ':'hidden',
                                // 'width':20,
                                // 'height':20

                            },
                             // 'visibility ':'hidden',

                        },
                            {
                                selector: 'edge',
                                style: {
                                    'width': 10,
                                    // 'curve-style': 'taxi',
                                    // 'line-color': '#cccccc',
                                    // 'curve-style': 'bezier',
                                    // 'target-arrow-color': '#b2b2b2',
                                    // 'target-arrow-shape': 'none',
                                    // 'line-style': 'dashed',
                                    //
                                }
                            },
                        ],
                        layout: {
                            name: 'circle',
                            fit: true,
                            startAngle: 0
                        },
                        // wheelSensitivity: 0.5,
                    };
                    var networkname = $("#network-name");
                    networkname.text(names);
                    self.cy = cytoscape(options);
                    if (is_start) {
                        self.init();
                    } else {
                        self.initCyEvent();
                    }
                }
            }
        }, 'fail': function (result) {

        }
    });
};

//所有的初始化函数
Graph.prototype.init = function () {
    var self = this;
    self.mychart = echarts.init(self.diagramcontainer[0]);
    self.initLableNESelector();
    //初始化label点选择器
    //注册reset键事件
    self.initResetControl();
    //将数据的key获取出来
    self.initDataKeyEvent();
    //注册点和线的点击事件
    self.initTapEvent();

    //注册mouseOver事件
    self.initMouseOverEvent();
    //注册选择layout的事件
    self.initChooseLayoutEvent();
    //注册开始layout点击按钮事件
    self.startLayout();
    //初始化label点和线选择滑动按钮事件
    //1表示初始化点。其余表示初始化边
    self.initNodeEdgeLableOption(1);
    //初始化label提交按钮
    self.initLableSubmitEvent();
    //初始化echarts
    //self.setEchartOption();
    //diagram的提交事件
    self.initDiagramSubmitButton();
    //切换网络
    self.initNetworkNameSelectorEvent();
    //多网络单网络的切换开关
    self.initSelector();

    self.initDiagramSelect();

    self.initConceptEvent();

    //toolbard的初始化事件
    //checkebox,点选之后才能开始编辑
     self.mouseRightClick();
    self.initStyle();
    self.directChoose.change();
    self.tableControl();
    self.initMapChannel();
    self.initSideBarEvent();
    self.initCentralityRangeChange();
    self.initCentralityRangeReset();
    self.test();
};

//单纯和cy相关的初始化，用作取得新数据之后的初始化
Graph.prototype.initCyEvent = function () {
    var self = this;
    self.initDataKeyEvent();
    self.initTapEvent();
    //注册mouseOver事件
    self.initMouseOverEvent();
    self.initNodeEdgeLableOption(1);
    var click_element = $("#single-element-data");
    click_element.text('');
    self.directChoose.change();
    self.chooseLayoutSelector.change();
    self.conceptChoose.change();
    self.selectorElement();
     self.mouseRightClick();
     $(".png-box").attr("src","");
     self.initCentralityRangeReset();
};


//假的echart初始化
Graph.prototype.setEchartOption = function () {
    var self = this;
    setTimeout(function () {

        option = {
            // legend: {},
            tooltip: {
                trigger: 'axis',
                showContent: false
            },
            dataset: {
                source: [
                    ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                    ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                    ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                    ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
                    ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {gridIndex: 0},
            grid: {top: '55%'},
            series: [
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {
                    type: 'pie',
                    id: 'pie',
                    radius: '30%',
                    center: ['50%', '25%'],
                    label: {
                        formatter: '{b}: {@2012} ({d}%)'
                    },
                    encode: {
                        itemName: 'product',
                        value: '2012',
                        tooltip: '2012'
                    }
                }
            ]
        };

        self.mychart.on('updateAxisPointer', function (event) {
            var xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
                var dimension = xAxisInfo.value + 1;
                self.mychart.setOption({
                    series: {
                        id: 'pie',
                        label: {
                            formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                        },
                        encode: {
                            value: dimension,
                            tooltip: dimension
                        }
                    }
                });
            }
        });
        self.mychart.setOption(option);

    });
};


//layout选择事件初始化

//对任意一个selecor，添加option的方法
Graph.prototype.initOptions = function (Selector, lists) {
    for (list in lists) {
        var options = "<option value='" + lists[list] + "'>" + lists[list] + "</option>";
        Selector.append(options);
    }
    return Selector;
};

//所有的右下方选择器的初始化
Graph.prototype.initSelector = function () {
    var self = this;
    self.initDirectChoose();
};



//节点连边和整体的初始化
Graph.prototype.initDirectChoose = function () {
    var self = this;
    self.directChoose.change(function () {
        var it = $(this);
        var v = it.val();
        var se = self.conceptChoose;
        se.empty();
        if (v == 'Node') {
            var optionLists = self.node_key;
            var da = [];
            for (var key in optionLists) {
                var temp = optionLists[key]
                if (temp == 'id' || temp == 'label') {

                } else {
                    da.push(temp)
                }
            }
            self.initOptions(se, da);
        } else if (v == 'Link') {
            var optionLists = self.edge_key;
            var da = [];
            for (var key in optionLists) {
                var temp = optionLists[key]
                if (temp == 'id' || temp == 'label' || temp == 'target' || temp == 'source') {

                } else {
                    da.push(temp)
                }
            }
            self.initOptions(se, da);
        } else {
            var optionLists = ['shortpath', 'degreehistogram', 'kcore', 'node_connectivity', 'graphdensity',"betweenesshistogram"];
            self.initOptions(se, optionLists);
        }

        if (v == 'Entirety') {
            var options = ['parallel', 'line'];

        } else if (v == 'Node') {
            var options = ['line', 'polar', 'bar', 'bar-polar', 'radar'];

        } else {
            var options = ['line', 'polar', 'bar', 'bar-polar'];
        }
        self.typeChoose.empty();
        self.initOptions(self.typeChoose, options);
        //跑一下时间concept的change事件
        self.conceptChoose.change();
    });
};

//只有选择diagram的时候才需要出现什么类型图表
Graph.prototype.initDiagramSelect = function () {
    var self = this;
    self.diagramChoose.change(function () {
        var it = $(this);
        var v = it.val();
        if (v === 'diagram') {
            self.typeChoose.show();
        } else {
            self.typeChoose.hide()
        }
    });
};

Graph.prototype.initDataKeyEvent = function () {
    var self = this;
    self.node_key = [];
    self.edge_key = [];
    for (var key in self.cy.nodes()[0].data()) {
        self.node_key.push(key);
    }

    for (var key in self.cy.edges()[0].data()) {
        self.edge_key.push(key);
    }
};
Graph.prototype.test = function(){
    var self = this;
    $("#time-dependent").click(function () {
        var times = parseInt($(this).attr("times"));
        $(this).attr("times",times + 1);
        wnatajax.get({
            'url':"/analysis/test/",
            "data":{
                'id':self.id,
                'times':parseInt(times)
            },"success":function (result) {
                if(result['code']==200){
                    console.log(result);
                    var data = JSON.parse(result['data']);
                    var eleSpring = "";
                     for(var key in data){
                         var value = data[key];
                         if(key == data.length-1){
                             eleSpring += "node#" + value;
                         }else{
                             eleSpring += "node#" + value +",";
                         }
                     }
                     self.cy.filter(eleSpring).style("background-color","#eeeeee");
                     console.log(times);
                }else {
                    console.log(result)
                }

            },"fail":function (result) {

            }
        })

    });
};

//针对要统计的物理量概念初始化
Graph.prototype.initConceptEvent = function () {
    var self = this;
    self.conceptChoose.change(function () {
        var it = $(this);
        var v = it.val();
        // 'shortpath', 'degreehistogram', 'kcore'
        //最短路径（）（每个点的最短路径之和，line）
        //k核 （拓扑上面改颜色）
        //度分布（只能散点图）
        if (v == 'shortpath') {
            self.typeChoose.empty();
            var lists = ['line', 'polar', 'bar', 'bar-polar'];
            self.initOptions(self.typeChoose, lists);
        } else if (v == 'degreehistogram') {
            self.typeChoose.empty();
            var lists = ['scatter'];
            self.initOptions(self.typeChoose, lists);
        } else if (v == 'kcore') {
            self.typeChoose.empty();
            var lists = ['pie', 'bar'];
            self.initOptions(self.typeChoose, lists);
        } else if(v.indexOf("communities")>-1){
             self.typeChoose.empty();
            var lists = ['line', 'polar', 'bar', 'bar-polar','pie'];
            self.initOptions(self.typeChoose, lists);
        }else {
            self.typeChoose.empty();
            var lists = ['line', 'polar', 'bar', 'bar-polar'];
            self.initOptions(self.typeChoose, lists);
        }
        if (v == 'node_connectivity' || v == 'graphdensity') {
            self.diagramChoose.hide();
            self.typeChoose.hide();
        } else {
            self.diagramChoose.val('diagram');
            self.diagramChoose.show();
            self.typeChoose.show();
        }
        // if (v == 'communities') {
        //     self.typeChoose.empty();
        //     var lists = ['pie', 'bar', 'pie+bar'];
        //     self.initOptions(self.typeChoose, lists);
        //     self.communityFunctionSelector.show();
        // } else {
        //     self.communityFunctionSelector.hide();
        // }
    });
};


Graph.prototype.isElementSuccessfullyGet = function (object1, object2) {
    if ((object1.val() != NaN && typeof (object1) == "object") && (object2.val() != NaN && typeof (object2) == "object")) {
        return true;
    } else {
        return false;
    }
};

Graph.prototype.run = function () {
    var self = this;
    self.initCyGraph();
};

$(function () {
    var graph = new Graph();
    graph.run();
});
