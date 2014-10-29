define([
    // libs
    'morearty'
], function (
    // libs
    Morearty
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        render: function () {
            var _ = React.DOM,
                __ = this.gls;

            return _.div({ className: 'base-search-component' },
                _.input({
                    className: 'search-input',
                    type: 'search',
                    placeholder: __('search'),
                    onChange: Morearty.Callback.set(this.props.search_attr)
                })
            );
        }
    });
});
