define([
    // mixins
    '../../mixins/base_mixin'
], function (
    // mixins
    base_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin],
        componentDidMount: function () {
            var selectedId = this.getBinding('preferences').get('leftPanelItemSelectedId');

            if (this.isMounted()) {
                if (selectedId && this.refs['listSelected_' + selectedId] !== undefined) {
                    this.refs['listSelected_' + selectedId].getDOMNode().click();
                } else {
                    if (this.refs.leftPanelList.getDOMNode().firstChild) {
                        this.refs.leftPanelList.getDOMNode().firstChild.click();
                    }
                }
            }
        },
        componentWillMount: function () {
            var that = this;
            that.getBinding('preferences').addListener('searchStringLeftPanel', function () {
                if (that.isMounted()) {
                    that.forceUpdate();
                }
            });
        },
        setActiveLeftPanelItemSelectedId: function (id) {
            this.getBinding('preferences').set('leftPanelItemSelectedId', id);
            this.setActiveNodeTreeStatus('normal');
        },
        getModels: function () {
            var that = this,
                _ = React.DOM,
                preferencesBinding = this.getBinding('preferences'),
                dataBinding = this.getBinding('data'),
                activeNode = this.getActiveNodeTree()[0],
                itemsBinding,
                renderModel;


            renderModel = function (item, index) {
                var searchString = preferencesBinding.get('searchStringLeftPanel').toLowerCase(),
                    leftPanelItemSelectedId = preferencesBinding.get('leftPanelItemSelectedId'),
                    statusNode = preferencesBinding.get('activeNodeTreeStatus'),
                    title,
                    obj = item.toJS();

                if (activeNode.options.serviceId === 'locations') {
                    title = obj.title;
                } else if (activeNode.options.serviceId === 'profiles') {
                    title = obj.name;
                } else if (activeNode.options.serviceId === 'devices') {
                    title = obj.metrics.title;
                } else if (activeNode.options.serviceId === 'instances') {
                    title = obj.params.title;
                }

                if ((searchString.length > 1 && title.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) || searchString.length < 2) {
                    return _.li({
                            className: leftPanelItemSelectedId === item.get('id') && statusNode !== 'add' ? 'item-model selected' : 'item-model',
                            key: index,
                            ref: 'listSelected_' + item.get('id'),
                            onClick: that.setActiveLeftPanelItemSelectedId.bind(null, item.get('id'))
                        },
                        _.span({ className: 'title-item'}, title)
                    );
                } else {
                    return null;
                }

            };

            itemsBinding = dataBinding.sub(activeNode.options.serviceId);

            return _.div({className: 'left-panel-list-container'},
                _.ul({ ref: 'leftPanelList', className: 'left-panel-list' },
                    itemsBinding.get().map(renderModel).toArray()
                )
            );
        },
        render: function () {
            return this.getModels();
        }
    });
});
