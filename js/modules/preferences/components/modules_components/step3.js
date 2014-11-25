define([
    // components
    // mixins
    '../../mixins/base_mixin',
    'mixins/data/data-layer',
    'mixins/data/manipulation',
    'mixins/sync/sync-layer',
    'alpaca'
], function (
    // components
    // mixins
    base_mixin,
    data_layer_mixin,
    javascript_mixin,
    sync_layer_mixin
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin, javascript_mixin, data_layer_mixin, sync_layer_mixin, TranslateMixin],
        getInitialState: function () {
            return {
                form: null
            };
        },
        componentWillMount: function () {
            var that = this;
            this.getBinding('data').addListener('modules', function () {
                if (that.isMounted()) {
                    that.forceUpdate(function () {
                        that.renderAlpaca();
                    });
                }
            });
        },
        componentDidMount: function () {
            if (this.isMounted()) {
                this.renderAlpaca();
            }
        },
        render: function () {
            var _ = React.DOM,
                __ = this.gls,
                preferences_binding = this.getDefaultBinding();

            return _.div({ className: 'step-container' },
                _.div({className: 'alpaca-main', ref: 'alpacaNodeRef'}),
                _.div({
                        key: 'finish-button',
                        className: 'modern-button green-mode center',
                        onClick: this.onFinishHandler
                    }, __('finish', 'case')
                )
            );
        },
        renderAlpaca: function () {
            var that = this,
                preferences_binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data'),
                instance = preferences_binding.sub('instance_temp'),
                imported_instanceId = preferences_binding.get('import_instanceId'),
                instanceJson, moduleJson, $el, import_params, imported_instance_index;

            if (!instance) {
                return;
            }

            if (!!imported_instanceId) {
                imported_instance_index = data_binding
                    .sub('instances').get()
                    .findIndex(function (instance) {
                        return instance.get('id') === imported_instanceId;
                    });

                import_params = data_binding.sub('instances.' + imported_instance_index).get('params').toJS();
            }

            instanceJson = instance.get().toJS();
            moduleJson = that.updateObjectAsNamespace(that.getOriginalModule(instanceJson.moduleId));
            $el = $(that.refs.alpacaNodeRef.getDOMNode());

            $el.empty().alpaca({
                data: moduleJson.defaults,
                schema: moduleJson.schema,
                options: moduleJson.options,
                postRender: function (form) {
                    that.form = form;
                }
            });
        },
        onFinishHandler: function () {
            var that = this,
                preferences_binding = this.getDefaultBinding(),
                instances_binding = this.getBinding('data').sub('instances'),
                instance_binding = preferences_binding.sub('instance_temp');

            if (that.form !== null) {
                instance_binding.sub('params').merge(that.form.getValue());
                that.save({
                    model: instance_binding,
                    serviceId: 'instances',
                    success: function (model, response) {
                        instances_binding.update(function (instances) {
                            return instances.push(Immutable.fromJS(response));
                        });
                        that.setActiveNode(5);
                        preferences_binding.set('select_instance_id', response.id);
                    }
                });
            }
            return false;
        }
    });
});
