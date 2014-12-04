define([
    // mixins
    '../../mixins/base_mixin',
    'mixins/sync/sync-layer',
    'mixins/data/data-layer'
], function (
    // mixins
    base_mixin,
    sync_layer_mixin,
    data_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin, sync_layer_mixin, data_layer_mixin, TranslateMixin],
        displayName: '_buttons_group',
        getInitialState: function () {
            return { loading: false };
        },
        saveHandler: function () {
            var that = this,
                item = this.getBinding('item'),
                items = this.getBinding('items');

            if (this.isMounted()) {
                this.setState({ loading: true });
            }

            that.save({
                model: item,
                collection: items,
                serviceId: this.props.serviceId,
                success: function (model, response) {
                    var index = that._getIndexModelFromCollection(response.id, that.props.serviceId);

                    if (index === -1) {
                        that._addModel(response, that.props.serviceId);
                        that.setLeftPanelItemSelectedId(model.get('id'));
                    } else {
                        that._updateModel(response, that.props.serviceId);
                    }

                    that.setActiveNodeTreeStatus('normal');

                    if (that.isMounted()) {
                        that.setState({ loading: false });
                    }
                }
            });

            return false;
        },
        removeHandler: function () {
            var that = this,
                item = that.getBinding('item'),
                items = that.getBinding('items'),
                index = items.get().indexOf(item.get()),
                selected_index;

            if (index > 0) {
                selected_index = index - 1;
            } else if (items.get().length === 1) {
                selected_index = null;
            } else {
                selected_index = index + 1;
            }

            that.remove({
                model: that.getBinding('item'),
                collection: that.getBinding('items'),
                serviceId: that.props.serviceId,
                success: function () {
                    that.getBinding('item').delete();
                    if (that.isMounted()) {
                        if (selected_index !== null) {
                            that.setLeftPanelItemSelectedId(items.sub(selected_index).get('id'));
                            that.setActiveNodeTreeStatus('normal');
                        } else {
                            that.setActiveNodeTreeStatus('empty');
                        }

                        that.setState({ loading: false });
                        that.forceUpdate();
                    }
                }
            });
        },
        getButtons: function () {
            var _ = React.DOM,
                __ = this.gls,
                binding = this.getDefaultBinding();

            if (binding.get('activeNodeTreeStatus') === 'add') {
                return [
                    _.div({
                        key: 'save-button',
                        className: 'modern-button green-mode center',
                        onClick: this.saveHandler }, __('create', 'upper'),
                        this.state.loading ? _.div({ className: 'spinner' }) : null
                    ),
                    _.div({
                        key: 'cancel-button',
                        className: 'modern-button light-mode center',
                        onClick: this.setActiveNodeTreeStatus.bind(null, 'normal')
                    }, __('cancel', 'upper'))
                ];
            } else if (binding.get('activeNodeTreeStatus') === 'pending') {
                return [
                    _.div({
                        key: 'yes-button',
                        className: 'modern-button red-mode center',
                        onClick: this.removeHandler
                    }, __('yes', 'upper')),
                    _.div({
                        key: 'cancel-button',
                        className: 'modern-button light-mode center',
                        onClick: this.setActiveNodeTreeStatus.bind(null, 'normal')
                    }, __('no', 'upper'))
                ];
            } else {
                return [
                    _.div({
                        key: 'save-button',
                        className: 'modern-button green-mode center',
                        onClick: this.saveHandler
                    }, __('save', 'upper'),
                        this.state.loading ? _.div({ className: 'spinner' }) : null
                    ),
                    _.div({
                        key: 'delete-button',
                        className: 'modern-button red-mode center',
                        onClick: this.setActiveNodeTreeStatus.bind(null, 'pending')
                    }, __('delete', 'upper'))
                ];
            }
        },
        render: function () {
            var _ = React.DOM;

            return _.div({ className: 'buttons-group'},
                this.getButtons()
            );
        }
    });
});
