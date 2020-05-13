Graph.prototype.initChooseLayoutEvent = function () {
    var self = this;
    var labels = self.node_key;
    var selector = $("#sort-Selector");
    for (label in labels) {
        var options = "<option value='" + labels[label] + "'>" + labels[label] + "</option>";
        selector.append(options);
    };
    self.chooseLayoutSelector.change(function (event) {
        var value = $(this).find("option:selected").val();
        self.layoutStartButton.removeClass("disabled");
        $(".input-layout-option").remove();

        if (value == 0) {
            //circle
            //startangle sort
            var staryAngleInput = $("<input type='text' class='form-control layout-option input-layout-option' id='start-angle' placeholder='start angle eg:1.5'>");
            var sortSelector = $("<select class='custom-select layout-option input-layout-option' id='sort-Selector'></select>");
            var labels = self.node_key;
            for (label in labels) {
                var options = "<option value='" + labels[label] + "'>" + labels[label] + "</option>";
                sortSelector.append(options);
            };
            self.layoutOptionBox.prepend(sortSelector);
            self.layoutOptionBox.prepend(staryAngleInput);
        } else if (value == 1) {
            //random
            //无任何操作
        } else if (value == 2) {
            //Gird
            //cols and rows
            var colsInput = $("<input type='text' class='form-control layout-option input-layout-option' id='gird-cols' placeholder='cols eg:100'>");
            var rowsInput = $("<input type='text' class='form-control layout-option input-layout-option' id='gird-rows' placeholder='rows eg:100'>");
            self.layoutOptionBox.prepend(rowsInput);
            self.layoutOptionBox.prepend(colsInput);
        } else if (value == 3) {
            //concentric
            //startangle concentric
            var staryAngleInput = $("<input type='text' class='form-control layout-option input-layout-option' id='start-angle' placeholder='start angle eg:1.5'>");
            var sortSelector = $("<select class='custom-select layout-option input-layout-option' id='sort-Selector'></select>");
            var lists = self.node_key;
            sortSelector = self.initOptions(sortSelector, lists);
            self.layoutOptionBox.prepend(sortSelector);
            self.layoutOptionBox.prepend(staryAngleInput);
        } else if (value == 4) {
            //Breadthfirst
            //circle and root
            var isCircleSelector = $("<select class='custom-select layout-option input-layout-option' id='is-circle'></select>");
            var rootInput = $("<input type='text' class='form-control layout-option input-layout-option' id='root-node-id' placeholder='root-nodes-id:  please join id with ? eg:1?2?8'>");

            rootInput.attr('data-inputmask', "'mask':999-999-9999");
            var lists = [true, false];
            isCircleSelector = self.initOptions(isCircleSelector, lists);
            self.layoutOptionBox.prepend(rootInput);
            self.layoutOptionBox.prepend(isCircleSelector);
        } else if (value == 5) {
            // // cose refresh and gravity:
            // var refreshInput = $("#refresh-input");
            // var gravityInput = $("#gravity-input");
            var refreshInput = $("<input type='text' class='form-control layout-option input-layout-option' id='refresh-input' placeholder='refresh times eg:20'>");
            var gravityInput = $("<input type='text' class='form-control layout-option input-layout-option' id='gravity-input' placeholder='gravity eg:1.0'>");
            self.layoutOptionBox.prepend(gravityInput);
            self.layoutOptionBox.prepend(refreshInput);
        } else if (value == 6) {
            //Preset
            //xy
        } else if (value == 7) {
            //d3-force
            //无处理

        } else if (value == 8) {
            //euler
            //胡可定律的系数
            //Hooke's law coefficient
            // 重力
            // Makes the nodes repel each other for negative values
            // Makes the nodes attract each other for positive values
            var hookeCofficient = $("<input type='text' class='form-control layout-option input-layout-option' id='hooke-input' placeholder='Hooke law coefficient on [0,1] eg:0.008'>");
            var springLength = $("<input type='text' class='form-control layout-option input-layout-option' id='springlength-input' placeholder='Spring ideal length on eg:80'>");
            self.layoutOptionBox.prepend(springLength);
            self.layoutOptionBox.prepend(hookeCofficient);

        } else if (value == 9) {
            //fcose
            // Maximum number of iterations to perform  numIter: 2500,
            var edgeLength = $("<input type='text' class='form-control layout-option input-layout-option' id='edgelength-input' placeholder='Edge ideal length on eg:50'>");
            var maxNumIter = $("<input type='text' class='form-control layout-option input-layout-option' id='maxnumiter-input' placeholder='max iter num eg: 2500'>");
            self.layoutOptionBox.prepend(maxNumIter);
            self.layoutOptionBox.prepend(edgeLength);

        } else if (value == 10) {
            //klay
            //无处理

        } else if (value == 11) {
            //spread
            //无处理
        }else if (value == 12){
            //KK算法
        }else if(value == 13){
            //FR算法
        }else if(value == 14){
            //sprial算法
        }
    });
};



//点击startlayout的点击事件
Graph.prototype.startLayout = function () {
    var self = this;
    //判断data里面如果由posX和PosY字段

    self.layoutStartButton.click(function () {
        event.preventDefault();
        var value = $(self.chooseLayoutSelector).find("option:selected").val();

        if (value == 0) {
            var startAngleInput = $("#start-angle");
            var sortSelector = $("#sort-Selector");
            //circie
            if (self.isElementSuccessfullyGet(startAngleInput, sortSelector)) {
                var Angle = startAngleInput.val();
                var sorter = sortSelector.val();
                if (Angle == '') {
                    Angle = 0;
                } else {
                    Angle = parseFloat(Angle);
                    Angle = 2 - Angle;
                }
                var options = {
                    name: 'circle',
                    startAngle: Angle * Math.PI,
                    sort: function (a, b) {
                        return a.data(sorter) - b.data(sorter)
                    }
                };
            }
        } else if (value == 1) {
            //random
            var options = {
                name: 'random'
            };
        } else if (value == 2) {
            //grid
            var colsInput = $("#gird-cols");
            var rowsInput = $("#gird-rows");
            if (self.isElementSuccessfullyGet(colsInput, rowsInput)) {
                var row = rowsInput.val();
                var col = colsInput.val();
                if (row != '' && col != '') {
                    row = parseInt(row);
                    col = parseInt(col);
                } else {
                    if (row == '') {
                        row = undefined;
                    }
                    if (col == '') {
                        col = undefined;
                    }
                }
                options = {
                    name: 'grid',
                    rows: row,
                    cols: col,
                };
            }
        } else if (value == 3) {
            ////concentric
            var startAngleInput = $("#start-angle");
            var sortSelector = $("#sort-Selector");
            if (self.isElementSuccessfullyGet(startAngleInput, sortSelector)) {
                var Angle = startAngleInput.val();
                var sorter = sortSelector.val();
                if (Angle == '') {
                    Angle = 0;
                } else {
                    Angle = parseFloat(Angle);
                    Angle = 2 - Angle;
                }
                var options = {
                    name: 'concentric',
                    startAngle: Angle * Math.PI,
                    sort: function (a, b) {
                        return a.data(sorter) - b.data(sorter)
                    }
                };
            }
        } else if (value == 4) {
            //breadthfirst
            var isCircleInput = $("#is-circle");
            var rootInput = $("#root-node-id");
            if (self.isElementSuccessfullyGet(isCircleInput, rootInput)) {
                var isCircle = isCircleInput.val();
                if (isCircle == 'true') {
                    isCircle = true;
                } else if (isCircle == 'false') {
                    isCircle = false;
                } else {
                    isCircle = undefined;
                }
                var root_id = rootInput.val();
                if (root_id == '') {
                    var node_index = undefined;
                } else {
                    var ids = root_id.split("?");
                    var root_index = [];
                    for (id in ids) {
                        var idx = "#" + ids[id];
                        root_index[id] = idx;
                    }
                    var node_index = root_index.join(",");
                }

                if (node_index == undefined) {
                    var roots = undefined;
                } else {
                    var roots = self.cy.$(node_index)
                }
                options = {
                    name: 'breadthfirst',
                    roots: roots,
                    circle: isCircle
                };
            }
        } else if (value == 5) {
            //cose  refresh-input   gravity-input
            var refreshInput = $("#refresh-input");
            var gravityInput = $("#gravity-input");

            if (self.isElementSuccessfullyGet(refreshInput, gravityInput)) {
                var refresh = refreshInput.val();
                var gravity = gravityInput.val();

                if (refresh != '' && gravity != '') {
                    refresh = parseInt(refresh);
                    gravity = parseInt(gravity);
                } else {
                    if (refresh == '') {
                        refresh = 20;
                    }
                    if (gravity == '') {
                        gravity = 1.0;
                    }
                }

                var options = {
                    name: 'cose',
                    // refresh:refresh,
                    // gravity:gravity
                };
            }
        } else if (value == 6) {
            var data = self.node_key;
            var exists = ((data.indexOf("posX") > -1) && (data.indexOf("posY")));
            if (exists) {
                var options = {
                    name: 'preset',
                    positions: function (node) {
                        var posX = node.data("posX");
                        var posY = node.data("posY");
                        console.log(posX);
                        console.log(posY);
                        return {x: posX, y: posY};
                    }
                };
            } else {
                $(this).addClass("disabled");
            }
        } else if (value == 7) {
            //d3-force
            var options = {
                name: 'd3-force',
                animate: false,
                fit: true,
                linkId: function id(d) {
                    return d.id;
                },
                linkDistance: 100,
                manyBodyStrength: -600,
                randomize: false,
                infinite: false,
            };
        } else if (value == 8) {
            //euler
            var hookCofficient = $("#hooke-input");
            var springLength = $("#springlength-input");
            var hook = hookCofficient.val();
            var idealLength = springLength.val();
            if (hook == '') {
                hook = 0.008;
            } else {
                hook = parseFloat(hook);
            }
            if (idealLength == '') {
                idealLength = 80;
            } else {
                idealLength = parseFloat(idealLength);
            }
            var options = {
                name: 'euler',
                springLength: idealLength,
                springCoeff: hook,
            };
        } else if (value == 9) {
            //fcose
            var edgeLengthInput = $("#edgelength-input");
            var maxNumInput = $("#maxnumiter-input");
            var edgeLegthval = edgeLengthInput.val();
            var maxNumIter = maxNumInput.val();

            if (edgeLegthval == '') {
                edgeLegthval = 50;
            } else {
                edgeLegthval = parseFloat(edgeLegthval);
            }
            if (maxNumIter == '') {
                maxNumIter = 2500;
            } else {
                maxNumIter = parseFloat(maxNumIter);
            }
            var options = {
                name: 'fcose',
                idealEdgeLength: edgeLegthval,
                numIter: maxNumIter,
            };
        } else if (value == 10) {
            //klay
            var options = {
                name: 'klay',
                animate: true,
            };
        } else if (value == 11) {
            //spread
            var options = {
                name: 'spread'
            };
        } else if(value == 12||value==13||value==14){
            wnatajax.get({
                'url':"/analysis/getlayout/",
                'data': {
                    'id':self.id,
                    'layout':value
                },'success':function (result) {
                    if(result['code']==200){
                        var data = result['data'];
                        var options = {
                            name:"preset",
                            positions: function (node) {
                                var counter = node.id()
                                return {x: data[counter][0], y: data[counter][1]};
                            }
                        };
                        if(self.is_recombination_network()){
                            var layout = (self.cy.nodes(':child').union(self.cy.edges())).layout(options);
                        }else{
                            var layout = self.cy.layout(options);
                        }
                        layout.run();
                    }
                },'fail':function (result) {

                }
            })
        }
        if(!(value == 12||value==13||value==14)){
            if(self.is_recombination_network()){
                var layout = (self.cy.nodes(':child').union(self.cy.edges())).layout(options);
            }else{
                var layout = self.cy.layout(options);
            }
            layout.run();
        }
    });
};

Graph.prototype.is_recombination_network = function(){
    var self = this;
    if(self.node_key.indexOf("parent") > -1){
        return true
    }else{
        return false
    }
};


Graph.prototype.initResetControl = function () {
    var self = this;
    self.resetButton.click(function () {
        event.preventDefault();
        self.cy.fit(self.container);
    });
};

Graph.prototype.isElementSuccessfullyGet = function (object1, object2) {
    if ((object1.val() != NaN && typeof (object1) == "object") && (object2.val() != NaN && typeof (object2) == "object")) {
        return true;
    } else {
        return false;
    }
};

Graph.prototype.toastsInfo = function(title,subtitle,body){
    $(document).Toasts('create', {
        class: 'bg-success',
        title: title,
        subtitle: subtitle,
        position: 'topRight',
        body: body
      });
};