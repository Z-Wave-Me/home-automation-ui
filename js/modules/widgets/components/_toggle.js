define([
    // mixins
    'mixins/sync/sync-layer'
], function (
    sync_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, sync_layer_mixin],
        toggleSwitch: function (command) {
            this.fetch({
                model: this.getDefaultBinding(),
                serviceId: 'devices'
            }, command);
            return false;
        },
        render: function () {
            var binding = this.getDefaultBinding(),
                rearrange_showing = this.getBinding('footer').val('rearrange_showing'),
                _ = React.DOM;

            return _.div({className: 'widget'},
                rearrange_showing ? _.div({className: 'select-button'}) : null,
                _.span({className: 'icon', style: {backgroundImage: 'url(' + binding.val('metrics.icon') + ')'}}),
                _.span({className: 'title'}, binding.val('metrics.icon')),
                _.div({className: 'metrics-container'},
                    _.span({className: 'switch-door bubble-door active', onClick: this.toggleSwitch.bind(null, 'on')},
                        _.span({className: 'bubble'})
                    )
                )
            );
        }
    });
});
