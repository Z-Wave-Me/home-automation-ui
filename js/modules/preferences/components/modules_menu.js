define([
    // components
    './common/_base_search',
    './modules_components/step1',
    './modules_components/step2',
    './modules_components/step3',
    // mixins
    '../mixins/base_mixin',
    'mixins/data/data-layer',
    'mixins/sync/sync-layer'
], function (
    // components
    _base_search,
    step1,
    step2,
    step3,
    // mixins
    base_mixin,
    data_layer
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin, data_layer, TranslateMixin],
        getInitialState: function () {
            var __ = this.gls;

            return {
                steps: {
                    1: {
                        description: __('step', 'case') + ' 1: ' + __('choose_module', 'case'),
                        component: step1
                    },
                    2: {
                        description: __('step', 'case') + ' 2: ' + __('set_name', 'case'),
                        component: step2
                    },
                    3: {
                        description: __('step', 'case') + ' 3: ' + __('configuration', 'case'),
                        component: step3
                    }
                }
            };
        },
        componentWillMount: function () {
            var that = this,
                preferences_binding = this.getBinding('preferences');

            preferences_binding.atomically()
                .set('step', 1)
                .set('moduleId', null)
                .set('instance_temp', null)
                .set('expanded', Immutable.List())
                .set('search_string_on_modules_list', '')
                .commit();

            this.module_listener = preferences_binding.addListener('moduleId', function (descriptor) {
                if (descriptor.isValueChanged()) {


                    var _module = that.getModelFromCollection(preferences_binding.get('moduleId'), 'modules');

                    preferences_binding.atomically()
                        .set('instance_temp', Immutable.fromJS({
                            id: null,
                            title: _module.get('defaults.title'),
                            description: _module.get('defaults.description'),
                            moduleId: _module.get('id'),
                            active: true,
                            params: {},
                            import_instanceId: null
                        }))
                        .commit();
                }
            });
        },
        componentWillUnmount: function () {
            if (this.module_listener) {
                this.getBinding('preferences').removeListener(this.module_listener);
            }

            this.getBinding('preferences').atomically()
                .delete('step')
                .delete('moduleId')
                .delete('instance_temp')
                .delete('expanded')
                .delete('search_string_on_modules_list')
                .delete('import_instanceId')
                .commit();
        },
        render: function () {
            var _ = React.DOM,
                __ = this.gls,
                cx = React.addons.classSet,
                preferences_binding = this.getBinding('preferences'),
                step_numeric = preferences_binding.get('step'),
                step = this.state.steps[step_numeric];

            return _.div({ className: 'modules-component' },
                _.div({className: 'header-component'},

                    _.span({className: 'step-title'}, step.description),
                    _base_search({
                        search_attr: preferences_binding.sub('search_string_on_modules_list')
                    })
                ),
                _.div({className: 'footer-component'},
                    _.div({className: 'stepbar-container'},
                        _.ul({className: 'stepbar'},
                            _.li({className: step_numeric >= 1 ? 'active' : null}, __('choose_module', 'capitalize')),
                            _.li({className: step_numeric >= 2 ? 'active' : null}, __('set_name', 'capitalize')),
                            _.li({className: step_numeric === 3 ? 'active' : null}, __('configuration', 'capitalize'))
                        )
                    )
                ),
                _.div({className: 'main-component'},
                    step.component({
                        binding: {
                            default: preferences_binding,
                            data: this.getBinding('data')
                        }
                    })
                )
            );
        }
    });
});
