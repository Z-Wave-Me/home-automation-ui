define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        render: function () {
            var cx = React.addons.classSet,
                _ = React.DOM,
                __ = this.gls,
                search_classes = cx({
                    'search-input': true,
                    small: this.props.small
                });

            return _.div({ className: 'base-search-component' },
                _.input({
                    className: search_classes,
                    type: 'search',
                    placeholder: __('search'),
                    onChange: Morearty.Callback.set(this.getDefaultBinding())
                })
            );
        }
    });
});
