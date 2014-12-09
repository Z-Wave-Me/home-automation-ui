define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        getInitialState: function () {
            return {
                failure: false
            };
        },
        onChangeHandler: function () {
            var tags_binding = this.getDefaultBinding(),
                input_value = this.refs.new.getDOMNode().value;

            if (tags_binding.get().indexOf(input_value) !== -1) {
                this.replaceState({failure: true});
            } else {
                this.replaceState({failure: false});
            }

            this.forceUpdate();
        },
        onAddNewTagHandler: function (e) {
            var tags_binding = this.getDefaultBinding(),
                input_value = this.refs.new.getDOMNode().value;

            if (tags_binding.get().indexOf(input_value) === -1 && input_value.length > 2) {
                tags_binding.update(function (tags) {
                    return tags.push(input_value);
                });

                this.refs.new.getDOMNode().value = '';

                this.forceUpdate();
            }

        },
        render: function () {
            var cx = React.addons.classSet,
                tags_binding = this.getDefaultBinding(),
                new_classes = cx({
                    'tag new': true,
                    failure: this.state.failure
                });

            return (
                <ul className='tags'>
                    {tags_binding.get().map(function (tag) {
                        return <li className='tag'>{tag}</li>
                    }).toArray()}
                    <li className={new_classes}>
                        <Morearty.DOM.input
                            type='text'
                            ref='new'
                            className='input-new-tag'
                            onChange={this.onChangeHandler}
                            onKeyDown={Morearty.Callback.onEnter(this.onAddNewTagHandler)}
                            placeholder='add new'
                        />
                    </li>
                </ul>
            );
        }
    })
});