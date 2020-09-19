

let shedule = {
    self: document.querySelector(".shedule"),
    allDays: document.querySelectorAll('.shedule__day .day'),
    allContents: document.querySelectorAll('.shedule__content .content')
}

shedule.self.addEventListener('click', function (event) {
    let getDay = event.target.closest('.day');

    if (!getDay) return;

    let getIndex = getDay.getAttribute("data-index") || 0;
   
    if (!getDay.classList.contains('active'))
        setToDay(getIndex);
    else return;

})

function setToDay(day) {
    let getIndex = day;
    
    let days = shedule.allDays;
    days.forEach(day => {
        day.classList.remove('active');
    });
    days[getIndex].classList.add('active');

    let contents = shedule.allContents;
    contents.forEach(content => {
        content.classList.remove('show');
    });
    contents[getIndex].classList.add('show');
}

// Неделя - Числитель или Знаминатель?
let weekMsg = document.getElementById("week");

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
                weekMsg.innerText = "Числ"; //
                break;
            }
            else
            {
                weekMsg.innerText = "Знам"; // 
                break;
            }
            
        }
        weekMsg.innerText = "Знам";
    }
}());


/* Автоматически установить нынешний день в расписание */
(function () {
    let dayToday = new Date().getDay();

    dayToday -= 1;
    console.log(dayToday);

    if (dayToday <= 0 || dayToday >= 5) {
        setToDay(0);
    } else {
        setToDay(dayToday);
    }

}());

let ficha = document.querySelector('.header__title').ondblclick = function() {
    if (document.body.classList.contains("effect-on")) {
        document.body.classList.replace("effect-on", "effect-off");
    } else  document.body.classList.replace("effect-off", "effect-on");
}

