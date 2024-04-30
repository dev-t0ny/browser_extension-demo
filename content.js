'use strict';
/* global browser */
let secCentre;
let gradeHelpers = [];
//checks if this is lea's landing page
if (document.getElementsByClassName('section-centre')[0]) {
    secCentre = document.getElementsByClassName('section-centre')[0];
    leaLandingHandler(secCentre);
}
else if (document.getElementsByClassName('titrePageLea')[0]) {
    leaClassGradeHandler();
}

/**
 * Handles Lea's landing page
 * @param {*} secCentre Section
 */
function leaLandingHandler(secCentre) {
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

    //canva handling
    let canvaElement = document.createElement('canvas');
    canvaElement.id = 'myChart';
    canvaElement.width = '1200';
    canvaElement.height = '400';
    canvaElement.style = 'display: inline;';

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
        //user preference is true (VISIBLE)
        if (e.chkUseless) {
            for (let element of rightSec) {
                element.style.display = 'inline';
            }
            for (let element of leftSec) {
                element.style.display = 'inline';
            }

            let secCentre = document.getElementsByClassName('section-centre')[0];

            //sizing
            secCentre.style.width = '50rem';

            cards.style.display = 'inline';
            cards.style.gap = '0';

            //'activité dans mes classes'
            document.querySelector('.classes-titre').style.display = 'inline';

            //lea button on left side
            document.querySelector('.id-service_CVIP').style.display = 'inline-block';
        }
        //user preference is false (HIDDEN)
        else {
            for (let element of rightSec) {
                element.style.display = 'none';
            }
            for (let element of leftSec) {
                element.style.display = 'none';
            }

            let secCentre = document.getElementsByClassName('section-centre')[0];

            //sizing
            secCentre.style.width = 'auto';


            cards.style.display = 'grid';
            let gridTemplate;
            //responsive design
            if (window.innerWidth > 1454) {
                gridTemplate = 'auto auto auto auto';
            }
            else if (window.innerWidth > 1166) {
                gridTemplate = 'auto auto auto';
            }
            else {
                gridTemplate = 'auto auto';
            }
            cards.style.gridTemplateColumns = gridTemplate;
            cards.style.gap = '1.5rem';

            //'activité dans mes classes'
            document.querySelector('.classes-titre').style.display = 'none';

            //lea btn on left side
            document.querySelector('.id-service_CVIP').style.display = 'none';
        }
    }

    //browser storage check
    let prendreState = browser.storage.sync.get('chkState');
    prendreState.then(setVisibility, (e) => { console.log(e); });

    prendreState = browser.storage.sync.get('chkUseless');
    prendreState.then(setSideSections, (e) => { console.log(e); });


    // Listen for messages from the popup script
    browser.runtime.onMessage.addListener((message) => {

        //user has checked/unchecked the chart chkbox
        if (message.command === 'toggle-chart') {
            // Toggle visibility based on current state
            canvaElement.style.display = (canvaElement.style.display === 'inline') ? 'none' : 'inline';

        }

        //User has checked/unchecked the sections cleaner chkbox
        else if (message.command === 'toggle-useless') {
            let secCentre = document.getElementsByClassName('section-centre')[0];

            //styling
            for (let element of rightSec) {
                element.style.display = (element.style.display === 'inline') ? 'none' : 'inline';
            }

            for (let element of leftSec) {
                element.style.display = (element.style.display === 'inline') ? 'none' : 'inline';
            }

            //chkbox is CHECKED (sections are still visible)
            if (rightSec[0].style.display === 'inline') {

                document.querySelector('.id-service_CVIP').style.display = 'inline-block';



                cards.style.marginLeft = '2rem';
                cards.style.marginRight = '0';
                secCentre.style.width = '50rem';
                cards.style.display = 'inline';
                cards.style.gap = '0';
                document.querySelector('.classes-titre').style.display = 'inline';
            }

            //chkbox is UNCHECKED (sections are not visible)
            else {
                //removes the lea button, which is useless on this page
                document.querySelector('.id-service_CVIP').style.display = 'none';

                cards.style.marginLeft = '0';
                cards.style.marginRight = 'auto';
                secCentre.style.width = 'auto';
                cards.style.display = 'grid';
                let gridTemplate;

                //responsive design
                if (window.innerWidth > 1454) {
                    gridTemplate = 'auto auto auto auto';
                }

                else if (window.innerWidth > 1166) {
                    gridTemplate = 'auto auto auto';
                }
                else {
                    gridTemplate = 'auto auto';
                }


                cards.style.gridTemplateColumns = gridTemplate;
                cards.style.gap = '1.5rem';
                document.querySelector('.classes-titre').style.display = 'none';
            }

        }
    });
}

/**
 * Handle's lea when clicking on a specific class
 */
function leaClassGradeHandler() {
    const gradeTable = document.querySelector('.tb-sommaire');
    const currentGrade = gradeTable.textContent.substring(39, 46);
    const needGrade = document.createElement('p');
    let regex = /(\d+(\.\d+)?)\/(\d+(\.\d+)?)/;
    let grades = currentGrade.match(regex)[1];

    const row = document.createElement('td');

    let result = 60 - grades;
    result = parseFloat(result.toFixed(2));
    if (grades < 60) {
        needGrade.textContent = '*Il vous faut encore au moins ' + (result + ' points pour passer le cours*');
        //STARTS HELPER ALGO
        calculateSPG(parseFloat(grades));
    }
    else {
        needGrade.textContent = 'Vous passez déja ce cours!';
    }

    needGrade.style.backgroundColor = '#FDDB8E';
    needGrade.style.color = '#333333';
    needGrade.style.marginLeft = '10rem';


    row.appendChild(needGrade);
    gradeTable.firstChild.children[2].firstChild.appendChild(row);


    /**
     * Sets grade helper visibility
     */
    function setVisibility(e) {
        if (e.chkHelper)
        {
            needGrade.style.display = 'inline'
            for (let gradeHelper of gradeHelpers)
            {
                gradeHelper.style.display = 'block';
            }
        }
        else
        {
            needGrade.style.display = 'none'
            for (let gradeHelper of gradeHelpers)
            {
                gradeHelper.style.display = 'none';
            }
        }


    }

    //browser storage check
    let prendreState = browser.storage.sync.get('chkHelper');
    prendreState.then(setVisibility, (e) => { console.log(e); });




    // Listen for messages from the popup script
    browser.runtime.onMessage.addListener((message) => {
        if (message.command == 'toggle-helper') {
            needGrade.style.display = (needGrade.style.display === 'inline') ? 'none' : 'inline';
            for (let gradeHelper of gradeHelpers)
            {
                gradeHelper.style.display = (gradeHelper.style.display === 'block') ? 'none' : 'block';
            }
        }



    });
   

    /**
     * Smallest possible grade
    */
    function calculateSPG(currentGrade) {

        const gradeTable = document.querySelector('.table-notes');
        const examsAndHomeworks = gradeTable.querySelectorAll('tr[bgcolor="\\#EEEEEE"]');

        let missingGrades = [];

        const DESIREDGRADE = 60;

        for (let row of examsAndHomeworks) {
            if (row.textContent.includes('--')) {
                let regex = /--(\d+(\.\d+)?)%/;
                let grading = row.textContent.match(regex);
                missingGrades.push({ htmlContent: row, grading: parseFloat(grading[1]) });
            }
        }

        let shouldGet = calculateRequiredScoresForExams(missingGrades, currentGrade, DESIREDGRADE);
        for (let row in missingGrades) {

            // Create the paragraph element
            const advice = document.createElement('p');

            // Create the bold element
            const result = document.createElement('b');

            const resultOutOfExam = document.createElement('b');
            resultOutOfExam.textContent = shouldGet[row].toFixed(2);

            resultOutOfExam.style.fontWeight = '600';
            result.style.fontWeight = '600';
            // Calculate the percentage and set it as the textContent of the bold element
            result.textContent = ((shouldGet[row] * 100) / missingGrades[row].grading).toFixed(2) + '%';

            // Start forming the complete text, inserting the bold part where needed
            advice.appendChild(document.createTextNode('Tu dois avoir minimalement '));
            advice.appendChild(result);
            advice.appendChild(document.createTextNode(' à cet examen. ('));
            advice.appendChild(resultOutOfExam);
            advice.appendChild(document.createTextNode('/' + missingGrades[row].grading + ')'));


            missingGrades[row].htmlContent.querySelector('td[bgcolor="\\#EEEEEE"]').appendChild(advice);
            gradeHelpers.push(advice);
        }

        function calculateRequiredScoresForExams(exams, currentGrade, desiredGrade) {
            const neededGrade = desiredGrade - currentGrade;
            const totalWeight = exams.reduce((acc, exam) => acc + exam.grading, 0);

            return exams.map(exam => {
                return (exam.grading / totalWeight) * neededGrade;
            });
        }
    }
}

