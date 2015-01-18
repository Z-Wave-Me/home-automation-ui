define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {
            var _ = React.DOM,
                binding = this.getDefaultBinding(),
                metrics_binding = binding.sub('metrics'),
                title = metrics_binding.get('title'),
                level = Sticky.get('App.Helpers.JS').isFloat(metrics_binding.get('level')) ?
                    binding.sub('metrics').get('level').toFixed(1) : metrics_binding.get('level'),
                scaleTitle = metrics_binding.get('scaleTitle') || '';

            return (
                _.div({className: 'content'},
                    _.span({className: 'title-container'}, title),
                    _.span({className: 'value-field'},
                        _.span({className: 'probe-value'}, level + scaleTitle)
                    )
                )
            );
        }
    });
});
