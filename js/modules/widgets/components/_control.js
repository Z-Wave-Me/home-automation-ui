define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {
            var binding = this.getDefaultBinding(),
                rearrange_showing = this.getBinding('footer').val('rearrange_showing'),
                icon = binding.val('metrics.icon'),
                _ = React.DOM;

            return _.div({className: 'widget'},
                rearrange_showing ? _.div({className: 'select-button'}) : null,
                _.span({className: 'icon', style: {backgroundImage: 'url(' + icon + ')'}}),
                _.span({className: 'title'}, binding.val('metrics.title')),
                _.div({className: 'metrics-container'},
                    _.button({className: 'quad-button up-button'}, 'Up'),
                    _.button({className: 'quad-button down-button'}, 'Down')
                )
            );
        }
    });
});
