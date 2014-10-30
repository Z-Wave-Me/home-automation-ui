define([
    // mixins
    '../mixins/base_mixin'
], function (
    // mixins
    base_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, base_mixin, TranslateMixin],
        render: function () {
            var _ = React.DOM,
                __ = this.gls;

            return _.div({ className: 'main-component' },
                _.div({ className: 'line-container'},
                    _.div({ className: 'main-menu-item', onClick: this.setActiveNode.bind(null, 2)},
                        _.span({ className: 'container-icon general-icon'}),
                        _.span({ className: 'title-menu-item'}, __('profiles', 'capitalize'))
                    ),
                    _.div({ className: 'main-menu-item', onClick: this.setActiveNode.bind(null, 3)},
                        _.span({ className: 'container-icon rooms-icon'}),
                        _.span({ className: 'title-menu-item'}, __('rooms', 'capitalize'))
                    ),
                    _.div({ className: 'main-menu-item', onClick: this.setActiveNode.bind(null, 4)},
                        _.span({ className: 'container-icon switch-icon'}),
                        _.span({ className: 'title-menu-item'}, __('widgets', 'capitalize'))
                    )
                ),
                _.div({ className: 'line-container'},
                    _.div({ className: 'main-menu-item', onClick: this.setActiveNode.bind(null, 5)},
                        _.span({ className: 'container-icon modules-icon'}),
                        _.span({ className: 'title-menu-item'}, __('automation', 'capitalize'))
                    ),
                    _.div({ className: 'main-menu-item', onClick: this.setActiveNode.bind(null, 6)},
                        _.span({ className: 'container-icon modules-icon'}),
                        _.span({ className: 'title-menu-item'}, __('modules', 'capitalize'))
                    ),
                    _.div({ className: 'main-menu-item', onClick: this.setActiveNode.bind(null, 7)},
                        _.span({ className: 'container-icon modules-icon'}),
                        _.span({ className: 'title-menu-item'}, __('ui_setting', 'capitalize'))
                    )
                )
            );
        }
    });
});
