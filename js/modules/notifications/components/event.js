define([
    // mixins
    'mixins/sync/sync-layer'
], function (
    // mixins
    sync_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, sync_layer_mixin, TranslateMixin],
        setFullViewItem: function (id) {
            if (this.isMounted()) {
                this.getBinding('notifications_options').set('full_view_notice_id', id);
            }
            return false;
        },
        setRedeemedNotification: function () {
            var that = this,
                model = this.getBinding('notification');

            model.set('redeemed', true);

            that.save({
                serviceId: 'notifications',
                model: model,
                collection: that.getBinding('notifications'),
                success: function (obj) {
                    if (obj.val('redeemed')) {
                        that.setFullViewItem(null);
                        model.delete();
                    }
                }
            });
            return false;
        },
        componentWillMount: function () {
            var that = this;
            this.getBinding('notifications_options').addListener('full_view_notice_id', function () {
                if (that.isMounted()) {
                    that.forceUpdate();
                }
            });
        },
        render: function () {
            var _ = React.DOM,
                __ = this.gls,
                notification = this.getBinding('notification'),
                index = this.props.index,
                time_date = new Date(notification.val('timestamp'));

            function LZ(n) {
                return (n < 10 ? '0' : '') + n;
            }

            time_date = time_date.getDate() + "/" + LZ(time_date.getMonth() + 1) + "/" + (time_date.getYear() - 100) + "-" + LZ(time_date.getHours()) + ":" + LZ(time_date.getMinutes());

            if (this.getBinding('notifications_options').val('full_view_notice_id') === notification.val('id') + '-' + index) {
                return (
                    _.div({className: 'event-item full-view', id: notification.val('id'), key: 'notice-' + index },
                        _.span({className: 'content-container'},
                            _.div({key: 'type-value', className: 'type-value'}, __('type', 'capitalize'), ': ' + notification.val('type')),
                            _.div({key: 'time-value', className: 'time-value'}, __('timestamp', 'capitalize'), ': ' + time_date),
                            _.label({key: 'message-label', className: 'label'}, __('message', 'capitalize'), ': '),
                            _.div({key: 'message-value', className: 'message-value'}, notification.val('message'))
                        ),
                        _.span({className: 'actions-container'},
                            //_.span({
                            //    className: 'action-button',
                            //    onClick: this.setRedeemedNotification
                            //}, __('hide', 'case')),
                            _.span({
                                onClick: this.setFullViewItem.bind(null, null),
                                className: 'action-button'
                            }, __('minimize', 'case'))
                        )
                    )
                );
            } else {
                return (
                    _.div({onClick: this.setFullViewItem.bind(null, notification.val('id') + '-' + index), className: 'event-item', id: notification.val('id'), key: 'notice-' + index },
                        _.span({className: 'content-container'},
                            _.span({className: 'type-filed'}, '[' + notification.val('type').toUpperCase() + '] '),
                            _.span({className: 'message-field'}, notification.val('message'))
                        ),
                        _.span({
                            className: 'action'
                        })
                    )
                );
            }
        }
    });
});
