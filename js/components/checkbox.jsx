define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        propTypes: {
            title: React.PropTypes.string.isRequired,
            description: React.PropTypes.string,
            handler: React.PropTypes.func
        },
        onCheck: function (event) {
            var handler = this.props.handler,
                checkbox_value = this.refs.checkbox.getDOMNode().checked;

            if (handler) {
                this.props.handler(checkbox_value);
            } else {
                this.getDefaultBinding().set(checkbox_value);
            }

            this.forceUpdate();
        },
        render: function () {
            var binding = this.getDefaultBinding(),
                title = this.props.title,
                description = this.props.description,
                id = this.props.id ? 'id-' + this.props.id : '',
                checked = typeof this.props.checked === 'function' ? this.props.checked() : binding.get();

            return (
                <div className="material checkbox-container">
                    <div key={'checkbox-container-' + id} className='checkbox-group form-group'>
                        <Morearty.DOM.input
                            ref='checkbox'
                            type='checkbox'
                            id={'checkbox-' + id}
                            onChange={this.onCheck}
                            className='checkbox'
                            checked={checked}
                        />
                        <label htmlFor={'checkbox-' + id} className='label'>
                            <span></span>
                            <span className='check'></span>
                            <span className='box'></span>
                            <span className='title'>{title}</span>
                        </label>
                    </div>
                    {description ? <p className='description'>Notify me about how great I am every hour.</p> : null}
                </div>
            );
        }
    })
});