'use strict';
/* global browser */

const messyBr = document.getElementsByTagName('br');
const brArray = Array.from(messyBr);  // Convert the live HTMLCollection to a static array
const rightSec = document.getElementsByClassName('section-droite');
const leftSec = document.getElementsByClassName('parent-menu-gauche');
for (let brTag of brArray) {
    if (!brTag.parentElement.classList.contains('right-section')) {
        brTag.remove();
    }
}

let classListDOM = document.getElementsByClassName('section-spacing');
let classListUser = [];

let canvaElement = document.createElement('canvas');
canvaElement.id = 'myChart';
canvaElement.width = '1200';
canvaElement.height = '400';
canvaElement.style = 'display: inline;';
let secCentre = document.getElementsByClassName('section-centre')[0];
let cards = document.getElementsByClassName('classes-wrapper')[0];
secCentre.style.alignItems = 'start';
cards.style.marginLeft = '0';
cards.style.marginRight = 'auto';
secCentre.appendChild(canvaElement);

if (classListDOM.length != 0) {
    for (let i = 0; i < classListDOM.length; i++) {
        classListUser.push(
            {
                name: classListDOM[i].getElementsByClassName('card-panel-title')[0].textContent,
                grade: classListDOM[i].getElementsByClassName('pourcentage')[0].textContent,
                average: classListDOM[i].getElementsByClassName('note-principale')[1].textContent
            });
    }
    // Get the canvas element and its context
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    const data = classListUser;
    // Calculate the maximum grade to determine chart scaling
    const maxValue = Math.max(...data.map(item => parseInt(item.grade))) + 10;

    // Settings for the chart
    const chartWidth = 1200;
    const barWidth = 50;
    const barSpacing = 80;
    const chartHeight = 400;
    const scaleFactor = (chartHeight - 50) / maxValue;
    const baseHeight = chartHeight - 30;

    // Draw bars
    data.forEach((item, index) => {

        let currentGrade = parseInt(item.grade.substring(0, 2));
        if (currentGrade > 60) {
            ctx.fillStyle = '#4A90E2';
        }
        else if (currentGrade > 45) {
            ctx.fillStyle = '#FFBF00';
        }
        else {
            ctx.fillStyle = '#C70039';
        }

        const barHeight = parseInt(item.grade) * scaleFactor;
        const x = 60 + index * (barWidth + barSpacing);
        const y = baseHeight - barHeight;

        ctx.fillRect(x, y, barWidth, barHeight);

        // Add labels over each bar
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(item.grade, x + barWidth / 2, baseHeight - 50);

        // Add labels below each bar
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(item.name.substring(10, 15), x + barWidth, baseHeight + 20);

        const currentAverage = item.average.substring(0, 2);

        //if there's an average, add a column
        if (!currentAverage.includes('-')) {
            ctx.fillStyle = '#808080';
            const averageBarHeight = parseInt(currentAverage) * scaleFactor;
            const averageX = x + barWidth + 10;
            ctx.fillRect(averageX, baseHeight - averageBarHeight, barWidth - 20, averageBarHeight);
            ctx.fillStyle = '#000';
            ctx.fillText(currentAverage + '%', averageX + 15, baseHeight - 50);
        }
    });
    ctx.beginPath();
    ctx.moveTo(40, 30);
    ctx.lineTo(40, baseHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(40, baseHeight);
    ctx.lineTo(chartWidth - 100, baseHeight);
    ctx.stroke();
}
secCentre.style.flexDirection = 'column';
/**
 * Sets canva's visibility
 * @param {*} e promis
 */
function setVisibility(e) {
    console.log(e);
    if (e.chkState) {
        canvaElement.style.display = 'inline';

    }
    else {
        canvaElement.style.display = 'none';
 
    }
}
/**
 * Sets side sections visibility
 * @param {*} e event
 */
function setSideSections(e) {
    console.log(e);
    if (e.chkUseless) {
        for (let element of rightSec)
        {
            element.style.display = 'inline';
        }
        for (let element of leftSec)
        {
            element.style.display = 'inline';
        }
        
        let secCentre = document.getElementsByClassName('section-centre')[0];

        secCentre.style.width = '50rem';
        cards.style.display = 'inline';
        cards.style.gap = '0';
        document.querySelector('.classes-titre').style.display = 'inline';

    }
    else {
        for (let element of rightSec)
        {
            element.style.display = 'none';
        }
        for (let element of leftSec)
        {
            element.style.display = 'none';
        }

        let secCentre = document.getElementsByClassName('section-centre')[0];
        secCentre.style.width = 'auto';
        cards.style.display = 'grid';
        cards.style.gridTemplateColumns = 'auto auto auto auto';
        cards.style.gap = '1.5rem';
        document.querySelector('.classes-titre').style.display = 'none';
    }
}

let prendreState = browser.storage.sync.get('chkState');
prendreState.then(setVisibility, (e) => { console.log(e);});

prendreState = browser.storage.sync.get('chkUseless');
prendreState.then(setSideSections, (e) => { console.log(e);});


// Listen for messages from the popup script
browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'toggle-chart') {
        // Toggle visibility based on current state
        canvaElement.style.display = (canvaElement.style.display === 'inline') ? 'none' : 'inline';

    }
    else if (message.command === 'toggle-useless') {
        let secCentre = document.getElementsByClassName('section-centre')[0];

        for (let element of rightSec)
        {
            element.style.display = (element.style.display === 'inline') ? 'none' : 'inline';
        }

        

        for (let element of leftSec)
        {
            element.style.display = (element.style.display === 'inline') ? 'none' : 'inline';
        }
        
        if (rightSec[0].style.display === 'inline')
        {

            cards.style.marginLeft = '2rem';
            cards.style.marginRight = '0';
            secCentre.style.width = '50rem';
            cards.style.display = 'inline';
            cards.style.gap = '0';
            document.querySelector('.classes-titre').style.display = 'inline';
        }
        else
        {

            cards.style.marginLeft = '0';
            cards.style.marginRight = 'auto';
            secCentre.style.width = 'auto';
            cards.style.display = 'grid';
            cards.style.gridTemplateColumns = 'auto auto auto auto';
            cards.style.gap = '1.5rem';
            document.querySelector('.classes-titre').style.display = 'none';
        }

    }
});




