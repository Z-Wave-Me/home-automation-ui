define([
    //mixins
    'mixins/data/js'
], function (
    //mixins
    JSMixin
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, JSMixin],
        render: function () {
            var _ = React.DOM,
                binding = this.getDefaultBinding(),
                rearrange_showing = this.getBinding('footer').get('rearrange_showing'),
                metrics_binding = binding.sub('metrics'),
                level = this.isFloat(metrics_binding.get('level')) ? metrics_binding.get('level').toFixed(1)
                    : metrics_binding.get('level'),
                scaleTitle = metrics_binding.get('scaleTitle') ? ' ' + metrics_binding.get('scaleTitle') : '';

            return _.div({className: 'widget probe ' + binding.get('deviceType')},
                rearrange_showing ? _.div({className: 'select-button'}) : null,
                _.span({className: 'icon', style: {backgroundImage: 'url(' + metrics_binding.get('icon') + ')'}}),
                _.span({className: 'title'}, metrics_binding.get('title')),
                _.div({className: 'metrics-container'},
                    _.span({className: 'value-field'}, level + scaleTitle)
                )
            );
        }
    });
});
