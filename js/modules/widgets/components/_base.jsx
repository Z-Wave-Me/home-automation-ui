define([
    // components
    'jsx!./probe',
    'jsx!./switch',
    'jsx!./multilevel',
    'jsx!./control',
    './_camera',
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
        mixins: [Morearty.Mixin],
        render: function () {
            var binding = this.getDefaultBinding(),
                device_type = binding.get('deviceType'),
                _binding = { default: binding, footer: this.getBinding('footer') },
                Widget;

            if (device_type === "sensorBinary" ||
                device_type === "sensorMultilevel" ||
                device_type === "battery") {
                Widget = <Probe binding={_binding} />;
            } else if (device_type === "fan") {
                Widget = <Probe binding={_binding} />;
            } else if (device_type === "switchMultilevel") {
                Widget = <Multilevel binding={_binding} />;
            } else if (device_type === "thermostat") {
                Widget = <Thermostat binding={_binding} />;
            } else if (device_type === "switchBinary" || device_type === "switchRGBW" || device_type === "doorlock") {
                Widget = <Switch binding={_binding} />;
            } else if (device_type === "toggleButton") {
                Widget = <Toggle binding={_binding} />;
            } else if (device_type === "camera") {
                Widget = <Camera binding={_binding} />;
            } else if (device_type === "switchControl") {
                Widget = <Control binding={_binding} />;
            } else {
                //Widget = <Probe binding={_binding} />;
            }

            return Widget;
        }
    });
});
