define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        propTypes: {
            title: React.PropTypes.string.isRequired,
        },
        onEscape: function () {
            var binding = this.getDefaultBinding(),
                meta_binding = binding.meta();

            binding.set(meta_binding.get('pre_focus_data'));
            this.forceUpdate();
        },
        onSavePreviousData: function () {
            var binding = this.getDefaultBinding(),
                meta_binding = binding.meta();

            meta_binding.set('pre_focus_data', binding.get());
        },
        render: function () {
            var binding = this.getDefaultBinding(),
                title = this.props.title,
                icon = this.props.icon;

            return (
                <div className='material input-container textarea-container'>
                    {icon ? <i className={'icon fa ' + icon}/> : null}
                    <div className='group'>
                        <Morearty.DOM.textarea
                            type='text'
                            value={binding.get()}
                            onFocus={this.onSavePreviousData}
                            onBlur={this.onSavePreviousData}
                            onChange={Morearty.Callback.set(binding)}
                            onKeyDown={Morearty.Callback.onEscape(this.onEscape)}
                            required='true'
                            className='input-field'
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label>{title}</label>
                    </div>
                </div>
            );
        }
    })
});