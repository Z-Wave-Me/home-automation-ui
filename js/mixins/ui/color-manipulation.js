define([], function () {
    'use strict';

    return {
        /**
         * Convert HSV representation to RGB HEX string.
         * Credits to http://www.raphaeljs.com
         */
        hsv2rgb: function (hsv) {
            var R, G, B, X, C;
            var h = (hsv.h % 360) / 60;

            C = hsv.v * hsv.s;
            X = C * (1 - Math.abs(h % 2 - 1));
            R = G = B = hsv.v - C;

            h = ~~h;
            R += [C, X, 0, 0, X, C][h];
            G += [X, C, C, X, 0, 0][h];
            B += [0, 0, X, C, C, X][h];

            var r = Math.floor(R * 255);
            var g = Math.floor(G * 255);
            var b = Math.floor(B * 255);
            return { r: r, g: g, b: b, hex: "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1) };
        },
        /**
         * Convert RGB representation to HSV.
         * r, g, b can be either in <0,1> range or <0,255> range.
         * Credits to http://www.raphaeljs.com
         */
        rgb2hsv: function (rgb) {
            var r = rgb.r;
            var g = rgb.g;
            var b = rgb.b;

            if (rgb.r > 1 || rgb.g > 1 || rgb.b > 1) {
                r /= 255;
                g /= 255;
                b /= 255;
            }

            var H, S, V, C;
            V = Math.max(r, g, b);
            C = V - Math.min(r, g, b);
            H = (C === 0 ? null :
                    V == r ? (g - b) / C + (g < b ? 6 : 0) :
                    V == g ? (b - r) / C + 2 :
                (r - g) / C + 4);
            H = (H % 6) * 60;
            S = C === 0 ? 0 : C / V;
            return { h: H, s: S, v: V };
        },
        hsv2hex: function (hsv) {
            return this.hsv2rgb(hsv).hex;
        },
        rgb2hex: function (rgb) {
            return this.hsv2rgb(this.rgb2hsv(rgb)).hex;
        },
        hex2hsv: function (hex) {
            return this.rgb2hsv(this.hex2rgb(hex));
        },
        hex2rgb: function (hex) {
            return { r: parseInt(hex.substr(1, 2), 16), g: parseInt(hex.substr(3, 2), 16), b: parseInt(hex.substr(5, 2), 16) };
        }
    };
});