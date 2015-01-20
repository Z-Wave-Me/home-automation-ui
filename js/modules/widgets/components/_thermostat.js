define([
    // libs
    'd3',
    // components
    '../common/level_selector',
    // mixins
    'mixins/sync/sync-layer'
], function (
    // libs
    d3,
    // components
    LevelSelector,
    // mixins
    SyncLayerMixin
    ) {
    'use strict';

    return React.createClass({
        _serviceId: 'devices',
        mixins: [Morearty.Mixin, SyncLayerMixin],
        getInitialState: function () {
            var metrics_binbind = this.getDefaultBinding().sub('metrics'),
                min_level = parseInt(metrics_binbind.get('min')),
                max_level = parseInt(metrics_binbind.get('max')),
                level = parseInt(metrics_binbind.get('level'));

            return {
                twoPi: Math.PI * 2,
                min_level: min_level,
                max_level: max_level,
                current_level: level,
                step: (max_level - min_level) / 100
            };
        },
        hidePopup: function () {
            this.getMoreartyContext()
                .getBinding()
                .sub('default')
                .sub('show_popup_' + this.getDefaultBinding().get('id')).set(false);
            if (this.isMounted()) {
                this.forceUpdate();
            }
            return false;
        },
        componentWillMount: function () {
            var that = this,
                default_binding = this.getMoreartyContext().getBinding().sub('default');

            that.getDefaultBinding().addListener('metrics.level', function (cd) {
                that.updateTemperature(that.getDefaultBinding().get('metrics.level'), cd.getPreviousValue());
            });

            default_binding.set('show_popup_' + that.getDefaultBinding().get('id'), false);
        },
        componentWillUnmount: function () {
            var that = this,
                default_binding = this.getMoreartyContext().getBinding().sub('default');

            default_binding.delete('show_popup_' + that.getDefaultBinding().get('id'));
        },
        componentDidMount: function () {
            var that = this,
                color = '#40e8f0',
                radius = 20,
                border = 5,
                twoPi = this.state.twoPi,
                boxSize = '40',
                parent = d3.select(this.refs.progressContainer.getDOMNode()),
                current_level = this.state.current_level,
                arc, svg, defs, g, meter, foreground, front, numberText;

            arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(radius)
                .outerRadius(radius - border);

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

            foreground = meter.append('path')
                .attr('class', 'foreground')
                .attr('fill', color)
                .attr('fill-opacity', 1)
                .attr('stroke', color)
                .attr('stroke-width', 5)
                .attr('stroke-opacity', 1)
                .attr('filter', 'url(#blur)');

            front = meter.append('path')
                .attr('class', 'foreground')
                .attr('fill', color)
                .attr('fill-opacity', 1);

            numberText = meter.append('text')
                .attr({
                    fill: '#666',
                    'text-anchor': 'middle',
                    'font-size': '11px',
                    dy: '.40em'
                });

            this.setState({
                foreground: foreground,
                front: front,
                numberText: numberText,
                arc: arc
            }, function () {
                that.updateTemperature(current_level);
            });
        },
        updateTemperature: function (level) {
            var that = this,
                step = that.state.step;

            level = parseInt(level, 10);
            if (that.isMounted()) {
                that._updateCircle(level, (level - that.state.min_level) / step / 100);
            }
        },
        _updateCircle: function (level, percent) {
            var twoPi = this.state.twoPi,
                arc = this.state.arc;

            this.state.foreground.attr('d', arc.endAngle(twoPi * percent));
            this.state.front.attr('d', arc.endAngle(twoPi * percent));
            this.state.numberText.text(level + '℃');
        },
        showSettings: function () {
            this.getMoreartyContext()
                .getBinding()
                .sub('default')
                .set('show_popup_' + this.getDefaultBinding().get('id'), true);
            this.forceUpdate();
        },
        render: function () {
            var that = this,
                _ = React.DOM,
                binding = this.getDefaultBinding(),
                title = binding.get('metrics.title'),
                level = binding.sub('metrics.level'),
                show_binding = this.getMoreartyContext()
                    .getBinding()
                    .sub('default')
                    .sub('show_popup_' + binding.get('id'));

            return (
                _.div({className: 'content'},
                    _.span({className: 'title-container'}, title),
                    _.div({
                        className: 'progress-container',
                        ref: 'progressContainer',
                        onClick: this.showSettings
                    }),
                    show_binding.get() ? _.div({className: 'overlay transparent show fixed', onClick: this.hidePopup},
                        LevelSelector({
                            binding: {
                                default: binding
                            },
                            show: show_binding
                        })
                    ) : null
                )
            );
        }
    });
});
