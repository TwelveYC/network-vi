//当修改了ON和OFF的时候，对select的修改
//label对边和点的选择之后，对备选框的初始化
Graph.prototype.initLableNESelector = function () {
    var self = this;
    self.lableNESelector = $("input[data-bootstrap-switch]");
    self.lableNESelector.bootstrapSwitch({
        'onText': 'edge',
        'offText': 'node',
        'state': false,
        onSwitchChange: function (event, state) {

            if (state == true) {
                //edge
                self.initNodeEdgeLableOption(2);
            } else {
                //node
                self.initNodeEdgeLableOption(1);
            }
        }
    });
};
//点击change之后
Graph.prototype.initLableSubmitEvent = function () {
    var self = this;

    self.labelSubmitButton.click(function () {
        event.preventDefault();
        var state = self.lableNESelector.bootstrapSwitch('state');
        var label = self.labelSelector.val();

        //ture是边
        if (label == "detele") {
            var stringStylesheet = '';
            $("#display-label").text("");
        } else {
            var stringStylesheet = 'data(' + label + ')';
            $("#display-label").text(label);
        }
        //构成这个样子：'label':'data(id)'
        if (state == true) {
            self.cy.style().selector('edge').style({'label': stringStylesheet}).update();
        } else {

            if(self.is_recombination_network()){
                self.cy.style().selector(':child').style({'label': stringStylesheet}).update();
            }else{
                self.cy.style().selector('node').style({'label': stringStylesheet}).update();
            }
        }
    });
};

//对标签的选择的获取标签
Graph.prototype.initNodeEdgeLableOption = function (isNodeorEdge) {
    var self = this;
    var lists = ['detele'];
    if (isNodeorEdge == 1) {
        var data = self.node_key;
    } else {
        var data = self.edge_key;
    }

    for (key in data) {
        lists.push(data[key]);
    }
    var selector = self.labelSelector;
    selector.empty();
    self.initOptions(selector, lists);
};