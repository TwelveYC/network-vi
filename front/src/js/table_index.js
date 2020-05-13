function TableControl() {
    this.tableContainer = $("#example2");
    this.tabUl = $("#custom-content-below-tab");
    this.tabContent = $("#custom-content-below-home");
    this.optionChoose = $(".option-choose");
    this.multiChoose = $(".multi-choose");
    this.singleChoose = $(".single-choose");
    this.partChoose = $(".partial-choose");
    this.upLoadFile = $("#customFile");
    this.uPLoadFileBtn = $(".upload-network-btn");
    this.uploadLabel = $(".custom-file-label");
    this.confirmBtn = $(".confirmation-btn");
    this.index = 0;
    this.tableUl = $(".table-ul");
    this.getAverageValue = $(".get-value");
    this.deleteValue = $(".delete-value");
    this.partialSelector = $("#partial-network-select");


    this.deleteGraphButton = $(".delete-graph");
    this.networkTable = $("#network-table");
    this.networkTable.DataTable();
}


TableControl.prototype.TabClickEvent = function () {
    var self = this;
    self.tabUl.children('li').each(function (index, obj) {
        var x = index;
        $(obj).click(function () {
            $(this).children('a').addClass('active');
            $(this).siblings().children('a').removeClass("active");
            self.optionChoose.css("display", "none");
            if (x == 0) {
                self.multiChoose.css("display", "block");
                var text = "Multiple network means that you will creat multiple network for comparison.";
            } else if (x == 1) {
                self.singleChoose.css("display", "block");
                var text = "Single network means that you will analysis one network.";
            } else if (x = 2) {
                self.partChoose.css("display", "block");
                var text = "Calculating Network Parameters means you can calculate network parameter with the module."
            }
            self.tabContent.text(text);
            self.index = x;

        });
    });
};

TableControl.prototype.initUpLoadEvent = function () {
    var self = this;
    var networkFileList = ['adjlist', 'csv', 'edgelist', 'gexf', 'gml', 'gpickle', 'graphml', 'json', 'leda', 'yaml', 'garph6', 'net', '']
    self.upLoadFile.change(function () {
        var file = self.upLoadFile[0].files[0];
        var file_name = file.name;
        var names = [];
        names = file_name.split('.');
        var last_name = names[names.length - 1];
        last_name = last_name.toLowerCase();
        if (networkFileList.indexOf(last_name) > -1) {
            self.formDate = new FormData();
            self.formDate.append('file', file);
            self.uploadLabel.text(file_name);
        } else {
            wnatalert.alertInfo("Please Upload NetWork File Such as gml,gexf and so on.");
        }
    });
    self.uPLoadFileBtn.click(function () {
        if (self.formDate == undefined) {
            wnatalert.alertInfo("Please Upload NetWork File Such as gml,gexf and so on.");
        } else {
            wnatalert.alertOneInput({
                'title': 'Please Input NetWork Name',
                'confirmButtonText': 'Confirm',
                'cancelButtonText': 'Cancel',
                'confirmCallback': function (inputValue) {
                    self.formDate.append('network_name', inputValue);
                    wnatajax.post({
                        'url': '/analysis/upload/',
                        'data': self.formDate,
                        'processData': false,
                        //告诉jquery，这个不需要你继续处理
                        'contentType': false,
                        'success': function (result) {
                            if (result['code'] == 200) {
                                self.uploadLabel.text("Upload Network File");
                                self.formDate = undefined;
                                wnatalert.close();
                                window.location.reload();
                            } else {
                                var message = result['message'];
                                wnatalert.alertError(message);
                            }
                        }, 'fail': function (result) {
                            wnatalert.alertInfo("Please Upload NetWork File Again.");
                        }
                    });
                }
            });

        }
    })
};

TableControl.prototype.confirmClickEvent = function () {
    var self = this;
    self.confirmBtn.click(function () {
        var index = self.index;
        var state = self.lableNESelector.bootstrapSwitch('state');
        if (index == 0) {

        } else if (index == 1) {
            var singleValInput = $("#single-network-select");
            var ids = singleValInput.val();

            if (ids == '') {

            } else {
                self.ajaxGetData(ids,state);
            }
        } else if (index == 2) {

        }
    });
};

TableControl.prototype.ajaxGetData = function (value,state) {
    var self = this;
    //["5", "6", "7"]
    wnatajax.get({
        'url': '/analysis/detail/',
        'data': {
            'ids': value,
            'state':state
        },
        'success': function (result) {
            if (result['code']==200){
                var num_table = result['message']['len'];
                var cos = result['message']['columns'];
                var names = result['message']['names'];
                var das = result['data'];
                das = JSON.parse(das);
                cos = JSON.parse(cos);
                for(var i=0; i<num_table ;i++){
                    var da = das[i];
                    var co = cos[i];
                    var name = names[i];
                    var itemTableString = "#table_"+value[i] +state;
                    if($(itemTableString).length>0){
                        break;
                    }
                    self.initNewTable(value[i],names[i],state);
                    var itemTableHeadString = "#tr_"+value[i] + state;
                    var itemTr = $(itemTableHeadString);
                    for (var co_key in co){
                        var itemTh = '<th>'+ co[co_key]['data'] + '</th>';
                        itemTr.append(itemTh);
                    }
                    $(itemTableString).DataTable({
                        data: da,
                        columns: co
                    });
                }
            }
        },
        'fail': function (result) {

        }
    });
};

TableControl.prototype.initSingleSelector = function(){
    var self = this;
    self.partialSelector.change(function () {
        $(".average").text(" ");
    });
};

TableControl.prototype.initNetworkFilter = function(){
    var self = this;
    self.getAverageValue.each(function (index,obj) {
        var it = $(this);
        it.click(function () {
            var id = self.partialSelector.val();
            var type = it.parent().attr("data-type");
            self.ajaxGetStaValue(id,type);
        });
    });
};

TableControl.prototype.ajaxGetStaValue = function(id,type){
    var self = this;
    var edgeList = ['edgebetweeness'];
    if(edgeList.indexOf(type)>-1){
        var is_node = 'Link';
    }else{
        var is_node = 'Node';
    }
    wnatajax.get({
        'url': '/analysis/statistics/',
        'data':{
            'id':id,
            'type':type,
            'is_node':is_node
        },
        'success':function (result) {
            if(result['code']==200){
                console.log(result);
                var message = result['message']['average'];
                message = message.toFixed(4);
                var spanSpring = "#average" + "-" + type;
                $(spanSpring).text(message);
            }
        },'fail':function (result) {

        }
    })
};

TableControl.prototype.initNewTable = function(network_id,network_name,state){
    var self = this;
    if(state){
        //node
        var neString = ' '+'node'+ ' '+'list'
    }else {
        //edge
        var neString = ' '+'edge'+ ' ' +'list'
    }
    var tableString = '<li id="li_' + network_id + state+
                        '">'+
                        '<div class="card">'+
                            '<div class="card-header">'+
                                '<h3 class="card-title">'+
                                    network_name+neString+
                                    '<a href="javascript:void(0)" style="color: black;" id="a_' + network_id +state+
                                        '">'+
                                        '<i class="fa fa-times"></i>'+
                                    '</a>'+
                                '</h3>'+
                            '</div>'+
                            '<div class="card-body">'+
                                '<table id="table_' + network_id + state+'" class="table table-bordered table-hover">'+
                                    '<thead>' +
                                        '<tr id="tr_' + network_id+ state+'">' +
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody></tbody>'+
                                '</table>'+
                            '</div>'+
                        '</div>'+
                    '</li>';
    var item = $(tableString);
    self.tableUl.append(item);
    var aString = "#a_" + network_id + state;
    var liString = "#li_" + network_id + state;
    $(aString).click(function () {
        $(liString).remove();
    });

};

TableControl.prototype.labelNESelectorEvent = function () {
    var self = this;
    self.lableNESelector = $("input[data-bootstrap-switch]");
    self.lableNESelector.bootstrapSwitch({
        'onText': 'node',
        'offText': 'edge',
        'state': false,
        onSwitchChange: function (event, state) {
            if (state == true) {
                //node

            } else {
                //edge

            }
        }
    });
};



TableControl.prototype.initDeleteEvent = function(){
    var self = this;
    self.deleteValue.each(function (index,obj) {
        var it = $(obj);
        it.click(function () {
            var id = self.partialSelector.val();
            var type = it.parent().attr("data-type");
            self.ajaxDeleteStaValue(id,type);
        });
    })
};

TableControl.prototype.ajaxDeleteStaValue = function(id,type){
    if(type == 'edgebetweeness'){
        var is_node = 'Link';
    }else{
        var is_node = 'Node';
    }
    wnatajax.post({
        'url':'/analysis/deletefiled/',
        'data':{
            'id':id,
            'type':type,
            'is_node':is_node
        },'success':function (result) {
            if(result['code']==200){
                console.log(result);
                $("#average-" + type).text("Deleted");
            }
        },'fail':function (result) {

        }
    })
};

TableControl.prototype.initDeleteGraph = function(){
    var self = this;
    self.deleteGraphButton.click(function () {
        var it = $(this);
        var id = it.attr("networkId");
        wnatajax.post({
            'url':"/analysis/deletegraph/",
            "data":{
                "id":id
            },"success":function (result) {
                if(result['code']==200){
                    window.location.reload();
                }
            },"fail":function (result) {

            }
        })
    });
};

TableControl.prototype.run = function () {
    var self = this;
    self.TabClickEvent();
    self.initUpLoadEvent();
    self.labelNESelectorEvent();
    self.confirmClickEvent();
    self.initNetworkFilter();
    self.initSingleSelector();
    self.initDeleteEvent();
    self.initDeleteGraph();
};


function Generate() {
    this.generateGate = $("#generate-gate");
    this.generateBox = $(".generate-network-pop-box");
    this.generateTypeSelector = $("#generate-type-select");
    this.kindSelector = $("#kind-select");
    this.generateKindSelector = $("#generate-kind-select");
    this.input1 = $("#input-1");
    this.input2 = $("#input-2");
    this.submitButton = $("#generate-submit-btn");
    this.networkName = $("#network-name");
    this.clearButton = $("#clear-button");
}

Generate.prototype.initGate = function () {
    var self = this;
    self.generateGate.click(function () {
        var it = $(this);
        var is_slider = it.attr("data-slide");
        if (is_slider === "false") {
            //没有打开
            self.generateBox.animate({"right": 0}, 500);
            it.attr("data-slide", "true");
            // .animate({"left":-798*this.index},500);
        } else {
            self.generateBox.animate({"right": -382.72}, 500);
            it.attr("data-slide", "false");
        }
    })
};

Generate.prototype.run = function () {
    var self = this;
    self.initGate();
    self.initGenerateSelector();
    self.initSubmitEvent();
};


Generate.prototype.initGenerateSelector = function(){
    var self = this;
    self.generateTypeSelector.change(function () {
        var it = $(this);
        var value = it.val();
        switch (value) {
            case "Atlas":{
                var list = ["Atlas"];
                 self.pushSelector(self.generateKindSelector,list);
                self.kindSelector.show();
                self.input1.attr("placeholder","graph number in Atlas");
                self.input1.show();
                self.input2.hide();
                break;
            }
            case "Classic":{
                self.kindSelector.show();
                var list = ["balanced_tree","complete_graph","binomial_tree","complete_graph",
                "circular_ladder_graph","full_rary_tree","ladder_graph","lollipop_graph",
                    "path_graph","star_graph","turan_graph","wheel_graph"
                ];
                // self.pushSelector(self.generateKindSelector, list);
                self.pushSelector(self.generateKindSelector,list);
                self.input1.show();
                self.input2.show();
                self.input1.attr("placeholder","each node will have r children");
                self.input2.attr("placeholder","Height of the tree.");
                break;
            }
            case "Lattice":{
                var list = ["grid_2d_graph","hexagonal_lattice_graph","triangular_lattice_graph"];
                self.pushSelector(self.generateKindSelector,list);
                self.kindSelector.show();
                self.input1.show();
                self.input2.show();
                self.input1.attr("placeholder","2d grid width");
                self.input2.attr("placeholder","2d grid length");
                break;
            }
            case "Small":{
                var list = ["bull_graph","chvatal_graph","cubical_graph","desargues_graph",
                "diamond_graph","dodecahedral_graph","frucht_graph","heawood_graph","house_graph","house_x_graph",
                "hoffman_singleton_graph","icosahedral_graph","krackhardt_kite_graph","moebius_kantor_graph",
                "octahedral_graph","petersen_graph","sedgewick_maze_graph","tetrahedral_graph","truncated_tetrahedron_graph",
                "tutte_graph"];
                self.pushSelector(self.generateKindSelector,list);
                self.kindSelector.show();
                self.input1.hide();
                self.input2.hide();
                break;
            }
            case "Random":{
                var list = ["erdos_renyi_graph","small_world_graph","connected_small_world_graph","random_regular_graph",
                    "barabasi_albert_graph","powerlaw_cluster_graph","random_lobster"];
                self.kindSelector.show();
                self.pushSelector(self.generateKindSelector,list);
                self.input1.show();
                self.input2.show();
                self.input1.attr("placeholder","node number");
                self.input2.attr("placeholder","Probability for edge creation.");
                break;
            }
            case "Directed":{
                // gnr_graph scale_free_graph
                var list = ["gnr_graph","scale_free_graph"];
                self.kindSelector.show();
                self.pushSelector(self.generateKindSelector,list);
                self.input1.show();
                self.input2.show();
                self.input1.attr("placeholder","The number of nodes for the generated graph");
                self.input2.attr("placeholder","The redirection probability");
                break;
            }
            case "Geometric":{
                var list = ["random_geometric_graph","waxman_graph"];
                self.kindSelector.show();
                self.pushSelector(self.generateKindSelector,list);
                self.input1.show();
                self.input2.show();
                self.input1.attr("placeholder","Number of nodes");
                self.input2.attr("placeholder","Distance threshold value");
                break;
            }
            case "AS":{
                var list = ["random_internet_as_graph"];
                self.kindSelector.show();
                self.pushSelector(self.generateKindSelector,list);
                self.input1.show();
                self.input2.hide();
                self.input1.attr("placeholder","Number of nodes");
                break;
            }
            case "Social":{
                var list = ["karate_club_graph","davis_southern_women_graph","florentine_families_graph","les_miserables_graph"];
                self.kindSelector.show();
                self.pushSelector(self.generateKindSelector,list);
                self.input1.hide();
                self.input2.hide();
                break;
            }
            case "Community":{
                var list = ["caveman_graph","connected_caveman_graph","ring_of_cliques","windmill_graph"];
                self.kindSelector.show();
                self.pushSelector(self.generateKindSelector,list);
                self.input1.show();
                self.input2.show();
                self.input1.attr("placeholder","Number of cliques");
                self.input2.attr("placeholder","Size of cliques");
                break;
            }
            case "Trees":{
                var list = ["random_tree"];
                self.kindSelector.show();
                self.pushSelector(self.generateKindSelector,list);
                self.input1.show();
                self.input2.hide();
                self.input1.attr("placeholder","A positive integer representing the number of nodes in the tree");
                break;
            }
            case "Cographs":{
                var list = ["random_cograph"];
                self.kindSelector.show();
                self.pushSelector(self.generateKindSelector,list);
                self.input1.show();
                self.input2.hide();
                self.input1.attr("placeholder","The order of the cograph");
                break;
            }
            default:{
                break;
            }
        }
    });
    self.generateKindSelector.change(function () {
        var value = self.generateTypeSelector.val();
        self.input1.val("");
        self.input2.val("");
        var itValue = $(this).val();
        $("#input-3-box").remove();
        switch (value) {
            case "Atlas":{
                // self.kindSelector.hide();
                // self.input1.attr("placeholder","graph number in Atlas");
                // self.input1.show();
                // self.input2.hide();
                break;
            }
            case "Classic":{
                switch (itValue) {
                    case "balanced_tree":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","each node will have r children");
                        self.input2.attr("placeholder","Height of the tree.");
                        break ;
                    }case "complete_graph":{
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder","The number of node");
                        break;
                    }case "binomial_tree":{
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder"," Order of the binomial tree.");
                        break;
                    }case "circular_ladder_graph":{
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder"," Ladder length.");
                        break;
                    }case "full_rary_tree":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","branching factor of the tree");
                        self.input2.attr("placeholder","Number of nodes in the tree");
                        break;
                    }case "ladder_graph":{
                        // the Ladder graph of length n.
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder","The Length of the Ladder");
                        break;
                    }case "lollipop_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The circle of lollipop");
                        self.input2.attr("placeholder","The path of lollipop");
                        break;
                    }case "path_graph":{
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder","The Length of the path");
                        break;
                    }case "star_graph":{
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder","The Length of the star outer");
                        break;
                    }case "turan_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The number of vertices.");
                        self.input2.attr("placeholder","The number of partitions. Must be less than or equal to n");
                        break;
                    }case "wheel_graph":{
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder","The Length of the wheel");
                        break;
                    }default:{
                        break;
                    }
                }
                break;
            }
            case "Lattice":{
                switch (itValue) {
                    case "grid_2d_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","2d grid width");
                        self.input2.attr("placeholder","2d grid length");
                        break;
                    }
                    case "hexagonal_lattice_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The number of rows of hexagons in the lattice.");
                        self.input2.attr("placeholder","The number of columns of hexagons in the lattice.");
                        break;
                    }case "triangular_lattice_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The number of rows in the lattice.");
                        self.input2.attr("placeholder","The number of columns in the lattice");
                        break;
                    }
                }
                break;
            }
            case "Small":{
                self.input1.hide();
                self.input2.hide();
                break;
            }
            case "Random":{
                switch (itValue) {
                    case "erdos_renyi_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The number of nodes.");
                        self.input2.attr("placeholder","Probability for edge creation");
                        break;
                    }case "small_world_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The number of nodes.");
                        self.input2.attr("placeholder","Each node is joined with its k nearest neighbors in a ring topology");
                        var appendSpring = "<div class='form-group' id='input-3-box'>" +
                            "<input type='text'class='form-control' id='input-3' placeholder='The probability of rewiring each edge'>" +
                            "</div>";
                        $("#generate-card-body").append($(appendSpring));
                        break;
                    }case "connected_small_world_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The number of nodes.");
                        self.input2.attr("placeholder","Each node is joined with its k nearest neighbors in a ring topology");
                        var appendSpring = "<div class='form-group' id='input-3-box'>" +
                            "<input type='text'class='form-control' id='input-3' placeholder='The probability of rewiring each edge'>" +
                            "</div>";
                        $("#generate-card-body").append($(appendSpring));
                        break;
                    }case "random_regular_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The degree of each node.");
                        self.input2.attr("placeholder","The number of nodes");
                        break;
                    }case "barabasi_albert_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","Number of nodes");
                        self.input2.attr("placeholder","Number of edges to attach from a new node to existing nodes");
                        break;
                    }case "powerlaw_cluster_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The number of nodes.");
                        self.input2.attr("placeholder","the number of random edges to add for each new node");
                        var appendSpring = "<div class='form-group' id='input-3-box'>" +
                            "<input type='text'class='form-control' id='input-3' placeholder='Probability of adding a triangle after adding a random edge'>" +
                            "</div>";
                        $("#generate-card-body").append($(appendSpring));
                        break;
                    }case "random_lobster":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The expected number of nodes in the backbone");
                        self.input2.attr("placeholder","Probability of adding an edge to the backbone");
                        var appendSpring = "<div class='form-group' id='input-3-box'>" +
                            "<input type='text'class='form-control' id='input-3' placeholder='Probability of adding an edge one level beyond backbone'>" +
                            "</div>";
                        $("#generate-card-body").append($(appendSpring));
                        break;
                    }
                }
                break;
            }
            case "Directed":{
                switch (itValue) {
                    case "gnr_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","The number of nodes for the generated graph");
                        self.input2.attr("placeholder","The redirection probability");
                        break;
                    }case "scale_free_graph":{
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder","The number of nodes for the generated graph");
                       break;
                    }
                }
                break;
            }
            case "Geometric":{
                switch (itValue) {
                    case "random_geometric_graph":{
                        self.input1.show();
                        self.input2.show();
                        self.input1.attr("placeholder","Number of nodes");
                        self.input2.attr("placeholder","Distance threshold value");
                        break;
                    }case "waxman_graph":{
                        self.input1.show();
                        self.input2.hide();
                        self.input1.attr("placeholder","Number of nodes");
                       break;
                    }
                }
                break;
            }
            case "AS":{
                self.input1.show();
                self.input2.hide();
                self.input1.attr("placeholder","Number of nodes");
                break;
            }
            case "Social":{
                self.input1.hide();
                self.input2.hide();
                break;
            }
            case "Community":{
                self.input1.show();
                self.input2.show();
                self.input1.attr("placeholder","Number of cliques");
                self.input2.attr("placeholder","Size of cliques");
                break;
            }
            case "Trees":{
                self.input1.show();
                self.input2.hide();
                self.input1.attr("placeholder","A positive integer representing the number of nodes in the tree");
                break;
            }
            case "Cographs":{
                self.input1.show();
                self.input2.hide();
                self.input1.attr("placeholder","The order of the cograph");
                break;
            }
            default:{
                break;
            }
        }
    });
    self.generateTypeSelector.change();
};
Generate.prototype.initSubmitEvent = function(){
    var self = this;
    self.submitButton.click(function () {
        var name = self.networkName.val();
        var type = self.generateTypeSelector.val();
        var kind = self.generateKindSelector.val();
        var val1 = self.input1.val();
        var val2 = self.input2.val();
        var val3 = $("#input-3").val();
        var data =[];

        if (name!=""){
            data.push(name);
        }else{
            return;
        }
        data.push(type);
        data.push(kind);

        if(self.input1.is(":visible")){
            if(val1!=""&&(!isNaN(val1))){
                data.push(val1);
            }else{
                return;
            }
        }

        if(self.input2.is(":visible")){
            if(val2!=""&&(!isNaN(val2))){
                data.push(val2);
            }else{
                return;
            }
        }

        if(val3!=undefined){
            if(val3!=""&&(!isNaN(val3))){
                data.push(val3);
            }else{
                return;
            }
        }
        var infos = data.join("^");
        wnatajax.post({
            'url':'/generate/main/',
            'data':{
                'data':infos
            },'success':function (result) {
                if(result['code']==200){
                    window.location.reload();
                }
            },'fail':function (result) {

            }
        });
    });
    self.clearButton.click(function () {
        self.networkName.val("");
        self.input1.val("");
        self.input2.val("");
        self.input2.hide();
        self.input1.show();
         var list = ["Atlas"];
         self.generateTypeSelector.val("Atlas");
         self.pushSelector(self.generateKindSelector,list);
         self.input1.attr("placeholder","graph number in Atlas");
    });
};
Generate.prototype.pushSelector = function(selector,array){
    var self = this;
    selector.empty();
    for(var key in array){
        var temp = array[key];
        var value = "<option value=" + temp +">" + temp +"</option>";
        selector.append($(value));
    }
};
$(function () {
    var tableControl = new TableControl();
    var generate = new Generate();
    tableControl.run();
    generate.run();
});