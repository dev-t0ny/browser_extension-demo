'use strict';
/* global browser */

const chkBox = document.getElementById('chkChart');
const chkUseless = document.getElementById('chkUseless');
const chkHelper = document.getElementById('chkHelper');
/**
 * Sets chart checkBox
 * @param {*} e promise
 */
function setChkState(e) {
    chkBox.checked = e.chkState;
}
/**
 * Sets useless infos checkBox
 * @param {*} e promise
 */
function setChkUseless(e) {
    chkUseless.checked = e.chkUseless;
}
/**
 * Sets helper checkBox
 * @param {*} e promise
 */
function setChkHelper(e) {
    chkHelper.checked = e.chkHelper;
}
/**
 * 
 * @param {*} e promise error
 */
function error(e) {
    console.log(e);
}

window.addEventListener('DOMContentLoaded', () => {

    let sendPromise = browser.storage.sync.get('chkState');
    sendPromise.then(setChkState, error);

    chkBox.addEventListener('change', () => {

        if (chkBox.checked) {
            let sendPromise = browser.storage.sync.set({ 'chkState': true });
            sendPromise.then((e) => { console.log('successfuly written to ' + e); }, error);
        }
        else {
            let sendPromise = browser.storage.sync.set({ 'chkState': false });
            sendPromise.then((e) => { console.log('successfuly written to ' + e); }, error);
        }


        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: 'toggle-chart'
                });
            });
    });

    sendPromise = browser.storage.sync.get('chkUseless');
    sendPromise.then(setChkUseless, error);

    chkUseless.addEventListener('change', () => {

        if (chkUseless.checked) {
            let sendPromise = browser.storage.sync.set({ 'chkUseless': true });
            sendPromise.then((e) => { console.log('successfuly written to ' + e); }, error);
        }
        else {
            let sendPromise = browser.storage.sync.set({ 'chkUseless': false });
            sendPromise.then((e) => { console.log('successfuly written to ' + e); }, error);
        }


        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: 'toggle-useless'
                });
            });
    });

    sendPromise = browser.storage.sync.get('chkHelper');
    sendPromise.then(setChkHelper, error);

    chkHelper.addEventListener('change', () => {

        if (chkHelper.checked) {
            let sendPromise = browser.storage.sync.set({ 'chkHelper': true });
            sendPromise.then((e) => { console.log('successfuly written to ' + e); }, error);
        }
        else {
            let sendPromise = browser.storage.sync.set({ 'chkHelper': false });
            sendPromise.then((e) => { console.log('successfuly written to ' + e); }, error);
        }

        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: 'toggle-helper'
                });
            });
    });
});