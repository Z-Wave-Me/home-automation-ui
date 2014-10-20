define([
    // libs
    'morearty',
    'd3',
    // mixins
    'mixins/sync/sync-layer',
    'mixins/ui/color-manipulation'
], function (
    // libs
    Morearty,
    d3,
    // mixins
    SyncLayerMixin,
    ColorManipulationMixins
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, SyncLayerMixin, ColorManipulationMixins],
        options: {
            hueOffset: 15,
            h: 0,
            s: 1,
            v: 1,
            mouse: {
                x: 0,
                y: 0
            }
        },
        onClickSlideHandler: function (event) {
            event && event.preventDefault();
            var slide_element = this.refs.slide.getDOMNode(),
                picker_element = this.refs.picker.getDOMNode(),
                mouse_positions = this._getClickPosition(event),
                sliderIndicator_element = this.refs.slideIndicator.getDOMNode(),
                mouse_y = mouse_positions.y;

            this.options.s = mouse_y / slide_element.offsetHeight * 360 + this.options.hueOffset;

            var pickerColor = this.hsv2rgb({ h: this.options.h, s: 1, v: 1 }),
                c = this.hsv2rgb({ h: this.options.h, s: this.options.s, v: this.options.v });

            sliderIndicator_element.style.top = (mouse_y - sliderIndicator_element.offsetHeight/2) + 'px';
            picker_element.style.backgroundColor = pickerColor.hex;
            this.onClickPickerHandler(null, this.options.mouse);
        },
        onClickPickerHandler: function (event, positions) {
            event && event.preventDefault();
            var picker_element = this.refs.picker.getDOMNode(),
                pickerIndicator_element = this.refs.pickerIndicator.getDOMNode(),
                mouse_positions = positions.hasOwnProperty('x') ? positions : this._getClickPosition(event),
                width = picker_element.offsetWidth,
                height = picker_element.offsetHeight,
                mouse_x = mouse_positions.x,
                mouse_y = mouse_positions.y;

            this.options.s = mouse_x / width;
            this.options.v = (height - mouse_y) / height;
            this.options.mouse = {
                x: mouse_x,
                y: mouse_y
            };

            var c = this.hsv2rgb(this.options);
            this.setColor({r: c.r, g: c.g, b: c.b});
            pickerIndicator_element.style.top = (mouse_y - pickerIndicator_element.offsetHeight/2) + 'px';
            pickerIndicator_element.style.left = (mouse_x - pickerIndicator_element.offsetWidth/2) + 'px';

            return false;
        },
        _getClickPosition: function (event) {
            var parentPosition = this._getPosition(event.currentTarget);
            var xPosition = event.clientX - parentPosition.x;
            var yPosition = event.clientY - parentPosition.y;

            return {x: xPosition, y: yPosition};
        },
        _getPosition: function (element) {
            var xPosition = 0;
            var yPosition = 0;

            while (element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            return { x: xPosition, y: yPosition };
        },
        setColor: function (rgb) {
            this.getDefaultBinding().set(Immutable.fromJS(rgb));
            this.props.handler(rgb);
        },
        componentDidMount: function () {
//            var binding = this.getDefaultBinding(),
//                rgb = binding.sub('metrics').sub('color').toJS(),
//                hsv = this.rgb2hsv(rgb),
//                hex = this.rgb2hex(rgb),
//                picker_element = this.refs.picker.getDOMNode(),
//                pickerIndicator_element = this.refs.pickerIndicator.getDOMNode(),
//                slide_element = this.refs.slide.getDOMNode(),
//                sliderIndicator_element = this.refs.slideIndicator.getDOMNode();
//
//            this.setState({
//                h: hsv.h % 360,
//                s: hsv.s,
//                v: hsv.v
//            });
//
//            sliderIndicator_element.style.top = (this.state.h * slide_element.offsetHeight) / 360;
        },
        render: function () {
            var _ = React.DOM,
                cx = React.addons.classSet;

            return _.div({key:'picker-container', className: 'picker-container cp-default'},
                _.div({key:'picker-wrapper', className: 'picker-wrapper'},
                    _.div({key:'picker', ref: 'picker', className: 'picker', onClick: this.onClickPickerHandler},
                        _.svg({width: '100%', height: '100%'},
                            _.defs({},
                                _.linearGradient({
                                    id: 'gradient-black',
                                    x1: '0%',
                                    y1: '100%',
                                    x2: '0%',
                                    y2: '0%'
                                },
                                    _.stop({ offset: '0%', 'stopColor': '#000000', 'stopOpacity': '1' }),
                                    _.stop({ offset: '100%', 'stopColor': '#CC9A81', 'stopOpacity': '0' })
                                ),
                                _.linearGradient({
                                    id: 'gradient-white',
                                    x1: '0%',
                                    y1: '100%',
                                    x2: '100%',
                                    y2: '100%'
                                },
                                    _.stop({ offset: '0%', 'stopColor': '#FFFFFF', 'stopOpacity': '1' }),
                                    _.stop({ offset: '100%', 'stopColor': '#CC9A81', 'stopOpacity': '0' })
                                )
                            ),
                            _.rect({
                                x: 0,
                                y: 0,
                                width: '100%',
                                height: '100%',
                                fill: 'url(#gradient-white)'
                            }),
                            _.rect({
                                x: 0,
                                y: 0,
                                width: '100%',
                                height: '100%',
                                fill: 'url(#gradient-black)'
                            })
                        )
                    ),
                    _.div({key:'picker-indicator', ref: 'pickerIndicator', className: 'picker-indicator'})
                ),
                _.div({key: 'slide-wrapper', className: 'slide-wrapper'},
                    _.div({key:'slide', ref: 'slide', className: 'slide', onClick: this.onClickSlideHandler},
                        _.svg({width: '100%', height: '100%'},
                            _.defs({},
                                _.linearGradient({
                                        id: 'gradient-hsv',
                                        x1: '0%',
                                        y1: '100%',
                                        x2: '0%',
                                        y2: '0%'
                                    },
                                    _.stop({ offset: '0%', 'stopColor': '#FF0000', 'stopOpacity': '1' }),
                                    _.stop({ offset: '13%', 'stopColor': '#FF00FF', 'stopOpacity': '1' }),
                                    _.stop({ offset: '25%', 'stopColor': '#8000FF', 'stopOpacity': '1' }),
                                    _.stop({ offset: '38%', 'stopColor': '#0040FF', 'stopOpacity': '1' }),
                                    _.stop({ offset: '50%', 'stopColor': '#00FFFF', 'stopOpacity': '1' }),
                                    _.stop({ offset: '63%', 'stopColor': '#00FF40', 'stopOpacity': '1' }),
                                    _.stop({ offset: '75%', 'stopColor': '#0BED00', 'stopOpacity': '1' }),
                                    _.stop({ offset: '88%', 'stopColor': '#FFFF00', 'stopOpacity': '1' }),
                                    _.stop({ offset: '100%', 'stopColor': '#FF0000', 'stopOpacity': '1' })
                                )
                            ),
                            _.rect({
                                x: 0,
                                y: 0,
                                width: '100%',
                                height: '100%',
                                fill: 'url(#gradient-hsv)'
                            })
                        )
                    ),
                    _.div({key: 'slideIndicator', ref: 'slideIndicator', className: 'slide-indicator'})
                )
            );
        }
    });
});
