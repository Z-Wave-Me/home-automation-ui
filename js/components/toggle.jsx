define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        onChangeHandler: function () {
            var checked = this.refs.radio.getDOMNode().checked;

            if (this.props.handler) {
                this.props.handler(checked);
            } else {
                this.getDefaultBinding().set(checked);
            }

            this.forceUpdate();
        },
        render: function () {
            var cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                checked = this.props.hasOwnProperty('checked') ? this.props.checked() : binding.get(),
                title = this.props.title,
                id = this.props.id,
                classes = cx({
                    toggle: true,
                    'is-toggled': checked
                });

            return (
                <div id={'toggle-container-' + id} className="material toggle-container">
                    <label id={id} className={classes} htmlFor={'radio-' + id}>
                        <div className="toggle-bar"></div>
                        <div className="radio-button">
                            <div className="radio-button-target">
                                <Morearty.DOM.input
                                    id={'radio-' + id}
                                    ref='radio'
                                    type='checkbox'
                                    checked={checked}
                                    onChange={this.onChangeHandler}
                                />
                                <div className="radio-button-fill"></div>
                            </div>
                            <span className="radio-button-label"></span>
                        </div>
                    </label>
                    <span className="label">{title}</span>
                </div>
            );
        }
    })
});