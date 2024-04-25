'use strict';

let classListDOM = document.getElementsByClassName('section-spacing');
let classListUser = [];

let canvaElement = document.createElement('canvas');
canvaElement.id = 'myChart';
canvaElement.width = '500';
canvaElement.height = '400';
canvaElement.style = 'position: relative;';
document.getElementsByClassName('classes-wrapper')[0].appendChild(canvaElement);

if (classListDOM.length != 0) {
    for (let i = 0; i < classListDOM.length; i++) {
        classListUser.push(
            {
                name: classListDOM[i].getElementsByClassName('card-panel-title')[0].textContent,
                grade: classListDOM[i].getElementsByClassName('pourcentage')[0].textContent
            });
    }
    // Get the canvas element and its context
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    const data = classListUser;
    // Calculate the maximum grade to determine chart scaling
    const maxValue = Math.max(...data.map(item => parseInt(item.grade))) + 10; 

    // Settings for the chart
    const chartWidth = 600;  
    const barWidth = 50;
    const barSpacing = 30;
    const chartHeight = 400;  
    const scaleFactor = (chartHeight - 50) / maxValue;  
    const baseHeight = chartHeight - 30; 

    // Draw bars
    data.forEach((item, index) => {

        let currentGrade = parseInt(item.grade.substring(0,2));
        if (currentGrade > 60)
        {
            ctx.fillStyle = '#4A90E2'; 
        }
        else if (currentGrade > 45)
        {
            ctx.fillStyle = '#FFBF00';
        }
        else
        {
            ctx.fillStyle = '#C70039';
        }
        
        const barHeight = parseInt(item.grade) * scaleFactor;
        const x = 40 + index * (barWidth + barSpacing);  
        const y = baseHeight - barHeight;

        ctx.fillRect(x, y, barWidth, barHeight);

        // Add labels over each bar
        ctx.fillStyle = '#000'; 
        ctx.textAlign = 'center';
        ctx.fillText(item.grade, x + barWidth / 2, baseHeight - 50);

        // Add labels below each bar
        ctx.fillStyle = '#000'; 
        ctx.textAlign = 'center';
        ctx.fillText(item.name.substring(10, 15), x + barWidth / 2, baseHeight + 20);
    });

    // Draw X axis
    ctx.beginPath();
    ctx.moveTo(30, baseHeight);
    ctx.lineTo(chartWidth - 10, baseHeight);
    ctx.stroke();

    // Draw Y axis
    ctx.beginPath();
    ctx.moveTo(40, 30); 
    ctx.lineTo(40, baseHeight);
    ctx.stroke();

}






