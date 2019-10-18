// ==UserScript==
// @name         Static AWS account switch
// @namespace    static.account.switch.aws.gonzalosr.com
// @version      0.1
// @description  Set a group of accounts and roles as static in the AWS switch role history
// @author       Gonzalo Sanchez Romero
// @match        https://console.aws.amazon.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @homepageURL  https://github.com/gonzalosr/static-account-switch-aws/
// @supportURL   https://github.com/gonzalosr/static-account-switch-aws/issues
// @updateURL    https://raw.githubusercontent.com/gonzalosr/static-account-switch-aws/master/static-account-switch-aws.user.js
// ==/UserScript==

(function() {
    'use strict';


    const defaultConfig = `
    [
        { "displayName": "dev", "roleName": "admin", "accountNumber": "", "backgroundColor": "", "labelIcon": "😁" },
        { "displayName": "test", "roleName": "admin", "accountNumber": "", "backgroundColor": "", "labelIcon": "🚀" },
        { "displayName": "staging", "roleName": "admin", "accountNumber": "", "backgroundColor": "", "labelIcon": "🚧" },
        { "displayName": "PROD", "roleName": "admin", "accountNumber": "", "backgroundColor": "", "labelIcon": "🚨" }
    ]`;

    const config = JSON.parse(defaultConfig);

    let switches=document.getElementById('awsc-username-menu-recent-roles');

    if (switches.hasChildNodes) {
        console.log("Perfect, you have at least an item in your switch role history")
    } else {
        alert("You need to switch roles at least once to use this userscript. Please switch role manually and then reload")
    }

    let csrf = switches.firstChild.firstChild.childNodes[6].value
    let redirectUri = switches.firstChild.firstChild.childNodes[7].value
    let numberOfSwitches = switches.childElementCount
    let finalHTML = "";

    for(let i = 0; i < config.length; i++){

        let account = config[i]
        let orderNumber = numberOfSwitches + i

        let switchListElement=`
            <li id="awsc-recent-role-${ orderNumber }">
                <form action="https://signin.aws.amazon.com/switchrole" method="POST" target="_top">
                    <input type="hidden" name="action" value="switchFromBasis">
                    <input type="hidden" name="src" value="nav">
                    <input type="hidden" name="roleName" value="${ account.roleName }">
                    <input type="hidden" name="account" value="${ account.accountNumber }">
                    <input type="hidden" name="mfaNeeded" value="0">
                    <input type="hidden" name="color" value="B7CA9D">
                    <input type="hidden" name="csrf" value="${ csrf }">
                    <input type="hidden" name="redirect_uri" value="${ redirectUri }">
                    <label for="awsc-recent-role-switch-${ orderNumber }" class="awsc-role-color" style="background-color: ${ account.backgroundColor };">${ account.labelIcon }</label>
                    <input type="submit" class="awsc-role-submit awsc-role-display-name" id="awsc-recent-role-switch-${ orderNumber }" name="displayName" value="${ account.displayName }" title="${ account.roleName } @ ${ account.accountNumber }">
                </form>
            </li>`;

        finalHTML = finalHTML.concat(switchListElement)

    }

    let mySwitches=document.getElementById('awsc-username-menu-recent-roles');
    mySwitches.insertAdjacentHTML('beforeend',finalHTML);


})();
