import Chart from 'chart.js/auto';

let classListDOM = document.getElementsByClassName('section-spacing');
let classListUser = [];

if (classListDOM.length != 0)
{
    for (let i=0; i<classListDOM.length;i++)
    {
        classListUser.push(
            {
                name: classListDOM[i].getElementsByClassName('card-panel-title')[0].textContent,
                grade: classListDOM[i].getElementsByClassName('pourcentage')[0].textContent
            });
        }
    }

    



