define([
    'jsx!components/popup'
], function (
    Popup
) {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentWillMount: function () {
            this.getDefaultBinding().set('widgets.settings.menu_selected', 'settings');
        },
        componentWillUnmount: function () {
            this.getDefaultBinding().remove('widgets.settings.menu_selected');
        },
        onSelectedMenuItem: function (id) {
            this.getDefaultBinding().set('widgets.settings.menu_selected', id);
        },
        render: function () {
            var binding = this.getDefaultBinding(),
                devices_binding = this.getBinding('data').sub('devices'),
                index = devices_binding.get().findIndex(function (device) {
                    return binding.get('widgets.settings.device_id') === device.get('id');
                }),
                device_binding = index !== -1 ? devices_binding.sub(index) : null,
                popup_binding = {
                    default: binding,
                    showing: binding.sub('widgets.settings.showing'),
                    selected: binding.sub('widgets.settings.menu_selected')
                },
                options = {
                    title: device_binding ? device_binding.get('metrics.title').toUpperCase() : '',
                    menu: [
                        {id: 'settings', title: 'SETTINGS', icon: 'fa-pie-chart'},
                        {id: 'statistics', title: 'STATISTICS', icon: 'fa-cogs'}
                    ],
                    menu_handler: this.onSelectedMenuItem
                };

            return (
                <Popup binding={popup_binding} options={options}>
                    <span className='sss'></span>
                </Popup>
            );
        }
    });
});