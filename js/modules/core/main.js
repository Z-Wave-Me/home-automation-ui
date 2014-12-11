define([
    // components
    'jsx!./components/header',
    'jsx!./components/main',
    'Preferences',
    'jsx!modules/notifications/notifications',
    'Load',
    // mixins
    'mixins/sync/sync-layer'
], function (
    // components
    Header,
    Main,
    Preferences,
    Notifications,
    Load,
    // mixins
    sync_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, sync_layer_mixin],
        componentDidMount: function () {
            var binding = this.getDefaultBinding();

            this._routes = Object.freeze({
                'DASHBOARD': 'dashboard',
                'WIDGETS': 'widgets'
            });

            Router({
                '/': binding.set.bind(binding, 'nowShowing', this._routes.DASHBOARD),
                '/dashboard': binding.set.bind(binding, 'nowShowing', this._routes.DASHBOARD),
                '/widgets': binding.set.bind(binding, 'nowShowing', this._routes.WIDGETS)
            }).init();

            // enable autosync after update collection
            this.enableAutoSync();
        },
        render: function () {
            var that = this,
                _ = React.DOM,
                binding = this.getDefaultBinding();

            return _.div({ className: 'applications wrapper', 'data-app-id': 'home-automation' },
                Header({
                    binding: {
                        default: binding,
                        data: that.getBinding('data')
                    }
                }),
                Main({
                    binding: {
                        default: binding,
                        data: that.getBinding('data'),
                        preferences: that.getBinding('preferences')
                    }
                }),
                //Preferences({binding: {
                //    default: binding,
                //    data: that.getBinding('data'),
                //    preferences: that.getBinding('preferences')
                //}}),
                //Load({binding: {
                //    default: binding,
                //    data: that.getBinding('data'),
                //    preferences: that.getBinding('preferences')
                //}}),
                Notifications({
                    binding: {
                        default: binding,
                        data: that.getBinding('data'),
                        preferences: that.getBinding('preferences')
                    }
                })
            );
        }
    });
});
