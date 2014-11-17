define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentWillMount: function () {
            var that = this;
            that.getBinding('data').addListener('deviceTags', function () {
                if (that.isMounted()) {
                    that.forceUpdate();
                }
            });
        },
        componentDidMount: function () {
            var binding = this.getDefaultBinding(),
                dataBinding = this.getBinding('data');

            if (dataBinding.val('deviceTags').count() > 0) {
                binding.set('secondaryFilter', dataBinding.val('deviceTags').first());
            }
        },
        setSecondaryFilter: function (value) {
            this.getDefaultBinding().set('secondaryFilter', value);
            return false;
        },
        render: function () {
            var that = this,
                binding = this.getDefaultBinding(),
                dataBinding = this.getBinding('data'),
                _ = React.DOM,
                secondaryFilter = binding.val('secondaryFilter'),
                tagsBinding = dataBinding.sub('deviceTags'),
                tags = tagsBinding.val().toJS();

            return _.div({className: 'filter-items'},
                tags
                    .map(function (tag) {
                        return _.span({
                            onClick: that.setSecondaryFilter.bind(null, tag),
                            className: secondaryFilter === tag ? 'filter selected' : 'filter',
                            key: tag
                        }, tag);
                    })
            );
        }
    });
});
