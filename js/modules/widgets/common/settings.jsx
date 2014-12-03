define([
    'jsx!components/popup'
], function (
    Popup
) {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {
            var binding = this.getDefaultBinding(),
                devices_binding = this.getBinding('data').sub('devices'),
                index = devices_binding.get().findIndex(function (device) {
                    return binding.get('widgets.settings.device_id') === device.get('id');
                }),
                device_binding = index !== -1 ? devices_binding.sub(index) : null,
                popup_binding = {
                    default: binding,
                    showing: binding.sub('widgets.settings.showing')
                },
                options = {
                    title: device_binding ? device_binding.get('metrics.title').toUpperCase() : ''
                };

            return (
                <Popup binding={popup_binding} options={options}>
                    <span className='sss'></span>
                </Popup>
            );
        }
    });
});