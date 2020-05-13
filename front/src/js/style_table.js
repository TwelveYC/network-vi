Graph.prototype.tableControl = function () {
    var self = this;
    self.openTable.click(function () {
        var it = $(this);
        var state = self.selectorWapper.attr("state");
        if(state=="close"){
            self.selectorWapper.animate({"right":0},500);
            self.selectorWapper.attr("state","open");
            it.children("img").attr("src","/static/images/Chevron_right.png")
        }else{
            self.selectorWapper.animate({"right":-1200},500);
            self.selectorWapper.attr("state","close");
            it.children("img").attr("src","/static/images/Chevron_left.png")
        }
    });
};