define([
    // components
    'jsx!./probe',
    'jsx!./switch',
    'jsx!./multilevel',
    'jsx!./control',
    './camera',
    'jsx!./toggle',
    'jsx!./thermostat'
], function (
    // components
    Probe,
    Switch,
    Multilevel,
    Control,
    Camera,
    Toggle,
    Thermostat
    ) {
    'use strict';

    return React.createClass({
        dragStart: function(e) {
            this.getBinding('footer').set('active_id', this.getDefaultBinding().get('id'));
        },
        dragEnd: function(e) {
            this.getBinding('footer').set('active_id', null);
        },
        mixins: [Morearty.Mixin],
        onClickSettings: function (deviceId) {
            var default_binding = this.getMoreartyContext().getBinding().sub('default');

            default_binding
                .atomically()
                .set('widgets.settings.showing', true)
                .set('widgets.settings.device_id', deviceId)
                .commit();
        },
        render: function () {
            var cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                footer_binding = this.getBinding('footer'),
                device_type = binding.get('deviceType'),
                big_devices_type = ['camera'],
                rearrange_showing = footer_binding.get('rearrange_showing'),
                metrics_binding = binding.sub('metrics'),
                icon_style = {backgroundImage: metrics_binding.get('icon')},
                widget_css_classes = cx({
                    widget: true,
                    x2: big_devices_type.indexOf(device_type) !== -1
                }),
                select_button_css_classes = cx({
                    rearrange: rearrange_showing,
                    'select-button': true
                }),
                DeviceMetrics;

            if (device_type === "sensorBinary" ||
                device_type === "sensorMultilevel" ||
                device_type === "battery") {
                DeviceMetrics = Probe;
            } else if (device_type === "fan") {
                DeviceMetrics = Probe;
            } else if (device_type === "switchMultilevel") {
                DeviceMetrics = Multilevel;
            } else if (device_type === "thermostat") {
                DeviceMetrics = Thermostat;
            } else if (device_type === "switchBinary" || device_type === "switchRGBW" || device_type === "doorlock") {
                DeviceMetrics = Switch;
            } else if (device_type === "toggleButton") {
                DeviceMetrics = Toggle;
            } else if (device_type === "camera") {
                DeviceMetrics = Camera;
            } else if (device_type === "switchControl") {
                DeviceMetrics = Control;
            } else {
                //DeviceMetrics = <Probe binding={_binding} />;
            }

            return (
                <div
                    ref={binding.get('id')}
                    draggable="true"
                    className={widget_css_classes + ' ' + binding.get('deviceType')}
                    onDragEnd={this.dragEnd}
                    onDragStart={this.dragStart}
                >
                    <div className={select_button_css_classes}></div>
                    <span className='icon' style={icon_style}></span>
                    <span className='title'>{metrics_binding.get('title')}</span>
                    {!rearrange_showing ?
                        <DeviceMetrics binding={binding} /> :
                        <div
                            className='settings-container'
                            onClick={this.onClickSettings.bind(null, binding.get('id'))
                        }>
                            <span className='setting fa-gear fa'></span>
                        </div>
                    }
                </div>
            );
        }
    });
});
