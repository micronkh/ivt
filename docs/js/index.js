// Неделя - Числитель или Знаминатель?
let weekMsg = document.getElementById("week");

(function () {

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
            else {
                weekMsg.innerText = "Знам"; // 
                break;
            }

        }
        weekMsg.innerText = "Знам";
    }
}());

function createElement(tag, props, children = []) {
  let element = document.createElement(tag);

  for (let [key, value] of Object.entries(props))
  element[key] = value;

  children.forEach(function(item) {
    if (typeof item === 'string') {
        let textNode = document.createTextNode(item);
        element.appendChild(textNode);
    }
    else element.appendChild(item);
  });

  return element;
}


// функция для показа уведомлений, который удалится через time секунд
function alert(msg, time, style) {
    let div = createElement('div', {'className': `alert ${style}`, 'id': 'alert'}, [msg]);

    document.querySelector('.container-app').append(div);
    setTimeout(() => {
        document.getElementById('alert').remove();
    }, time);
}

function helpMsg() {
    let aware = localStorage.getItem('aware');
    let modal = document.querySelector('.modal');

    if (!aware) {
        modal.classList.add('show');
        
        let checkBtn = modal.querySelector('#instruction');
        checkBtn.onclick = function() {
            let check = modal.querySelector('.option-input').checked;
            if (check) {
                localStorage.setItem('aware', true);
            }
            modal.remove();
        }
    }

    else modal.remove();
}

/* получиль какой сегодня день, вместо суббота и вокресенье возвращает понедельник*/
function getPresentDay() {
    let dayToday = new Date().getDay();
    dayToday -= 1;

    if (dayToday <= 0 || dayToday >= 5) return 0;
    else return dayToday;
}

/* выделить переданый в параметр день недели */
function setDay(day) {
    let getIndex = day;

    let days = shedule.allDays;
    days.forEach(day => {
        day.classList.remove('active');
    });

    days[getIndex].classList.add('active');
}



let shedule = {
    self: document.querySelector(".shedule"), // главный блок график

    sheduleDay: document.querySelector(".shedule__day"), // общий для всех
    allDays: document.querySelectorAll('.shedule__day .day'), // общий для всех

    content: document.querySelectorAll('.shedule__content'),
};


// функция для показа расписание для выбранной группы
function setContent(day, groupName) {
    let indexContent = groupName || 'ivt-1-18'; // если groupName пустой по умолчанию показать ИВТ-1-18
    let contentWrap = document.querySelector('#' + indexContent); 
    
    let allContent = shedule.content;
    allContent.forEach(element => {
        element.classList.remove('show')
    });
    contentWrap.classList.add('show');
 
    let content = contentWrap.querySelectorAll('.content');
    content.forEach(element => {
        element.classList.remove('show');
    });

    content[day].classList.add('show');
}

/* Не общая функция */
shedule.sheduleDay.addEventListener('click', function (event) {
    let getDay = event.target.closest('.day');

    if (!getDay) return;

    let getIndex = getDay.getAttribute("data-index") || 0;

    if (!getDay.classList.contains('active'))
        setDay(getIndex);
    else return;

    setContent(getIndex, getGroupName());
})


/* участок работы START */

let groupShowNames = {
    'ivt-1-18': 'ИВТ-1-18',
    'isop-1-18': 'ИСОП-1-18'
};

let showToDOM = {
    choiceGroup: document.getElementById('choice-group'),
    dropdown: document.querySelector('.dropdown.group'),
    nameGroup: document.getElementById('name-group')
}

function getGroupName() {
    return shedule.self.dataset.group;
}

function setGroupname(newValue) {
    shedule.self.dataset.group = newValue;
}

function showGroupName(newValue) {
    showToDOM.nameGroup.innerText = newValue;
}

showToDOM.choiceGroup.onclick = function() {
    let dropdown = showToDOM.dropdown;

    dropdown.classList.toggle('show');

    dropdown.onclick = function(event) {
        let getGroupName = event.target.dataset.group;
        dropdown.classList.remove('show');

        if (getGroupName == 'isop-1-18') {
            alert('Предупреждение !!!', 1200, 'danger');
            setTimeout(() => {
                alert('Иформация можеть быть некорректна', 2000, 'warning');
            }, 1300);
        }

        setDay(getPresentDay());
        setGroupname(getGroupName);
        showGroupName(groupShowNames[getGroupName]);
        setContent(getPresentDay(), getGroupName);

        localStorage.setItem('group-name', getGroupName);
        localStorage.setItem('group-name-rus', groupShowNames[getGroupName]);
    }
}

    
/* участок работы END */

window.onload = function main() {
    let groupNameId = localStorage.getItem('group-name') || getGroupName();
    let presentDay = getPresentDay();

    setDay(presentDay);
    setGroupname(groupNameId);
    showGroupName(groupShowNames[groupNameId]);
    setContent(presentDay, groupNameId);

    helpMsg();
}
