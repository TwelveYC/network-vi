
//鼠标点击事件初始化
Graph.prototype.initTapEvent = function () {
    var self = this;
    var click_element = $("#single-element-data");
    var total_element = $("#total-elements-data");
    total_element.text("nodes:" + self.cy.nodes().size()/2 + ",edges:" + self.cy.edges().size());
    self.cy.on('tap', 'node', function (evt) {
        var node = evt.target;
        var is_edit = $('input[name="editCheckBox"]:checked');
        var is_all_graph = $("input[name='entireCheckBox']:checked");
        var is_all = is_all_graph.val();
        var is_edit_value = is_edit.val();
        var is_edit_single_dot = is_edit_value=="on" && is_all == undefined;
        if(self.is_recombination_network()){
            if(node.isChild()){
                if(is_edit_single_dot){
                    self.editNodeStyle(node);
                    self.editTagStyle(node);
                }else{
                    click_element.text("Type:node," + "id:" + node.id() + "," + "degree:" + node.degree());
                }
            }else{
                return;
            }
        }else{
            if(is_edit_single_dot){
                self.editNodeStyle(node);
            }else{
                click_element.text("Type:node," + "id:" + node.id() + "," + "degree:" + node.degree());
            }
        }
    });
    self.cy.on('tap', 'edge', function (evt) {
        var edge = evt.target;
        var is_edit = $('input[name="editCheckBox"]:checked');
        var is_all_graph = $("input[name='entireCheckBox']:checked");
        var is_all = is_all_graph.val();
        var is_edit_value = is_edit.val();
        var is_edit_single_dot = is_edit_value=="on" && is_all == undefined;
        if(is_edit_single_dot){
            self.editEdgeStyle(edge);
        }else{
            click_element.text("Type:edge," + "id:" + edge.id() + "," + "source:" + edge.data('source') + "," + "target:" + edge.data('target'));
        }
    });
    self.isChoose = false;
    self.cy.dblclick();
    self.cy.on('dblclick','node',function (evt) {
        var target = evt.target;
        var is_edit = $('input[name="editCheckBox"]:checked');
        var is_edit_value = is_edit.val();
        if(is_edit_value){
            var neighborhood = target.neighborhood();
            if(self.is_recombination_network()){
                var nodes = neighborhood.filter(":child");
                self.editTagStyle(nodes);
            }else{
                var nodes = neighborhood.filter("node");
            }
            var edges = neighborhood.filter("edge");
            self.editNodeStyle(nodes);
            self.editEdgeStyle(edges);
        }else{
            if(target.isParent()){
                return;
            }
            var nodes = self.cy.nodes();
            var edges = self.cy.edges();
            var eles = nodes.union(edges);
            if(!self.isChoose){
                self.sourceNode = target;
                self.isChoose = true;
            }else{
                if(self.sourceNode==target){
                    // target.removeListener('mouseover');
                    // var neighborhood = target.neighborhood();
                    // self.isChoose = false;
                    // var second_neighborhoos = neighborhood.neighborhood();
                    // var nei = neighborhood.union(second_neighborhoos);
                    // nei = nei.union(target);
                    // var no_nei = eles.difference(nei);
                    // no_nei.style('opacity',0.1)
                }else{
                    // eles.style('line-color', '');
                    self.targetNode = target;
                    self.isChoose = false;
                    var dijkstra = self.cy.elements().dijkstra(self.sourceNode, function(edge){
                        return 1;
                    });
                    var path = dijkstra.pathTo(self.targetNode);
                    path = path.filter("edge");
                    path.style('line-color', self.color);
                    path.style('z-index', 10);
                    path.style('width', 20);
                    self.path = path;
                }
            }
        }
    });
};

Graph.prototype.initMouseOverEvent = function () {
    var self = this;
    self.cy.on('mouseover', 'node', function (evt) {
        var is_edit = $('input[name="editCheckBox"]:checked');
        var is_edit_value = is_edit.val();
        if(is_edit_value){

        }else{
              var node = evt.target;
            if (self.is_recombination_network()){
                if(node.isChild()){
                     var eles = self.cy.filter(":child").union(self.cy.edges());
                }else{
                    return
                }
            }else{
                var nodes = self.cy.nodes();
                var edges = self.cy.edges();
                var eles = nodes.union(edges);
            }
            var neighborhood = node.neighborhood();
            neighborhood = neighborhood.union(node);
            var no_neighborhood = eles.difference(neighborhood);
            no_neighborhood.style('opacity', 0.1);
        }
    });
    self.cy.on('mouseout', 'node', function (evt) {
        var is_edit = $('input[name="editCheckBox"]:checked');
        var is_edit_value = is_edit.val();
        if(is_edit_value){
        }else{
            var node = evt.target;
            var neighborhood = node.neighborhood();
            neighborhood = neighborhood.union(node);
            var nodes = self.cy.nodes();
            var edges = self.cy.edges();
            var eles = nodes.union(edges);
            var no_neighborhood = eles.difference(neighborhood);
            no_neighborhood.style('opacity', 1);
        }
    });
};

Graph.prototype.mouseRightClick = function () {
    var self = this;
    self.cy.on('cxttap','node',function (evt) {
        var target = evt.target;
        target.style("width",'');
        target.style("height",'');
        target.style("shape",'ellipse');
        target.style("background-color","");
        target.style("border-width",0);
        target.style("opacity",1);
        if(self.is_recombination_network()){
            var parent = target.parent();
            parent.style("border-width",0);
            parent.style("background-color","");
        }
    });
    self.cy.on("cxttap","edge",function (evt) {
        var target = evt.target;
            target.style("width",10);
            target.style("line-color","");
            target.style("line-style","solid");
    });
};



