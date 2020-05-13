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
};




//只有选择diagram的时候才需要出现什么类型图表
Graph.prototype.initDiagramSelect = function () {
    var self = this;
    self.diagramChoose.change(function () {
        var it = $(this);
        var v = it.val();
        if (v === 'diagram') {
            $("#type-select-box").show();
        } else {
            $("#type-select-box").hide();
        }
    });
};


