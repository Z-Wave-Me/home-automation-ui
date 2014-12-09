define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {
            var classes = this.props.classes ? 'button ' + this.props.classes : 'button';

            return (
                <div className={classes} onClick={this.props.handler}>
                    <div className="center" >{this.props.title.toUpperCase()}</div>
                </div>
            );
        }
    });
});