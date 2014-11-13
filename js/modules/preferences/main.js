define([
    // components
    './components/base',
    // mixins
    './mixins/base_mixin'
], function (
    // components
    Base,
    // mixins
    base_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin, TranslateMixin],
        componentDidMount: function () {
            var that = this,
                binding = this.getDefaultBinding();

            binding.addListener('overlayShow', function (showing) {
                if (showing) {
                    document.getElementById('body').style.overflow = 'hidden';
                } else {
                    document.getElementById('body').style.overflow = 'auto';
                    that.setActiveNode(1);
                }
            });
        },
        back: function () {
            this.getBinding('preferences').set('backButtonEnabled', false);
            this.setActiveNode(1); // 1 - main panel
            this.clearTemporaryData();
        },
        closeOverlay: function () {
            this.getDefaultBinding().set('overlayShow', false);
            this.clearTemporaryData();
        },
        render: function () {
            var _ = React.DOM,
                __ = this.gls,
                binding = this.getDefaultBinding(),
                preferencesBinding = this.getBinding('preferences'),
                overlay_show = binding.val('overlayShow'),
                overlay_name = binding.val('overlayShowName'),
                overlay_back_button_enabled = preferencesBinding.val('backButtonEnabled');

            return (
                _.div({
                        className: overlay_show ? ['overlay', 'show'].join(' ') : 'overlay',
                        'data-overlay-name': overlay_name || 'default'
                    },
                    _.div({className: 'overlay-wrapper'},
                        _.div({className: 'overlay-top'},
                            _.div({className: 'overlay-left-top-panel overlay-top-panel'},
                                _.span({
                                    className: overlay_back_button_enabled ? 'overlay-back-button' : 'overlay-back-button hidden',
                                    onClick: this.back
                                }, '← ' + __('preferences', 'upper'))
                            ),
                            _.div({className: 'overlay-center-top-panel overlay-top-panel'},
                                _.span({
                                    className: 'overlay-top-panel overlay-panel-title'
                                }, __(this.getActiveNodeTree()[0].options.name, 'capitalize'))
                            ),
                            _.div({className: 'overlay-right-top-panel overlay-top-panel'},
                                _.span({
                                    className: 'overlay-close-button',
                                    onClick: this.closeOverlay
                                }, '✖')
                            )
                        ),
                        overlay_show ? Base({
                            binding: {
                                default: preferencesBinding,
                                preferences: preferencesBinding,
                                data: this.getBinding('data')
                            }
                        }) : null
                    )
                )
            );
        }
    });
});
