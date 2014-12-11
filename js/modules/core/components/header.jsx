define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        onShowPreferences: function () {
            this.getDefaultBinding().set('overlayShow', true);
        },
        toggleShowNotificationsPopup: function () {
            var binding = this.getDefaultBinding(),
                is_show = binding.get('notifications.show_popup');

            if (!is_show) {
                binding.set('notifications.show_popup', true);
                binding.set('notifications.show_popup', 'active');
            } else {
                binding.set('notifications.show_popup', true);
                binding.set('notifications.show_popup', false);
            }
        },
        render: function () {
            var __ = this.gls,
                cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                nowShowing = binding.get('nowShowing'),
                notifications = binding.sub('notifications'),
                notifications_count = notifications.get('count'),
                notifications_severity = notifications.get('severity'),
                notification_mode = notifications.sub('severity_modes.' + notifications_severity),
                notifications_message = notifications_count === 0 ? notification_mode.get('message') : 'warning',
                events_class = cx({
                    ok: notifications_severity.toLowerCase() === 'ok' && notifications_count === 0,
                    warning: notifications_severity.toLowerCase() === 'warning' || notifications_count > 0,
                    critical: notifications_severity.toLowerCase() === 'critical' || notifications_message === 'no connection',
                    'notifications-block': true,
                    'two columns alpha omega': true
                }),
                dashboard_classes = cx({
                    'three columns alpha omega': true,
                    'top-menu-item': true,
                    selected: nowShowing === 'dashboard' || nowShowing === ''
                }),
                widgets_classes = cx({
                    'three columns alpha omega': true,
                    'top-menu-item': true,
                    selected: nowShowing === 'widgets'
                }),
                gear_classes = cx({
                    'fa gear fa-gear': true,
                    active: binding.get('overlays.preferences.showing')
                });

            if (notifications_count === 0 && notifications_message !== 'no connection') {
                notifications_count = <i className='fa fa-check'></i>;
            } else if (notifications_message === 'no connection') {
                notifications_count = <i className='fa fa-close'></i>;
            }

            return (
                <header className='site-header clearfix'>
                    <div className='five columns alpha omega company-name-container'>
                        <a
                            className='company-name'
                            href='/'
                            title='z-wave.me'
                        >
                            <span>Z</span>
                            <span className='gray'>-</span>
                            <span>WAVE</span>
                            <span className='gray'><i className='fa fa-angle-right angle-right'></i></span>
                            <span>ME</span>
                        </a>
                    </div>
                    <div className='six columns alpha omega top-menu'>
                        <a href='#/dashboard' className={dashboard_classes}>{__('dashboard', 'upper')}</a>
                        <a href='#/widgets' className={widgets_classes}>{__('widgets', 'upper')}</a>
                    </div>
                    <div className={events_class} onClick={this.toggleShowNotificationsPopup}>
                        <span className='events-counter'>{notifications_count}</span>
                        <span className='events-message'>{notifications_message.toUpperCase()}</span>
                    </div>
                    <div className='three columns preferences-block alpha omega' onClick={this.onShowPreferences}>
                        <span className={gear_classes}></span>
                        <span className='label-button'>{__('preferences', 'upper')}</span>
                    </div>
                </header>
            );
        }
    });
});
