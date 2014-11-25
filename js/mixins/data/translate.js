define([], function () {
    'use strict';

    return {
        gls: function (key, type) {
            var default_language = this.getDefaultLang(),
                languages_binding = this.getMoreartyContext().getBinding().sub('data.languages'),
                index_lang = languages_binding.get().findIndex(function (lang) {
                    return lang.get('id') === default_language;
                }),
                lang = index_lang !== -1 ? languages_binding.get(index_lang + '.data') : null,
                text;

            if (key && lang) {
                text = String(lang.get(key) || 'no_ts');

                if (type && text) {
                    if (type === 'capitalize') {
                        return this._capitalize(text);
                    } else if (type === 'case') {
                        return this._toCase(text);
                    } else if (type === 'upper') {
                        return text.toUpperCase();
                    } else if (type === 'lower') {
                        return text.toLowerCase();
                    } else {
                        return text;
                    }
                } else {
                    return text;
                }
            } else {
                return null;
            }
        },
        getDefaultLang: function () {
            return this.getMoreartyContext().getBinding().sub('default.system.current_language').get();
        },
        _capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
        },
        _toCase: function (str) {
            var that = this;
            return str.replace(/\w\S*/g, function(str) { return that._capitalize(str); });
        }
    };
});
