Graph.prototype.toastsInfo = function (title, subtitle, body) {
    $(document).Toasts('create', {
        class: 'bg-success',
        title: title,
        subtitle: subtitle,
        position: 'topRight',
        body: body
    });
};