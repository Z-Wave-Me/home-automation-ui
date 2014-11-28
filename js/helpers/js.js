define([], function () {
    'use strict';

    var Helpers = new function() {
        var Helpers = function() {

        };

        Helpers.prototype = {
            constructor: Helpers,
            extend: function(obj) {
                if (!this.isObject(obj)) return obj;
                var source, prop;
                for (var i = 1, length = arguments.length; i < length; i++) {
                    source = arguments[i];
                    for (prop in source) {
                        if (hasOwnProperty.call(source, prop)) {
                            obj[prop] = source[prop];
                        }
                    }
                }
                return obj;
            },
            defaults: function(obj) {
                if (!this.isObject(obj)) return obj;
                for (var i = 1, length = arguments.length; i < length; i++) {
                    var source = arguments[i];
                    for (var prop in source) {
                        if (obj[prop] === void 0) obj[prop] = source[prop];
                    }
                }
                return obj;
            },
            arrayUnique: function(a) {
                return a.reduce(function(p, c) {
                    if (p.indexOf(c) < 0) p.push(c);
                    return p;
                }, []);
            },
            flatten: function (array, i) {
                i = i || 0;

                if(i >= array.length)
                    return array;

                if(Array.isArray(array[i])) {
                    return this.flatten(array.slice(0,i)
                        .concat(array[i], array.slice(i+1)), i);
                }

                return this.flatten(array, i+1);
            },
            omit: function(obj) {
                var copy = {};
                var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
                for (var key in obj) {
                    if (keys.indexOf(key)) copy[key] = obj[key];
                }
                return copy;
            },
            isFloat: function isFloat(n) {
                return n === +n && n !== (n|0);
            },
            isInteger: function(n) {
                return n === +n && n === (n|0);
            },
            isObject: function(obj) {
                var type = typeof obj;
                return type === 'function' || type === 'object' && !!obj;
            },
            getNamespacesData: function (ctx, model) {
                var data_binding = ctx.getBinding().sub('data'),
                    namespaces = data_binding.sub('namespaces'),
                    options = model.options,
                    defaultObject = {
                        "focus": true,
                        "type": "object",
                        "validate": true,
                        "disabled": false,
                        "showMessages": true,
                        "collapsible": true,
                        "legendStyle": "button",
                        "toolbarSticky": true,
                        "renderForm": false
                    },
                    namespace;

                function r(obj) {
                    var key, arr = [];
                    if (obj) {
                        for (key in obj) {
                            if (typeof obj[key] === "object") {
                                r(obj[key]);
                            } else if (typeof obj[key] === 'string') {
                                if (obj[key].indexOf('namespaces') !== -1 && obj[key].split(':').length > 1) {
                                    obj[key].split(',').forEach(function (val) {
                                        var filtered = namespaces.get().filter(function (n) {
                                            return n.get('id') ===  val.split(':')[1];
                                        });

                                        if (filtered.toArray().length > 0) {
                                            namespace = filtered.toArray()[0].toJS();
                                            if (namespace) { // check that it existsd in namespaces
                                                arr = arr.concat(namespace.params.map(function (para) {
                                                    return para[val.split(':')[2]];
                                                }));
                                            }
                                        }
                                    });

                                    obj[key] = arr || [];
                                    arr = [];
                                }
                            }
                        }
                    }
                    return obj;
                }

                r(model);

                // options TODO: rewrite block
                if (options) {
                    Object.keys(defaultObject).forEach(function (key) {
                        options[key] = defaultObject[key];
                    });

                    if (options.hasOwnProperty('fields')) {
                        Object.keys(options.fields).forEach(function (key) {
                            if (!options.fields[key].hasOwnProperty('helpers')) {
                                options.fields[key].toolbarSticky = true;
                            }
                        });
                    }
                }

                return model;
            }
        };

        return Helpers;
    };

    return Helpers;
});