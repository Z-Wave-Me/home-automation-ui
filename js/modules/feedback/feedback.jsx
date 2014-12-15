define([
    // mixins
    'mixins/sync/sync-layer',
    // components
    'jsx!components/popup',
    'jsx!components/input',
    'jsx!components/textarea'
], function (
    // components
    SyncLayerMixin,
    // mixins
    Popup,
    Input,
    Textarea
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, SyncLayerMixin, TranslateMixin],
        onClickBugLabel: function () {
            var binding = this.getDefaultBinding();
            binding.set('feedback.showing', !binding.get('feedback.showing'));
        },
        onSaveHandler: function () {

        },
        onCancelHandler: function () {

        },
        componentWillMount: function () {
            var binding = this.getDefaultBinding(),
                feedback_structure = {
                    showing: false,
                    sync_status: 'normal',
                    email: '',
                    message: ''
                };

            binding.set('feedback', Immutable.fromJS(feedback_structure));
        },
        render: function () {
            var __ = this.gls,
                binding = this.getDefaultBinding(),
                options = {
                    title: 'Feedback',
                    onSaveHandler: this.onSaveHandler,
                    onCancelHandler: this.onCancelHandler,
                    buttons: {
                        save: true,
                        cancel: true,
                        close: false
                    },
                    className: 'feedback-popover'
                },
                popup_binding = {
                    default: binding,
                    showing: binding.sub('feedback.showing'),
                    status_binding: binding.sub('feedback.sync_status')
                };

            return (
                <div className="feedback-container">
                    <div className="feedback" onClick={this.onClickBugLabel}>
                        <i className="fa fa-bug bug-icon" />
                        <span className="feedback-title">FEEDBACK</span>
                    </div>
                    <Popup binding={popup_binding} options={options}>
                        <div className="content">
                            <Input icon='fa-envelope' title='Email' binding={binding.sub('feedback.email')} />
                            <Textarea icon='fa-hand-o-right' title="Message" binding={binding.sub('feedback.message')}/>
                        </div>
                    </Popup>
                </div>
            );
        }
    });
});
