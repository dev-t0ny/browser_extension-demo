'use strict';
const chkBox = document.getElementById('chkChart');
const chkUseless = document.getElementById('chkUseless');
function setChkState(e) {
    chkBox.checked = e.chkState;
}

function setChkUseless(e) {
    chkUseless.checked = e.chkUseless;
}

function error(e) {
    console.log(e);
}

window.addEventListener('DOMContentLoaded', () => {

    let sendPromise = browser.storage.sync.get('chkState');
    sendPromise.then(setChkState, error);

    chkBox.addEventListener('change', () => {

        if (chkBox.checked) {
            let sendPromise = browser.storage.sync.set({ 'chkState': true });
            sendPromise.then((e) => { console.log('successfuly written to ' + e) }, error);
        }
        else {
            let sendPromise = browser.storage.sync.set({ 'chkState': false });
            sendPromise.then((e) => { console.log('successfuly written to ' + e) }, error);
        }

        // Send a message to the content script to toggle the chart
        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "toggle-chart"
                });
            });
    });

    sendPromise = browser.storage.sync.get('chkUseless');
    sendPromise.then(setChkUseless, error);

    chkUseless.addEventListener('change', () => {

        if (chkUseless.checked) {
            let sendPromise = browser.storage.sync.set({ 'chkUseless': true });
            sendPromise.then((e) => { console.log('successfuly written to ' + e) }, error);
        }
        else {
            let sendPromise = browser.storage.sync.set({ 'chkUseless': false });
            sendPromise.then((e) => { console.log('successfuly written to ' + e) }, error);
        }

        // Send a message to the content script to toggle the chart
        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "toggle-useless"
                });
            });
    })
});