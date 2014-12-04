[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/Z-Wave-Me/home-automation?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/Z-Wave-Me/home-automation-ui.svg?branch=master)](https://travis-ci.org/Z-Wave-Me/home-automation-ui)
[![Code Climate](https://codeclimate.com/github/Z-Wave-Me/home-automation-ui/badges/gpa.svg)](https://codeclimate.com/github/Z-Wave-Me/home-automation-ui)
ZWay Home Automation UI
=============

* [Introduction](#introduction)
* [Links](#links)
* [Changelog](#changelog)
* [Gulp](#gulp)
    * [Build](##build)
    * [Other task](##other-task)
    
# Introduction #
UI for Z-Way Automation Server

# Links #

API Documentation: http://docs.zwayhomeautomation.apiary.io/

Issues, bugs and feature requests are welcome: https://github.com/Z-Wave-Me/home-automation-ui/issues

# Changelog #
* 2.0.0rc11
    - Morearty 0.7.4
    - React 0.12.1
    - requirejs with jsx
    - bugfixes
* 2.0.0rc8-rc10
    - Fixes doorlock, switch
    - Fix TranslationMixin
    - Minor fixes
* 2.0.0rc7
    - Localization
    - Upgrade lib:
        Morearty 0.5
        Immutable 3.0.0
    - Gulp. Replace rimraf. Update manifest.
* 2.0.0rc6 (Maintenance release)
    - Add Code Climat
    - Minor fixes
* 2.0.0rc5
    - Updated morearty to 0.4.7
    - Integrated travis-ci
    - Removed CHANGELOG.md
* 2.0.0rc4
    - Thermostat stable
    - ColorPicker stable
    - Integration with travis-ci
* 2.0.0rc3 - Thermostat(beta) and Color picker widget(alpha). Update morearty to 0.4.5 and Immutable 2.5
* 2.0.0rc1-rc2 - Initial new version. Update Readme.md

# Gulp #
    ## Build ##
    
    -    Install nodejs
    
         $ sudo add-apt-repository -y ppa:chris-lea/node.js
         $ sudo apt-get -y update
         $ sudo apt-get -y install nodejs

    -   Install npm-packages

        $ cd /path/to/automationFolder
        $ sudo npm install -g gulp bower && npm install && gulp

    -   Compile front-end to /path/to/automationFolder/dist.

        $ gulp

    ## Other task ##

    -   Start developer web server
    
        $ gulp develop_server
    
    -   Validation JS
    
        $ gulp validate
