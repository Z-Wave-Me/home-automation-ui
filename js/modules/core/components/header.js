define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        onShowPreferences: function () {
            this.getDefaultBinding().set('overlayShow', true);
            return false;
        },
        toggleShowNotificationsPopup: function () {
            var binding = this.getDefaultBinding(),
                show = binding.get('notifications.show_popup');

            binding.get('notifications.show_popup', !show);

            return false;
        },
        render: function () {
            var _ = React.DOM,
                __ = this.gls,
                cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                nowShowing = binding.get('nowShowing'),
                notifications = binding.sub('notifications'),
                notifications_count = notifications.get('count'),
                notifications_severity = notifications.get('severity'),
                notification_mode = notifications.sub('severity_modes.' + notifications_severity),
                // TODO: rewrite after added severity in backend
                notifications_message = notifications_count === 0 ? notification_mode.get('message') : 'warning',
                events_class = cx({
                    ok: notifications_severity.toLowerCase() === 'ok' && notifications_count === 0,
                    // TODO: rewrite after added severity in backend
                    warning: notifications_severity.toLowerCase() === 'warning' || notifications_count > 0,
                    critical: notifications_severity.toLowerCase() === 'critical' || notifications_message === 'no connection',
                    two: true,
                    columns: true,
                    'notifications-block': true
                }),
                dashboard_classes = cx({
                    three: true,
                    columns: true,
                    alpha: true,
                    omega: true,
                    'top-menu-item': true,
                    selected: nowShowing === 'dashboard' || nowShowing === ''
                }),
                widgets_classes = cx({
                    three: true,
                    columns: true,
                    alpha: true,
                    omega: true,
                    'top-menu-item': true,
                    selected: nowShowing === 'widgets'
                }),
                gear_classes = cx({
                    gear: true,
                    fa: true,
                    'fa-gear': true,
                    active: binding.get('overlays.preferences.showing')
                });

            if (notifications_count === 0 && notifications_message !== 'no connection') {
                notifications_count = _.i({className: 'fa fa-check'});
            } else if (notifications_message === 'no connection') {
                notifications_count = _.i({className: 'fa fa-close'});
            }

            return _.header({ className: 'site-header clearfix' },
                // logo
                _.div({className: 'three columns alpha omega company-name-container'},
                    _.a({className: 'company-name', href: '/', title: 'z-wave.me'},
                        _.span({className: ''}, 'Z'),
                        _.span({className: 'gray'}, '-'),
                        _.span({className: ''}, 'WAVE'),
                        _.span({className: 'gray'}, _.i({className: 'fa fa-angle-right angle-right'})),
                        _.span({className: ''}, 'ME')
                    )
                ),
                // preferences
                _.div({className: 'three columns preferences-block', onClick: this.onShowPreferences},
                    _.span({className: gear_classes}),
                    _.span({className: 'label-button'}, __('preferences', 'upper'))
                ),
                // notifications
                _.div({className: events_class, onClick: this.toggleShowNotificationsPopup},
                    _.span({className: 'events-counter'}, notifications_count),
                    _.span({className: 'events-message'}, notifications_message.toUpperCase())
                ),
                // menu
                _.div({className: 'six columns alpha omega top-menu'},
                    _.a({href: '#/dashboard', className: dashboard_classes}, __('dashboard', 'upper')),
                    _.a({href: '#/widgets', className: widgets_classes}, __('widgets', 'upper'))
                )
                //_.div({className: 'header-sub-container top-container clearfix'},
                //    _.div({className: 'company-block', title: 'Z-Wave.me'},
                //        _.a({
                //            className: 'company-logo',
                //            href: '/',
                //            title: 'Z-Wave.me',
                //            alt: 'Z-Wave.me'
                //        })
                //    ),
                //    _.nav({className: 'main-navigation'},
                //        _.ul({ className: 'navigation-menu' },
                //            _.li(null, _.a({ className: nowShowing === 'dashboard' || nowShowing === '' ? 'selected' : '', href: '#/dashboard' }, __('dashboard', 'upper'))),
                //            _.li(null, _.a({ className: nowShowing === 'widgets' ? 'selected' : '', href: '#/widgets' }, __('widgets', 'upper')))
                //        )
                //    ),
                //    _.section({className: 'user-panel-section'},
                //        _.div({ onClick: this.toggleShowNotificationsPopup, className: events_class},
                //            _.span({className: 'events-counter'}, notifications_count),
                //            _.span({className: 'events-message'}, notifications_message.toUpperCase())
                //        ),
                //        _.div({className: 'preferences-button', onClick: this.onShowPreferences},
                //            _.span({className: 'icon-button small-gear tools-sprite'}),
                //            _.span({className: 'label-button'}, __('preferences', 'upper'))
                //        )
                //    )
                //),
                //this.isShownFilters()
            );
        }
    });
});
