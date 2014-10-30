define([], function () {
    'use strict';

    return {
        nowShowing: 'dashboard', // start route
        // system
        system: {
            network_connected: false,
            loaded: false,
            loaded_lang_files: false,
            loaded_percentage: 0,
            languages: ['en', 'ru', 'de'],
            path_lang_file: '/public/lang',
            current_language: localStorage.getItem('currentLanguage') || 'en'
        },
        // notifications
        notifications: {
            count: 0,
            severity: 'ok',
            show_popup: false,
            severity_modes: {
                'error_connection': {
                    message: 'No connection',
                    color: 'red'
                },
                ok: {
                    message: 'Ok',
                    color: 'grey'
                },
                warning: {
                    message: 'Warning',
                    color: 'yellow'
                },
                critical: {
                    message: 'Critical',
                    color: 'red'
                },
                debug: {
                    message: 'Debug',
                    color: 'blue'
                }
            },
            filters: {
                ok: true,
                warning: true,
                critical: true,
                debug: true
            },
            full_view_notice_id: null
        },
        // menu settings
        primaryFilter: 'all',
        secondaryFilter: '',
        searchStringMainPanel: '',
        //
        overlayShow: false,
        overlayShowName: null
    };
});

