define([
    // libs
    'morearty',
    'd3',
    // mixins
    'mixins/sync/sync-layer',
    'mixins/ui/popup'
], function (
    // libs
    Morearty,
    d3,
    // mixins
    SyncLayerMixin,
    PopupMixin
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, SyncLayerMixin, PopupMixin],
        getInitialState: function () {
            var binding = this.getDefaultBinding(),
                min_level = parseInt(binding.sub('metrics').val('min')),
                max_level = parseInt(binding.sub('metrics').val('max'));

            return {
                twoPi: Math.PI * 2,
                min_level: min_level,
                max_level: max_level,
                current_level: parseInt(binding.sub('metrics').val('level')),
                step: (max_level - min_level) / 100
            };
        },
        hideNotificationsPopup: function () {
            this.props.show.set(false);
        },
        componentDidMount: function () {
            var that = this,
                color = '#40e8f0',
                radius = 50,
                border = 15,
                twoPi = this.state.twoPi,
                boxSize = '100',
                parent = d3.select(this.refs.progressContainer.getDOMNode()),
                current_level = this.state.current_level,
                arc, arc2, svg, defs, g, meter, foreground, front, numberText;

            arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(radius)
                .outerRadius(radius - border);

            arc2 = d3.svg.arc()
                .startAngle(0)
                .innerRadius(35)
                .outerRadius(35 - 3);

            svg = parent.append('svg')
                .attr('width', boxSize)
                .attr('height', boxSize);

            defs = svg.append('defs');

            g = svg.append('g')
                .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');

            meter = g.append('g')
                .attr('class', 'progress-meter');

            meter.append('path')
                .attr('class', 'background')
                .attr('fill', '#ccc')
                .attr('fill-opacity', 0.5)
                .attr('d', arc.endAngle(twoPi));

            var meter2 = g.append('g')
                .attr('class', 'progress-meter');

            meter2.append('path')
                .attr('class', 'background')
                .attr('fill', '#ccc')
                .attr('fill-opacity', 0.5)
                .attr('d', arc2.endAngle(twoPi));

            foreground = meter.append('path')
                .attr('class', 'foreground')
                .attr('fill', color)
                .attr('fill-opacity', 1)
                .attr('stroke', color)
                .attr('stroke-width', 5)
                .attr('stroke-opacity', 1)
                .attr('filter', 'url(#blur)');

            var foreground2 = meter2.append('path')
                .attr('class', 'foreground')
                .attr('fill', 'red')
                .attr('fill-opacity', 1)
                .attr('stroke', 'red')
                .attr('stroke-width', 5)
                .attr('stroke-opacity', 1)
                .attr('filter', 'url(#blur)');

            front = meter.append('path')
                .attr('class', 'foreground')
                .attr('fill', color)
                .attr('fill-opacity', 1);

            var front2 = meter.append('path')
                .attr('class', 'foreground')
                .attr('fill', 'red')
                .attr('fill-opacity', 1);

            numberText = meter.append('text')
                .attr({
                    fill: '#666',
                    'text-anchor': 'middle',
                    'font-size': '16px',
                    dy: '.40em'
                });

            this.setState({
                foreground: foreground,
                front: front,
                numberText: numberText,
                arc: arc
            }, function () {
                foreground2.attr('d', arc2.endAngle(twoPi * (current_level - that.state.min_level) / that.state.step / 100));
                front2.attr('d', arc2.endAngle(twoPi * (current_level - that.state.min_level) / that.state.step / 100));
                numberText.text(current_level + '°C');
                that._updateCircle(current_level);


                // set left/top
                var el = document.getElementsByClassName('progress-container')[0],
                    top = el.offsetTop + el.offsetHeight,
                    left = el.offsetLeft + el.offsetWidth / 2;

                this.refs.popover.getDOMNode().style.left = left + 180 + 'px';
                this.refs.popover.getDOMNode().style.top = top - 60 + 'px';
            });
        },
        _updateCircle: function (level) {
            var twoPi = this.state.twoPi,
                arc = this.state.arc,
                percent = (level - this.state.min_level) / this.state.step / 100;

            this.state.foreground.attr('d', arc.endAngle(twoPi * percent));
            this.state.front.attr('d', arc.endAngle(twoPi * percent));
            this.state.numberText.text(level + '°C');
        },
        updateLevel: function (type) {
            var that = this;
            if (type === 'increase') {
                this.setState({current_level: this.state.current_level + 1 <= this.state.max_level ? this.state.current_level + 1 : this.state.max_level});
            } else if (type === 'decrease') {
                this.setState({current_level: this.state.current_level - 1 >= this.state.min_level ? this.state.current_level - 1 : this.state.min_level});
            } else if (type === 'max') {
                this.setState({current_level: this.state.max_level});
            } else if (type === 'min') {
                this.setState({current_level: this.state.min_level});
            }
            this.forceUpdate(function () {
                this._updateCircle(this.state.current_level);
                this.fetch({
                    model: this.getDefaultBinding(),
                    serviceId: 'devices',
                    params: {
                        level: this.state.current_level
                    },
                    success: function () {
                        that.getDefaultBinding().sub('metrics').set('level', that.state.current_level);
                    }
                }, 'exact');
            });
        },
        render: function () {
            var _ = React.DOM,
                cx = React.addons.classSet,
                binding = this.getDefaultBinding();

            return _.div({
                    className: 'overlay transparent show fixed',
                    onClick: this.hideNotificationsPopup
                },
                _.div({onClick: this.stopPropagationAndPreventDefault, ref: 'popover', className: 'popover right popover-level-selector'},
                    _.div({className: 'popover-content'},
                        _.div({className: 'header-title'}, binding.sub('metrics').val('title')),
                        _.div({className: 'center-container'},
                            _.div({ref: 'progressContainer', className: 'pie-container'}),
                            _.div({className: 'control-container'},
                                _.div({className: 'line-button'},
                                    _.span({
                                        onClick: this.updateLevel.bind(null, 'increase'),
                                        className: 'control-button increase'
                                    }, '+'),
                                    _.span({
                                        className: 'control-button max',
                                        onClick: this.updateLevel.bind(null, 'max')
                                    }, 'max')
                                ),
                                _.div({className: 'line-button'},
                                    _.span({
                                        className: 'control-button decrease',
                                        onClick: this.updateLevel.bind(null, 'decrease')
                                    }, '-'),
                                    _.span({
                                        className: 'control-button min',
                                        onClick: this.updateLevel.bind(null, 'min')
                                    }, 'min')
                                )
                            )
                        ),
                        _.div({className: 'footer-line'},
                            _.div({className: 'line-container'},
                                _.span({className: 'line red'}),
                                _.span({className: 'text'}, 'current')
                            ),
                            _.div({className: 'line-container'},
                                _.span({className: 'line blue'}),
                                _.span({className: 'text'}, 'set')
                            )
                        )
                    )
                )
            );
        }
    });
});
