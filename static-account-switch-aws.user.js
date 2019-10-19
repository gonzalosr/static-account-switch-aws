// ==UserScript==
// @name         Static AWS account switch
// @namespace    static.account.switch.aws.gonzalosr.com
// @version      0.4
// @description  Set a group of accounts and roles as static in the AWS switch role history
// @author       Gonzalo Sanchez Romero
// @match        https://*console.aws.amazon.com/*
// @match        https://console.aws.amazon.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @homepageURL  https://github.com/gonzalosr/static-account-switch-aws/
// @supportURL   https://github.com/gonzalosr/static-account-switch-aws/issues
// @updateURL    https://raw.githubusercontent.com/gonzalosr/static-account-switch-aws/master/static-account-switch-aws.user.js
// ==/UserScript==


'use strict';

// Please don't edit this default config, won't persist across updates.
// Load the script once in the AWS console, then go to Storage tab and edit them.
// You can add as many accounts as you like, required items are displayName, roleName and accountNumber

const defaultConfig = `
[
    {
        "displayName": "dev",
        "roleName": "admin",
        "accountNumber": "",
        "mfaNeeded": "0",
        "navColor": "14fc03",
        "backgroundColor": "",
        "labelIcon": "😁"
    },
    {
        "displayName": "test",
        "roleName": "admin",
        "accountNumber": "",
        "mfaNeeded": "0",
        "navColor": "031cfc",
        "backgroundColor": "",
        "labelIcon": "🚀"
    },
    {
        "displayName": "staging",
        "roleName": "admin",
        "accountNumber": "",
        "mfaNeeded": "0",
        "navColor": "fcba03",
        "backgroundColor": "",
        "labelIcon": "🚧"
    },
    {
        "displayName": "PROD",
        "roleName": "admin",
        "accountNumber": "",
        "mfaNeeded": "0",
        "navColor": "fc0303",
        "backgroundColor": "",
        "labelIcon": "🚨"
    }
]
`;

(async function() {
    let userConfig = await GM.getValue('userConfig');

    if (!userConfig) {
        userConfig = defaultConfig;
        GM.setValue('userConfig', userConfig);
    }

    const config = JSON.parse(userConfig);

    let switches=document.getElementById('awsc-username-menu-recent-roles');

    if (switches.hasChildNodes) {
        console.log("Perfect, you have at least an item in your switch role history")
    } else {
        alert("You need to switch roles at least once to use this userscript. Please switch role manually and then reload")
    }

    let csrf = switches.firstChild.firstChild.childNodes[6].value
    let redirectUri = switches.firstChild.firstChild.childNodes[7].value
    let numberOfSwitches = switches.childElementCount
    let listNumber = 0
    let finalHTML = `<div class="awsc-account-display-section awsc-username-menu-section">Static Accounts</div>`;

    for(let key in config){

        let account = config[key]
        let orderNumber = numberOfSwitches + listNumber++

        let switchListElement=`
            <li id="awsc-recent-role-${ orderNumber }">
                <form action="https://signin.aws.amazon.com/switchrole" method="POST" target="_top">
                    <input type="hidden" name="action" value="switchFromBasis">
                    <input type="hidden" name="src" value="nav">
                    <input type="hidden" name="roleName" value="${ account.roleName }">
                    <input type="hidden" name="account" value="${ account.accountNumber }">
                    <input type="hidden" name="mfaNeeded" value="${ account.mfaNeeded }">
                    <input type="hidden" name="color" value="${ account.navColor }">
                    <input type="hidden" name="csrf" value="${ csrf }">
                    <input type="hidden" name="redirect_uri" value="${ redirectUri }">
                    <label for="awsc-recent-role-switch-${ orderNumber }" class="awsc-role-color" style="background-color: ${ account.backgroundColor };">${ account.labelIcon }</label>
                    <input type="submit" class="awsc-role-submit awsc-role-display-name" id="awsc-recent-role-switch-${ orderNumber }" name="displayName" value="${ account.displayName }" title="${ account.roleName } @ ${ account.accountNumber }">
                </form>
            </li>`;

        finalHTML = finalHTML.concat(switchListElement);

    }

    finalHTML = finalHTML.concat(`<div class="awsc-account-display-section awsc-username-menu-section"></div>`);
    let mySwitches=document.getElementById('awsc-username-menu-recent-roles');
    mySwitches.insertAdjacentHTML('beforeend',finalHTML);

    // Rest of this script Copyright 2018 Tom Bamford. https://github.com/manicminer/userscript-aws-console-colors
    let s = 1.0, l = 0.25;

    function determineNewColor(rgbColor) {
        let f = rgbColor.split(","), r = parseInt(f[0].slice(4)), g = parseInt(f[1]), b = parseInt(f[2]);
        r /= 255; g /= 255; b /= 255;
        let h, max = Math.max(r, g, b), min = Math.min(r, g, b);
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return 'hsl(' + Math.floor(h * 360) + ',' + Math.floor(s * 100) + '%,' + Math.floor(l * 100) + '%)';
    }

    let switcherClass = 'awsc-switched-role-username-wrapper';
    let roleElems = document.getElementsByClassName(switcherClass);
    if (roleElems.length == 1) {
        let bgColor = roleElems[0].style.backgroundColor;
        let newBgColor = determineNewColor(bgColor);
        let navSelector = '#nav-menubar, #nav-menu-right, .nav-menu, .nav-menu-separator';
        let menuBarElems = document.querySelectorAll(navSelector);
        for (let i = 0; i < menuBarElems.length; i++) {
            menuBarElems[i].style.backgroundColor = newBgColor;
        }
    }

})();


