define([
    // mixins
    'mixins/sync/sync-layer',
    'mixins/data/manipulation',
    'mixins/ui/color-manipulation',
    'mixins/ui/popup'
], function (
    // mixins
    SyncLayerMixin,
    DataManipulationMixin,
    ColorManipulationMixin,
    PopupMixin
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, SyncLayerMixin, DataManipulationMixin, ColorManipulationMixin, PopupMixin],
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
        componentDidUpdate: function (props, state) {
            if (this.state.dragging && !state.dragging) {
                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);
            } else if (!this.state.dragging && state.dragging) {
                document.removeEventListener('mousemove', this.onMouseMove);
                document.removeEventListener('mouseup', this.onMouseUp);
            }
        },
        getDefaultProps: function () {
            return {
                // allow the initial position to be passed in as a prop
                initialPos: {x: 0, y: 0}
            };
        },
        getInitialState: function () {
            return {
                pos: this.props.initialPos,
                dragging: false,
                rel: null // position relative to the cursor
            };
        },
        onClickSlideHandler: function (event) {
            event && event.preventDefault();
            var slide_element = this.refs.slide.getDOMNode(),
                picker_element = this.refs.picker.getDOMNode(),
                mouse_positions = this._getClickPosition(event),
                sliderIndicator_element = this.refs.slideIndicator.getDOMNode(),
                mouse_y = mouse_positions.y;

            this.options.h = mouse_y / slide_element.offsetHeight * 360 + this.options.hueOffset;

            var pickerColor = this.hsv2rgb({ h: this.options.h, s: 1, v: 1 }),
                c = this.hsv2rgb({ h: this.options.h, s: this.options.s, v: this.options.v });

            sliderIndicator_element.style.top = (mouse_y - sliderIndicator_element.offsetHeight / 2) + 'px';
            picker_element.style.backgroundColor = pickerColor.hex;
        },
        onClickPickerHandler: function (event, positions) {
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

            if (this.isMounted()) {
                this.forceUpdate();
            }
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
            var binding = this.getDefaultBinding(),
                rgb = binding.toJS(),
                hsv = this.rgb2hsv(rgb),
                hex = this.rgb2hex(rgb),
                picker_element = this.refs.picker.getDOMNode(),
                pickerIndicator_element = this.refs.pickerIndicator.getDOMNode(),
                slide_element = this.refs.slide.getDOMNode(),
                sliderIndicator_element = this.refs.slideIndicator.getDOMNode();

            this.extend(this.options, {
                h: hsv.h % 360,
                s: hsv.s,
                v: hsv.v
            });

            pickerIndicator_element.style.top = picker_element.offsetHeight - this.options.v * picker_element.offsetHeight + 'px';
            pickerIndicator_element.style.left = this.options.s * picker_element.offsetWidth + 'px';
            sliderIndicator_element.style.top = (this.options.h * slide_element.offsetHeight) / 360 + 'px';
            picker_element.style.backgroundColor = hex;
        },
        // calculate relative position to the mouse and set dragging=true
        onMouseDown: function (el, e) {
            // only left mouse button
            if (e.button !== 0) {
                e.preventDefault();
                return false;
            }
            var pos = $(this.refs.picker.getDOMNode()).offset();
            this.setState({
                dragging: true,
                el: el,
                rel: {
                    x: e.pageX - pos.left,
                    y: e.pageY - pos.top
                }
            });
            this.forceUpdate();
            e.stopPropagation();
            e.preventDefault();
        },
        onMouseUp: function (e) {
            if (this.isMounted()) {
                this.setState({dragging: false});
            }
            e.stopPropagation();
            e.preventDefault();
        },
        onMouseMove: function (e) {
            if (!this.state.dragging) return;
            if (this.state.el === 'picker') {
                this.onDraggablePickerIndicator(e);
            } else if (this.state.el === 'slide') {
                this.onDraggableSlideIndicator(e);
            } else {
                e.preventDefault();
            }

            this.setState({
                pos: {
                    x: e.pageX - this.state.rel.x,
                    y: e.pageY - this.state.rel.y
                }
            });
            this.forceUpdate
            e.stopPropagation();
            e.preventDefault();
        },
        onDraggablePickerIndicator: function (e) {
            var x = e.offsetX,
                y = e.offsetY,
                pickerIndicator_element = this.refs.pickerIndicator.getDOMNode();

            pickerIndicator_element.style.left = (x - pickerIndicator_element.offsetWidth/2) + 'px';
            pickerIndicator_element.style.top = (y - pickerIndicator_element.offsetHeight/2) + 'px';
        },
        onDraggableSlideIndicator: function (e) {
            var y = e.offsetY,
                slide_element = this.refs.slide.getDOMNode(),
                picker_element = this.refs.picker.getDOMNode(),
                sliderIndicator_element = this.refs.slideIndicator.getDOMNode();

            if (y > 100) {
                y = 100;
            } else if (y < 0) {
                y = 0;
            }

            this.options.h = y / slide_element.offsetHeight * 360 + this.options.hueOffset;
            picker_element.style.backgroundColor = this.hsv2rgb({ h: this.options.h, s: 1, v: 1 }).hex;
            sliderIndicator_element.style.top = (y - sliderIndicator_element.offsetHeight / 2) + 'px';
        },
        render: function () {
            var _ = React.DOM,
                cx = React.addons.classSet;

            return _.div({onClick: this.stopPropagationAndPreventDefault, key:'picker-container', className: 'picker-container cp-small'},
                _.div({key:'picker-wrapper', className: 'picker-wrapper'},
                    _.div({onMouseDown: this.onMouseDown.bind(this, 'picker'), key:'picker', ref: 'picker', className: 'picker', onClick: this.onClickPickerHandler},
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
                    _.div({onMouseDown: this.onMouseDown.bind(this, 'slide'), key:'slide', ref: 'slide', className: 'slide', onClick: this.onClickSlideHandler},
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
