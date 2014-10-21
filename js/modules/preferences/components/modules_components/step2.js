define([
    // libs
    'morearty',
    // components
    // mixins
    '../../mixins/base_mixin',
    'mixins/data/data-layer',
    'mixins/sync/sync-layer'
], function (
    // libs
    Morearty,
    // components
    _base_search,
    // mixins
    base_mixin,
    data_layer_mixin,
    sync_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin, data_layer_mixin, sync_layer_mixin],
        componentWllMount: function () {
            if (this.isMounted()) {
                if (this.getDefaultBinding().val('import_instanceId') !== null) {
                    this.getDefaultBinding().set('import_instanceId', null)
                }
            }
        },
        render: function () {
            var _ = React.DOM,
                that = this,
                cx = React.addons.classSet,
                preferences_binding = this.getDefaultBinding(),
                instance_binding = preferences_binding.sub('instance_temp'),
                moduleId = preferences_binding.val('moduleId'),
                module_binding = this.getModelFromCollection(moduleId, 'modules');

            return _.div({className: 'step-container'},
                _.div({ className: 'model-component' },
                    _.div({ className: 'form-data automation clearfix' },
                        _.div({key: 'form-group-title', className: 'form-group'},
                            _.label({className: 'input-label'}, 'title:'),
                            _.input({
                                key: 'title-input',
                                className: 'input-value',
                                type: 'text',
                                placeholder: 'Title',
                                value: instance_binding.val('title'),
                                onChange: Morearty.Callback.set(instance_binding, 'title')
                            })
                        ),
                        _.div({key: 'form-group-description', className: 'form-group'},
                            _.label({className: 'input-label'}, 'description:'),
                            _.textarea({
                                key: 'description-input',
                                className: 'input-value textarea-type',
                                placeholder: 'Description',
                                value: instance_binding.val('description'),
                                onChange: Morearty.Callback.set(instance_binding, 'description')
                            })
                        ),
                        _.div({key: 'form-group-moduleId', className: 'form-group inline'},
                            _.span({className: 'label-span'}, 'moduleId:'),
                            _.span({key: 'moduleId-info', className: 'span-value link'}, moduleId)
                        ),
                        _.div({ key: 'form-device-input', className: 'form-group inline' },
                            _.span({className: 'label-span'}, 'Import settings from:'),
                            _.select({
                                ref: 'selectInstance',
                                className: 'select-input',
                                onChange: this.onSelectInstance
                            },
                                _.option({
                                    defaultValue: true,
                                    value: null
                                }, 'choose instance'),
                                this.getInstanceAvailable()
                            )
                        ),
                        _.div({
                                key: 'next-button',
                                className: 'modern-button green-mode center',
                                onClick: this.onNextHandler
                            }, 'NEXT'
                        )
                    )
                )
            );
        },
        getInstanceAvailable: function () {
            var that = this,
                _ = React.DOM,
                preferences_binding = this.getDefaultBinding(),
                moduleId = preferences_binding.val('moduleId'),
                instances_binding = that.getBinding('data').sub('instances'),
                filter_instances = instances_binding.val().filter(function (instance) {
                    return instance.get('moduleId') === moduleId;
                });


            if (filter_instances.toArray().length > 0) {
                return filter_instances.map(function (instance, index) {
                    var title = (instance.get('title') || '') + '[' + instance.get('id') + ']';
                    return _.option({key: 'instance-' + index, value: instance.get('id')}, title);
                }).toArray();
            } else {
                return null;
            }

        },
        onSelectInstance: function () {
            var instanceId = this.refs.selectInstance.getDOMNode().value;
            if (String(instanceId) === 'null') {
                this.getDefaultBinding().set('import_instanceId', null);
            } else {
                this.getDefaultBinding().set('import_instanceId', parseInt(instanceId));
            }
            return false;
        },
        onNextHandler: function () {
            this.getDefaultBinding().set('step', 3);
            return false;
        }
    });
});
