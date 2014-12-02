define([
    'jsx!components/popup'
], function (
    Popup
) {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {
            var cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                popup_binding = {default: binding};

            return (
                <Popup binding={popup_binding}>
                    <span className='sss'></span>
                </Popup>
            );
        }
    });
});