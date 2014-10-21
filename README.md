[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/Z-Wave-Me/home-automation?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

ZWay Home Automation UI
=============

* [Introduction](#introduction)
* [Links](#links)
* [Changelog](#changelog)
* [Gulp](#gulp)
    * [Build](#build)
    * [Other task](#other-task)
    
# Introduction #
UI for Z-Way Automation Server

# Links #

API Documentation: http://docs.zwayhomeautomation.apiary.io/

Issues, bugs and feature requests are welcome: https://github.com/Z-Wave-Me/home-automation-ui/issues

# Changelog #
* 2.0.0rc3 - Thermostat(beta) and Color picker widget(alpha). Update morearty to 0.4.5 and Immutable 2.5
* 2.0.0rc1-rc2 - Initial new version. Update Readme.md

# Gulp #
    ## Build ##
    
    -   Install node.js

    -   Install npm-packages

        $ cd /path/to/automationFolder
        $ sudo npm install --global gulp bower && npm install && gulp

    -   Compile front-end to /path/to/automationFolder/dist.

        $ gulp

    ## Other task ##

    -   Start developer web server
    
        $ gulp develop_server
    
    -   Validation JS
    
        $ gulp validate