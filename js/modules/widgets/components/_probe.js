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
                rearrange_showing = this.getBinding('footer').val('rearrange_showing'),
                metrics_binding = binding.sub('metrics'),
                level = this.isFloat(metrics_binding.val('level')) ? binding.sub('metrics').val('level').toFixed(1)
                    : metrics_binding.val('level'),
                scaleTitle = binding.val('metrics.scaleTitle') ? ' ' + binding.val('metrics.scaleTitle') : '';

            return _.div({className: 'widget probe ' + binding.val('deviceType')},
                rearrange_showing ? _.div({className: 'select-button'}) : null,
                _.span({className: 'icon', style: {backgroundImage: 'url(' + binding.val('metrics.icon') + ')'}}),
                _.span({className: 'title'}, binding.val('metrics.title')),
                _.div({className: 'metrics-container'},
                    _.span({className: 'value-field'}, level + scaleTitle)
                )
            );
        }
    });
});
