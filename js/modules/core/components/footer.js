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
                    _.div({className: 'columns three'},
                        _.span({className: 'pencil fa fa-pencil'}),
                        _.span({className: 'menu-label'}, !rearrange_showing ? 'Rearrange & Settings'
                            : 'Drag & drop to rearrange')
                    ),
                    rearrange_showing ? (
                        _.div({className: 'columns three add-dashboard-container'},
                            _.span({className: 'plus fa fa-plus-circle'}),
                            BaseSearch({
                                binding: {
                                    default: binding
                                },
                                search_attr: binding.sub('footer.search_string')
                            })
                        ),
                        _.div({className: 'columns three drop-here-container'},
                            _.span({className: 'plus fa fa-minus-circle'}),
                            _.span({className: 'drop-here'}, 'Drop here to remove')
                        ),
                        _.div({className: 'columns two done-container'},
                            _.span({className: 'fa-minus-circle fa'}),
                            _.span({className: 'label'}, 'Done')
                        )
                    ) : null
                )
            );
        }
    });
});
