/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    id: "usersList",
    name: "Users list",
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 3,
    color: "orange",
    render: function(widget,data,context,pluginUtils) {

        if (!widget.plugin.template) {
            return 'usersList: missing template';
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template);
    }
});