ZWay Home Automation UI
=============
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/Z-Wave-Me/home-automation?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Introduction #
UI for Z-Way Automation Server

## Links

API Documentation: http://docs.zwayhomeautomation.apiary.io/

Issues, bugs and feature requests are welcome: https://github.com/Z-Wave-Me/home-automation-ui/issues

## Precompiling client-side application

    -   Install node.js

    -   Install npm-packages

        $ cd /path/to/automationFolder
        $ sudo npm install -g gulp && npm install

    -   Compile front-end to /path/to/automationFolder/dist.

        $ gulp

## Other task

    -   Start developer web server
    
        $ gulp develop_server
    
    -   Validation JS
    
        $ gulp validate