'use strict';
/* global browser */
class LeaPageHandler {
    constructor() {
        this.gradeHelpers = [];
        this.DESIRED_GRADE = 60;
        this.initPage();
    }

    initPage() {
        const secCentre = document.querySelector('.section-centre');
        const titlePageLea = document.querySelector('.titrePageLea');

        if (secCentre) {
            this.handleLandingPage(secCentre);
        } else if (titlePageLea) {
            this.handleClassGradePage();
        }
    }

    // Existing methods...

    handleClassGradePage() {
        const gradeTable = document.querySelector('.tb-sommaire');
        this.calculateGrade(gradeTable);
    }

 
    handleLandingPage(secCentre) {
            this.cleanBRs();
            this.adjustLayout(secCentre);
            this.createChart(secCentre);
            this.handlePreferences();
        }
    
        cleanBRs() {
            const brs = Array.from(document.getElementsByTagName('br'));
            brs.forEach(br => {
                if (!br.parentElement.classList.contains('right-section')) {
                    br.remove();
                }
            });
        }
    
        adjustLayout(secCentre) {
            const cards = document.querySelector('.classes-wrapper');
            secCentre.style.alignItems = 'start';
            secCentre.style.flexDirection = 'column';
            cards.style.marginLeft = '0';
            cards.style.marginRight = 'auto';
        }
    
        createChart(secCentre) {
            const canvaElement = document.createElement('canvas');
            canvaElement.id = 'myChart';
            canvaElement.width = 1200;
            canvaElement.height = 400;
            canvaElement.style.display = 'inline';
            secCentre.appendChild(canvaElement);
            this.drawChart(canvaElement);
        }
    
        drawChart(canvas) {
            const ctx = canvas.getContext('2d');
            const classListDOM = document.querySelectorAll('.section-spacing');
            const data = Array.from(classListDOM, elem => ({
                name: elem.querySelector('.card-panel-title').textContent,
                grade: elem.querySelector('.pourcentage').textContent,
                average: elem.querySelectorAll('.note-principale')[1].textContent,
            }));
    
            // Drawing logic 
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
                        console.log(currentAverage);
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
        
        handlePreferences() {
                    browser.storage.sync.get('chkState').then(this.setVisibility, console.error);
                    browser.storage.sync.get('chkUseless').then(this.setSideSections, console.error);
                    browser.runtime.onMessage.addListener(this.handleMessage.bind(this));
        }
            
        handleMessage(message) {
        // Message handling logic here...
        }
            
        setVisibility(settings) {
                    const canvaElement = document.getElementById('myChart');
                    if (settings.chkState) {
                        canvaElement.style.display = 'inline';
            
                    }
                    else {
                        canvaElement.style.display = 'none';
            
                    }
         }
            
        setSideSections(settings) {
                    const rightSec = document.getElementsByClassName('section-droite');
                    const leftSec = document.getElementsByClassName('parent-menu-gauche');
                    const cards = document.querySelector('.classes-wrapper');
                    //user preference is true (VISIBLE)
                    if (settings.chkUseless) {
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
            


    calculateGrade(gradeTable) {
        const examsAndHomeworks = gradeTable.querySelectorAll('tr[bgcolor="\\#EEEEEE"]');
        const currentGradeRows = gradeTable.textContent.substring(39, 46);
        const gradeRegex = /(\d+(\.\d+)?)\/(\d+(\.\d+)?)/;
        const match = currentGradeRows.match(gradeRegex);
        if (match) {

            let currentGrade = parseFloat(match[1]);
            console.log(this.processMissingGrades(examsAndHomeworks, currentGrade));
        }
    }

    processMissingGrades(examsAndHomeworks, currentGrade) {
        const missingGrades = Array.from(examsAndHomeworks).reduce((acc, row) => {
            const gradingRegex = /--(\d+(\.\d+)?)%/;
            const match = row.textContent.match(gradingRegex);
            
            if (match) {
                missingGrades.push({
                    htmlContent: row,
                    grading: parseFloat(match[1])
                });
            }

        }, );
        
        console.log(missingGrades);
        const neededGrade = this.DESIRED_GRADE - currentGrade;
        const totalWeight = missingGrades.reduce((acc, exam) => acc + exam.grading, 0);
        missingGrades.forEach(exam => {
            const requiredScore = (exam.grading / totalWeight) * neededGrade;
            this.displayAdvice(exam, requiredScore);
        });
    }

    displayAdvice(exam, score) {

        const advice = document.createElement('p');
        const result = document.createElement('b');
        result.textContent = `${(score * 100 / exam.grading).toFixed(2)}%`;
        result.style.fontWeight = '600';
        const scoreText = document.createTextNode(`Tu dois avoir minimalement ${result.textContent} à cet examen. (${score.toFixed(2)}/${exam.grading})`);
        
        advice.appendChild(scoreText);
        exam.htmlContent.querySelector('td[bgcolor="\\#EEEEEE"]').appendChild(advice);
        this.gradeHelpers.push(advice);
    }

    // Other methods...
}

new LeaPageHandler();
