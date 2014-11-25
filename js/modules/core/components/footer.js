define([
    // components
    'Preferences/components/common/_base_search'
], function (
    // components
    BaseSearch
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        onSetRearrangeMenu: function (status) {
            this.getDefaultBinding().set('footer.rearrange_showing', status);
            return false;
        },
        render: function () {
            var cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                rearrange_showing = binding.val('footer.rearrange_showing'),
                _ = React.DOM,
                __ = this.gls,
                rearrange_classes = cx({
                    'rearrange-menu': true,
                    mini: !rearrange_showing
                });

            return _.div({ className: 'footer' },
                _.div({className: rearrange_classes},
                    _.div({className: 'columns three rearrange-area', onClick: this.onSetRearrangeMenu.bind(this, true)},
                        _.span({className: 'pencil fa fa-pencil'}),
                        _.span({className: 'menu-label'}, !rearrange_showing ? __('rearrange_and_settings', 'case')
                            : 'Drag & drop to rearrange')
                    ),
                    rearrange_showing ?
                        _.div({className: 'add-dashboard-container columns four'},
                            _.span({className: 'plus fa fa-plus-circle'}),
                            BaseSearch({
                                binding: {
                                    default: binding
                                },
                                search_attr: binding.sub('footer.search_string')
                            })
                        ) : null,
                    rearrange_showing ? _.div({className: 'drop-here-container columns four'},
                            _.span({className: 'plus fa fa-minus-circle'}),
                            _.span({className: 'drop-here'}, 'Drop here to remove')
                        ): null,
                    rearrange_showing ? _.div({
                            className: 'done-container columns two',
                            onClick: this.onSetRearrangeMenu.bind(this, false)
                        },
                            _.span({className: 'fa-check-circle fa'}),
                            _.span({className: 'label'}, 'Done')
                        ) : null
                )
            );
        }
    });
});
