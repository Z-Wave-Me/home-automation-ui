define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        onClickCloseButton: function () {
            this.getDefaultBinding().set(false);
        },
        render: function () {
            var cx = React.addons.classSet,
                showing = this.getDefaultBinding().get(),
                overlay_class_name = cx({
                    hidden: !Boolean(showing),
                    overlay: true,
                    transparent: !!this.props.transparent
                });

            return <div className={overlay_class_name} onClick={this.onClickCloseButton} ></div>;
        }
    });
});