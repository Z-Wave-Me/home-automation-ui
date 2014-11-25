define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        onSelectLang: function () {
            var value = this.refs.selectInstance.getDOMNode().value;
            this.getMoreartyContext().getBinding().sub('default.system.current_language').set(value);
        },
        render: function () {
            var _ = React.DOM,
                __ = this.gls,
                default_binding = this.getMoreartyContext().getBinding().sub('default'),
                current_lang = default_binding.sub('system.current_language').get(),
                languages_binding = default_binding.sub('system.languages');


            return _.div({ className: 'interface-component' },
                _.div({ className: 'form-data profile clearfix' },
                    _.div({ key: 'form-device-input', className: 'form-group inline' },
                        _.span({className: 'label-span'}, __('interface_lang'), ':'),
                        _.select({
                                ref: 'selectInstance',
                                className: 'select-input',
                                onChange: this.onSelectLang,
                                defaultValue: current_lang
                            },
                            languages_binding.get().map(function (lang, index) {
                                return _.option({
                                    key: index + '-lang',
                                    value: lang
                                }, lang);
                            })
                        )
                    )
                )
            );
        }
    });
});
