define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentWillMount: function () {
            var that = this;
            that.getBinding('data').addListener('deviceTypes', function () {
                if (that.isMounted()) {
                    that.forceUpdate();
                }
            });
        },
        componentDidMount: function () {
            var binding = this.getDefaultBinding(),
                dataBinding = this.getBinding('data');

            if (dataBinding.get('deviceTypes').count() > 0) {
                binding.set('secondaryFilter', dataBinding.get('deviceTypes').first());
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
                secondaryFilter = binding.get('secondaryFilter'),
                typesBinding = dataBinding.sub('deviceTypes'),
                types = typesBinding.get().toJS();

            return _.div({className: 'filter-items'},
                types
                    .map(function (type) {
                        return _.span({
                            onClick: that.setSecondaryFilter.bind(null, type),
                            className: secondaryFilter === type ? 'filter selected' : 'filter',
                            key: type
                        }, type);
                    })
            );
        }
    });
});
