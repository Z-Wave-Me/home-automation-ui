define([
    // components
    './common/_base_search',
    './common/_buttons_group',
    './models/instance',
    // mixins
    '../mixins/base_mixin',
    'mixins/data/data-layer',
    'mixins/sync/sync-layer',
    'alpaca'
], function (
    // components
    _base_search,
    _buttons_group,
    Instance,
    // mixins
    base_mixin,
    data_layer_mixin,
    sync_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin, data_layer_mixin, sync_layer_mixin],
        componentWillMount: function () {
            var preferences_binding = this.getBinding('preferences');

            preferences_binding.atomically()
                .set('show_turned_off', true)
                .set('search_string_on_instance_page', '')
                .set('hover_instance_id', null)
                .set('select_instance_id', null)
                .commit();
        },
        componentWillUnmount: function () {
            var preferences_binding = this.getBinding('preferences');
            preferences_binding.atomically()
                .delete('show_turned_off')
                .delete('search_string_on_instance_page')
                .delete('hover_instance_id')
                .delete('select_instance_id')
                .commit();
        },
        render: function () {
            var _ = React.DOM,
                that = this,
                data_binding = this.getBinding('data'),
                instances_binding = data_binding.sub('instances'),
                preferences_binding = this.getBinding('preferences');

            return _.div({ className: 'automation-component' },
                _.div({className: 'header-component'},
                    _.div({className: 'pull-left'},
                        _.div({ key: 'form-instance-show-turned-off-container', className: 'form-group' },
                            _.label({className: 'switch-container'},
                                Morearty.DOM.input({
                                        className: 'ios-switch',
                                        type: 'checkbox',
                                        checked: preferences_binding.get('show_turned_off'),
                                        onChange: this.onShowTurnedOffHandler
                                    },
                                    _.div({},
                                        _.div({className: 'bubble-switch'})
                                    )
                                ),
                                'Show turned off'
                            )
                        )
                    ),
                    _.div({className: 'pull-right'},
                        _base_search({
                            binding: {
                                default: preferences_binding
                            },
                            search_attr: preferences_binding.sub('search_string_on_instance_page')
                        })
                    )
                ),
                _.ul({className: 'instances-list clearfix'},
                    instances_binding.get().map(function (inst, index) {
                        return that.isShown(inst) ? Instance({binding: {
                            default: instances_binding.sub(index),
                            preferences: preferences_binding,
                            data: data_binding
                        }}) : null;
                    }).toArray()
                )
            );
        },
        onToggleHoverItemList: function (id) {
            this.getBinding('preferences').set('hover_instance_id', id);
        },
        onToggleSelectItemList: function (id) {
            var that = this,
                selected = that.getBinding('preferences').get('select_instance_id') === id;

            that.getBinding('preferences').set('select_instance_id', selected ? null : id);

            if (!selected) {
                that.forceUpdate(function () {
                    that.fetch({
                        serviceId: 'namespaces',
                        success: function (response) {
                            that.getBinding('data').set('namespaces', Immutable.fromJS(response.data));
                            that.renderAlpaca(id);
                        }
                    });
                });
            }
        },
        onShowTurnedOffHandler: function (event) {
            this.getBinding('preferences').set('show_turned_off', event.target.checked);
            event.preventDefault();
        },
        isShown: function (instance) {
            var module_id = instance.get('moduleId'),
                search_string = this.getBinding('preferences').get('search_string_on_instance_page'),
                module = this.getModelFromCollection(module_id, 'modules'),
                show_turned_off = this.getBinding('preferences').get('show_turned_off'),
                title = instance.get('title') || '';

            if (search_string.length > 1) {
                return (title.toLowerCase().indexOf(search_string) !== -1 ||
                    module.sub('defaults').get('title').toLowerCase().indexOf(search_string) !== -1);
            } else {
                if (show_turned_off || (!show_turned_off && instance.get('active'))) {
                    return true;
                }
            }
        }
    });
});
