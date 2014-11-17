define([
    // components
    './_probe',
    './_switch',
    './_multilevel',
    './_control',
    './_camera',
    './_toggle',
    './_thermostat'
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
                _ = React.DOM,
                device_type = binding.val('deviceType'),
                Widget;

            if (device_type === "sensorBinary" ||
                device_type === "sensorMultilevel" ||
                device_type === "battery") {
                Widget = Probe;
            } else if (device_type === "fan") {
                Widget = Probe;
            } else if (device_type === "switchMultilevel") {
                Widget = Multilevel;
            } else if (device_type === "thermostat") {
                Widget = Thermostat;
            } else if (device_type === "switchBinary" || device_type === "switchRGBW" || device_type === "doorlock") {
                Widget = Switch;
            } else if (device_type === "toggleButton") {
                Widget = Toggle;
            } else if (device_type === "camera") {
                Widget = Camera;
            } else if (device_type === "switchControl") {
                Widget = Control;
            } else {
                //Widget = new Probe(Ctx);
            }

            return Widget({
                binding: {
                    default: binding,
                    footer: this.getBinding('footer')
                }
            });
        }
    });
});
