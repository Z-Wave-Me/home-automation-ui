define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {
            var _ = React.DOM,
                binding = this.getDefaultBinding(),
                rearrange_showing = this.getBinding('footer').get('rearrange_showing');

            return _.div({className: 'widget probe ' + binding.get('deviceType')},
                    rearrange_showing ? _.div({className: 'select-button'}) : null,
                    _.span({className: 'icon', style: {backgroundImage: 'url(' + metrics_binding.get('icon') + ')'}}),
                    _.span({className: 'title'}, metrics_binding.get('title')),
                    _.div({className: 'metrics-container'},
                        _.button({className: 'quad-button up-button'}, 'Up'),
                        _.button({className: 'quad-button down-button'}, 'Down')
                    )
                );
        }
    });
});
