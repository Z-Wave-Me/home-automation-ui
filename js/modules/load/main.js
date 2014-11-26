define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        render: function () {
            var _ = React.DOM,
                __ = this.gls,
                default_binding = this.getDefaultBinding(),
                system_binding = default_binding.sub('system'),
                styles_progress = {
                    width: system_binding.get('loaded_percentage') + '%'
                };

            return system_binding.get('loaded') === false || system_binding.get('loaded_lang_file') === false ? (
                _.div({className: 'overlay show'},
                    _.div({className: 'overlay-wrapper'},
                        _.div({className: 'overlay-top'},
                            null
                        ),
                        _.div({className: 'loading-component'},
                            _.div({className: 'header'}, __('loading', 'capitalize') + '...'),
                            _.div({className: 'progress-bar'},
                                _.div({style: styles_progress, className: 'progress-activity'})
                            ),
                            _.div({className: 'list-events'},
                                null
                            )
                        )
                    )
                )
            ) : null;
        }
    });
});
