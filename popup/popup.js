'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const chkBox = document.getElementById('chkChart');

    // Load the saved state from storage and update the checkbox
    browser.storage.local.get('checkboxState').then(data => {
        chkBox.checked = data.checkboxState || true; // Default to false if nothing stored
    });

    chkBox.addEventListener('change', () => {
        // Save the current state to storage
        browser.storage.local.set({checkboxState: chkBox.checked});

        // Send a message to the content script to toggle the chart
        browser.tabs.query({active: true, currentWindow: true})
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "toggle-chart"
                });
            });
    });
});