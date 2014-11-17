define([
    // components
    'Widgets',
    './filters',
    './footer'
], function (
    // components
    Widgets,
    Filters,
    Footer
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {
            var binding = this.getDefaultBinding(),
                dataBinding = this.getBinding('data'),
                _ = React.DOM,
                _binding = {binding: { default: binding, data: dataBinding, preferences: this.getBinding('preferences')}};

            return _.div({ className: 'main clearfix' },
                Filters(_binding),
                Widgets(_binding),
                Footer(_binding)
            );
        }
    });
});
