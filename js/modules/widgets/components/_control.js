define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        render: function () {
            var _ = React.DOM,
                __ = this.gls;

            return (
                _.div({className: 'content'},
                    _.span({className: 'title-container'}, this.getDefaultBinding().get('metrics.title')),
                    _.button({className: 'quad-button up-button'}, __('up', 'capitalize')),
                    _.button({className: 'quad-button down-button'}, __('down', 'capitalize'))
                )
            );
        }
    });
});
