'use strict';
const chkBox = document.getElementById('chkChart');
function setChkState(e) {
    chkBox.checked = e.chkState;
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
});