

let shedule = {
    self: document.querySelector(".shedule"),
    allDays: document.querySelectorAll('.shedule__day .day'),
    allContents: document.querySelectorAll('.shedule__content .content')
}

shedule.self.addEventListener('click', function (event) {
    let getDay = event.target.closest('.day');

    if (!getDay) return;

    let getIndex = getDay.getAttribute("data-index") || 0;
   
    if (!getDay.classList.contains('active')) {

        let days = shedule.allDays;
        days.forEach(day => {
             day.classList.remove('active');
        }); 
        days[getIndex].classList.add('active');

         // запомнить высотку shedule content
        let contents = shedule.allContents;
        contents.forEach(content => {
            content.classList.remove('show');
        });
        contents[getIndex].classList.add('show');

    } else return;

})

// Неделя - Числитель или Знаминатель?
let week = document.getElementById("week");

(function() {
     
    /* БЛОК 1 -> Формирование массив из дней недели Числитель или Знаминатель [START] */
    let denominator = [] // Знаминатель
    let numerator = [] // Числитель

    let flag = true;
    for (let i = 257; i < 365; i += 7) {  // счет начинается с 14-сентября, прошло 257 дней с начала года

        if (flag == true) {
            denominator.push(Math.round(i));
            flag = false;
        } else {
            numerator.push(Math.round(i));
            flag = true;
        }
    }
    /* БЛОК 1 -> Формирование массив из дней недели Числитель или Знаминатель [END] */

    const date = new Date('January 1, 2020 00:00:00'); // 1-январь 2020-года
    let currentDate = Date.parse(new Date());           // текущая дата
    let days = (currentDate - Date.parse(date)) / 86400000;  // деление  1 сутка = 86 400 000 миллисекунд 

    for (let i = 0; i < denominator.length; i++) {
        let numFromDenom = (days > denominator[i]) ? (days - denominator[i]) : denominator[i] - days;
        let numFromNumer = (days > numerator[i]) ? (days - numerator[i]) : numerator[i] - days;

        if (numFromDenom + numFromNumer == 7) {

            if (days >= denominator[i] && days < numerator[i]) {
                week.innerText = "Числ"; //
                break;
            }
            else
            {
                week.innerText = "Знам"; // 
                break;
            }
            
        }
        week.innerText = "Знам";
    }
}());

