define([
    'alpaca',
    // components
    '../common/_buttons_group',
    '../common/_inline_input',
    // mixins
    '../../mixins/base_mixin',
    'mixins/data/data-layer'
], function (
    Alpaca,
    // components
    _buttons_group,
    _inline_input,
    // mixins
    base_mixin,
    data_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin, data_layer_mixin, TranslateMixin],
        componentDidMount: function () {
            this.renderAlpaca(this.getBinding('preferences').get('leftPanelItemSelectedId'));
        },
        componentWillMount: function () {
            var that = this;

            that.listenerId = that.getBinding('preferences').addListener('leftPanelItemSelectedId', function (leftPanelItemSelectedId) {
                if (that.isMounted()) {
                    that.renderAlpaca(leftPanelItemSelectedId);
                    that.forceUpdate();
                }
            });
        },
        componentWillUnmount: function () {
            if (this.listenerId) {
                this.getBinding('preferences').removeListener(this.listenerId);
            }
        },
        renderAlpaca: function (instanceId) {
            var that = this,
                instanceJson,
                module,
                moduleJson,
                $el,
                instance = that.getModelFromCollection(instanceId, 'instances');

            if (!instance || !instanceId) {
                return;
            }

            instanceJson = instance.get().toJS();
            module = that.getModelFromCollection(instanceJson.moduleId, 'modules');
            moduleJson = module.get().toJS();
            $el = $(that.refs.alpacaNodeRef.getDOMNode());

            $el.empty().alpaca({
                data: that.updateObjectAsNamespace(instanceJson.params),
                schema: that.updateObjectAsNamespace(moduleJson.schema),
                options: that.updateObjectAsNamespace(moduleJson.options),
                postRender: function (form) {
                    form.on("validated", function (e) {
                        var json = form.getValue();
                        instance.set('params', json);
                    });
                }
            });
        },
        onStatusModuleHandler: function (event) {
            var instanceId = this.getBinding('preferences').get('leftPanelItemSelectedId'),
                instance = this.getModelFromCollection(instanceId, 'instances');

            instance.set('active', event.target.checked);

            this.forceUpdate();
            return false;
        },
        render: function () {
            var that = this,
                _ = React.DOM,
                __ = this.gls,
                instanceId = this.getBinding('preferences').get('leftPanelItemSelectedId'),
                data_binding = that.getBinding('data'),
                preferencesBinding = that.getBinding('preferences'),
                item_binding = this.getModelFromCollection(instanceId, 'instances'),
                add_mode = preferencesBinding.get('activeNodeTreeStatus') === 'add';

            return _.div({ className: 'model-component' },
                _.div({ className: 'form-data automation clearfix' },
                    _.div({ key: 'alpaca-container-key', className: 'form-group' },
                        _.div({ key: 'alpacaNode', id: 'alpaca-main', className: 'alpaca-main', ref: 'alpacaNodeRef'})
                    ),
                    !add_mode ? _.div({ key: 'form-default-profile-input', className: 'form-group' },
                        _.label({className: 'switch-container'},
                            Morearty.DOM.input({
                                    className: 'ios-switch green',
                                    type: 'checkbox',
                                    checked: item_binding.get('active'),
                                    onChange: that.onStatusModuleHandler
                                },
                                _.div({},
                                    _.div({className: 'bubble-switch'})
                                )
                            ),
                            __('on', 'capitalize'), '/', __('off', 'capitalize')
                        )
                    ) : null,
                    _buttons_group({
                        binding: {
                            default: preferencesBinding,
                            item: item_binding,
                            items: data_binding.sub('instances')
                        },
                        serviceId: this.props.serviceId
                    })
                )
            );
        }
    });
});
