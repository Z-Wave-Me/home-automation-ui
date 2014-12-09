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
            var cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                title = this.props.title;

            return (
                <div className='material input-container'>
                    <div className='group'>
                        <Morearty.DOM.input
                            type='text'
                            value={binding.get()}
                            onFocus={this.onSavePreviousData}
                            onBlur={this.onSavePreviousData}
                            onChange={Morearty.Callback.set(binding)}
                            onKeyDown={Morearty.Callback.onEscape(this.onEscape)}
                            required='true'
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label className='input_classes'>{title}</label>
                    </div>
                </div>
            );
        }
    })
});