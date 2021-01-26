'use strict' // ES 6 ON

localStorage.clear();

// глубокая клонирования объекта
function cloneObject(obj) {
    let clone = {};

    for (let key in obj) {
        if (typeof obj[key] !== "object")
            clone[key] = obj[key];               // клонировать если примитив
        else clone[key] = cloneObject(obj[key]);  // вывзвать функция рекурсивно если значения объект
    }

    return clone;
}


// Точный тип объекта
function type(object) {
    return Object.prototype.toString.call(object);
}

// получения рандомного числа [min; max)
function rand(min, max) {
    return Math.floor((Math.random() * (max - min) + min));
}


// функция для более удобной и быстрой создание элементов 
function createElement(tag, props, ...children) {
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
    let div = createElement(
        "div",
        { className: `alert ${style}`, id: "alert" },
        [msg]
    );

    document.querySelector(".container-app").append(div);
    setTimeout(() => {
        document.getElementById("alert").remove();
    }, time);

    // Пример: alert("Добро Пожаловать", 1000, "success bold");
}



// Неделя - Числитель или Знаминатель?
(function () {

    /* Формирование массива из дней недели числитель или знаминатель */
    let denominator = [] // Знаминатель
    let numerator = [] // Числитель

    let flag = true;
    for (let i = 3; i < 353; i += 7) {  // счет начинается с 4-января, прошло 3 дня с начала года

        if (flag == true) {
            denominator.push(Math.round(i));
            flag = false;
        } else {
            numerator.push(Math.round(i));
            flag = true;
        }
    }

    const date = new Date('January 1, 2021 00:00:00'); // 1-январь 2020-года
    let currentDate = Date.parse(new Date());           // текущая дата
    let days = (currentDate - Date.parse(date)) / 86400000;  // 1 сутка = 86 400 000 миллисекунд 

    let weekMsg = document.getElementById("week"); 

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


/* выделить переданый в параметр день недели */
function setDay(day) {
    let days = shedule.allDays;
    days.forEach(item => item.classList.remove('active')); // убрать актив из предыдущего дня

    days[day].classList.add('active'); // установить актив в переданный день недели
}


/* получиль какой сегодня день, вместо суббота и вокресенье возвращает понедельник*/
function getPresentDay() {
    let dayToday = new Date().getDay();
    dayToday -= 1;

    if (dayToday <= 0 || dayToday >= 5) return 0;
    else return dayToday;
}


let shedule = {
    self: document.querySelector(".shedule"), // главный блок - график

    sheduleDay: document.querySelector(".shedule__day"), // вкладка дни [родитель-объертка]
    allDays: document.querySelectorAll('.shedule__day .day'), // вкладки дни [5 элементов]

    content: document.querySelectorAll('.shedule__content')  // тело расписании
};


// выбрать нужный день недели
shedule.sheduleDay.addEventListener('click', function (event) {
    let getDay = event.target.closest('.day');

    if (getDay) {
        let getIndex = getDay.getAttribute("data-index") || 0;

        setDay(getIndex); // выделить день недели
        setContent(getIndex, getGroupName()); // показать расписанию выбранного дня недели
    }    
})



// функция для показа расписание для выбранной группы [ПЕРЕДЕЛАТЬ !!!] ***
function setContent(day, groupName) {

    // спрятать расписанию всех групп перед показом нужного
    let allContent = shedule.content;
    allContent.forEach(item => item.classList.remove("show"));

    // искать среди расписаний для всех групп по атрибуту [data-group]
    for (var item of shedule.content)  {
        if (item.dataset.group === groupName) {
            item.classList.add("show"); // если совпал показать расписанию

            let content = item.querySelectorAll(".content");
            content.forEach((item) => item.classList.remove("show")); // спрятать все дни [ПН-ПЯ]

            content[day].classList.add("show"); // показать переданный день недели [ПН-ПЯ]
        }
    }

}


// показать расписанию в зависимости от выбранной группы [ПЕРЕДЕЛАТЬ !!!] ***
let showToDOM = {
    choiceGroup: document.getElementById('choice-group'),
    dropdown: document.querySelector('.dropdown.group'),
    nameGroup: document.getElementById('name-group')
}

function showGroupName(newValue) {showToDOM.nameGroup.innerText = newValue;}
function getGroupName() {return localStorage.getItem('group-name')}


// показать расписанию в зависимости от выбранной группы
showToDOM.choiceGroup.onclick = function() {
    
    showToDOM.dropdown.classList.toggle("show");

    showToDOM.dropdown.onclick = function (event) {
        let groupName = event.target.dataset.group;
        localStorage.setItem("group-name", groupName);
        showToDOM.dropdown.classList.remove("show");

        setDay(getPresentDay()); // установить день недели
        showGroupName(getGroupName()); // отобразить имени группы
        setContent(getPresentDay(), getGroupName()); // установить контент
    };
}

class EmptySubject {
    constructor({ groupId, day}) {
        this.groupId = groupId;
        this.day = day;
        this.createHTML();
    }

    createHTML() {
        let icon = createElement('span', {className: 'biggest far fa-hand-peace'})
        let textWrap = createElement('p', {}, 'Нет расписания, нет уроков ! ', icon);
        let subject = createElement('div', {className: 'big flex justify-center p-1'}, textWrap);
        this.html = subject;
    }

    append(node) { node.append(this.html) } // добавить в конец node
    prepend(node) { node.prepend(this.html) } // добавить в начало node
    before(node) { node.before(this.html) } // добавить перед node
    after(node) { node.after(this.html) }  // добавить после node
    reaplceWith(node) { node.reaplceWith(this.html) } // заменить node
}

class BriefSubject {

    static amount = 0;

    constructor({subject: {name, type, week="", subGroup=""}, time: {start:{h: hStart, m: mStart}, end:{h: hEnd, m: mEnd}},
                 teacher: {names, url}, day, groupId, conference: {link="#", platform="unknown"}}) {

        this.subject = {name, type, week, subGroup};
        this.time = {start: {hStart, mStart}, end: {hEnd, mEnd}};
        this.teacher = {names, url};
        this.day = day;
        this.groupId = groupId;
        this.conference = {link, platform};
        

        this.createHTML();
        BriefSubject.amount++; 
    }

    // проверка какой текущий или же следующий урок = type=[LIVE || NEXT]
    checkLesson(type) {

        let start = new Date().setHours(this.time.start.hStart, this.time.start.mStart);
        let end = new Date().setHours(this.time.end.hEnd, this.time.end.mEnd);

        let now = new Date().setHours(new Date().getHours(), new Date().getMinutes());
        if (type === 'NEXT') now += (80 * 60 * 1000); // текущее время + 80 минут в миллисекундах

        if (now >= start && now <= end) return true;

        return false;
    }

    // установить индикатор в текущий или же в следующий урок type= [LIVE || NEXT]
    setIndicate(type) {
        
        let content = document.getElementById(this.groupId) 
        let days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
        let dayIndex = days.indexOf(this.day); // возвращает индекс того дня в котором находится дисциплина

        if (type === 'LIVE') {

            let allLiveSubjects = content.querySelectorAll('.content')[dayIndex].querySelectorAll('.live-subject');
            allLiveSubjects.forEach(function (item) {
                item.innerText = '';
                item.classList.remove('live-subject');
            })

            this.indicator.innerText = 'LIVE';
            this.indicator.classList.add('live-subject');
        }

        if (type === 'NEXT') {

            let allNextSubject = content.querySelectorAll('.content')[dayIndex].querySelectorAll('.next-subject');
            allNextSubject.forEach(function (item) {
                item.innerText = '';
                item.classList.remove('next-subject');
            })

            this.indicator.innerText = 'NEXT';
            this.indicator.classList.add('next-subject');
        }
    }

    createHTML() {
        
        /* Левая часть [Время] */
        let template = function template(h=0, m=0) {
            let hour = h;
            let min = m;

            if (Number(h) < 10)
            hour = '0' + h;

            if (Number(m) < 10)
            min = '0' + m;

            return hour + ":" + min;
        };

        let time = {  
            start: createElement('span', { className: 'd-block' }, template(this.time.start.hStart, this.time.start.mStart)),
            end: createElement('span', {className: 'd-block'}, template(this.time.end.hEnd, this.time.end.mEnd)),
        }
        let partLeft = createElement('div', {className: 'flex-column justify-center highlight light subject-time'}, time.start, time.end);


        /* Правая часть */ /* [Блок Предмет + Ссылка] */

        // Ссылка на конференцию
        let path = 'img/' + this.conference.platform + '.png';
        let platformImg = createElement('img', {src: path, alt: this.conference.platform});
        let linkA = createElement("a", {href: this.conference.link, className: 'mr-m align-self-center'}, platformImg);

        // Имя_Предмета + Форма обучения + Неделя [Числ | Знам]
        let subSubject = {
            name: createElement('span', {className: 'highlight light d-block mb-s'}, this.subject.name),
            type: createElement('span', {className: 'highlight primary mr-s'}, this.subject.type),
            week: createElement('span', {className: 'highlight warning mr-s text-center'}, this.subject.week),
            subGroup: createElement('span', { className: 'highlight success' }, this.subject.subGroup),
        }
        let subjectWrap = createElement('div', {}, subSubject.name, subSubject.type, subSubject.week, subSubject.subGroup);

        let blockSubject = createElement("div", {className: 'flex'}, linkA, subjectWrap); 
        

        // Блок Преподователь
        let unknown = "https://www.meme-arsenal.com/memes/a612a44cf860811b0ce82ec3f757b0f8.jpg";
        let imgUrl = (this.teacher.url || unknown);
        let teacherImg = createElement('img', {className: 'staff d-block', alt: this.teacher.names, src: imgUrl});
        let indicator = createElement('span', {});

        this.indicator = indicator; // сохранению ссылки для индикация элемента [LIVE || NEXT]
        let teacherWrap = createElement('div', {className: 'flex-column justify-center ml-m'}, teacherImg, indicator);

        let partRight = createElement('div', {className: 'flex align-center justify-between w-100'}, blockSubject, teacherWrap);

        
        // Формирование блока-оболочки предмета
        let subject = createElement('div', {className: 'flex p-1'}, partLeft, partRight);
        this.html = subject;
    } 

    structura() {
        return `
            <div class="flex p-1">

                \t<div class="flex-column justify-center highlight light subject-time">
                    \t\t<span class="d-block">00:00</span>
                    \t\t<span class="d-block">00:00</span>
                \t</div>

                \t<div class="flex align-center justify-between w-100">
                    \t\t<div class="flex">
                        
                        \t\t\t<a href="#" class="mr-m align-self-center"><img src="img/unknown.jpg" alt="unknown"></a>
                        
                        \t\t\t<div>
                            \t\t\t\t<span class="d-block highlight light mb-s">Имя_Предмета</span>
                            \t\t\t\t<span class="highlight primary">Пр/Лб/Лк</span> 
                            \t\t\t\t<span class="highlight warning text-center">Знам/Числ</span>   <!-- Text +   -->
                        \t\t\t</div>
                    \t\t</div>
                    
                    \t\t<div class="flex-column justify-center ml-m">
                        \t\t\t<img src="url"  class="staff d-block" alt="Имя_Преподователя">
                        \t\t\t<span class="live-subject">LIVE/NEXT</span>
                    \t\t</div>
                    
                \t</div>
                
            </div>
        `;
    }

    append(node) { node.append(this.html) } // добавить в конец node
    prepend(node) { node.prepend(this.html) } // добавить в начало node
    before(node) { node.before(this.html) } // добавить перед node
    after(node) { node.after(this.html) }  // добавить после node
    reaplceWith(node) { node.reaplceWith(this.html) } // заменить node

}


class FullSubject{

    static amount = 0;

    constructor({subject: {name, type, week='', subGroup=''}, time: {start, end}, teacher,
                 conference: {link="#", platform="unknown", id="?", password="?"}}) {
        this.subject = {name, type, week, subGroup}
        this.time = {start, end}
        this.teacher = teacher;
        this.conference = {link, platform, id, password};
        
        
        this.createHTML();
        FullSubject.amount++;
    }

    createHTML() {

        // Столбец Предмет
        let weekText = this.subject.week != false ? `[${this.subject.week}]` : '';
        let subjectWeek = createElement("span", { className: "highlight warning" }, weekText);
        let subjectName = createElement("span", { className: "d-block highlight text-light" }, this.subject.name, subjectWeek);

        let subjectTime = createElement("span", {className: "d-block"}, this.time.start, " - ", this.time.end);

        let subGroupText = this.subject.subGroup != false ? `[${this.subject.subGroup}]` : '';
        let subGroup = createElement('span', { className: 'highlight success' }, subGroupText);
        let subjectType = createElement("span", {className: "d-block highlight primary"}, this.subject.type, subGroup);
        
        let blockSubject = createElement("div", {className: 'flex-5 flex-column align-center justify-center'},
                                                        subjectName, subjectTime, subjectType);
        
        // Столбец Перейти
        let path = 'img/' + this.conference.platform + '.png';
        let platformImg = createElement('img', {src: path, alt: this.conference.platform});
        let linkA = createElement("a", {href: this.conference.link}, platformImg);
        let blockGo = createElement('div', {className: 'flex-2 flex align-center justify-center'}, linkA);


        // Столбец Ссылка
        let linkId = {
            left: createElement("span", { className: "mr-1" }, "Id:"),
            right: createElement("span", { className: "mr-1" }, this.conference.id)
        };
        
        let linkPassword = {
            left: createElement("span", { className: "mr-1" }, "Код:"),
            right: createElement("span", { className: "mr-1" }, this.conference.password)
        };
        let teacherName = createElement("span", { className: "highlight info"}, this.teacher);

        
        let wrapper = {
            linkIdWrap: createElement("div", {}, linkId.left, linkId.right),
            linkPasswordWrap: createElement("div", {}, linkPassword.left, linkPassword.right),
            teacherNameWrap: createElement("div", {}, teacherName),
        };
        
        let blockLink = createElement('div', {className: 'flex-5 flex-column justify-center align-center pl-1'},
                         wrapper.linkIdWrap, wrapper.linkPasswordWrap, wrapper.teacherNameWrap);
        

        // Формирование блока-оболочки предмета
        let subject = createElement('div', {className: 'flex'}, blockSubject, blockGo, blockLink);
        this.html = subject;
    }


    structura() {
        return `
            <div class="flex">
                \t<div class="flex-5 flex-column align-center justify-center">
                    \t\t<span class="d-block highlight text-light">Имя_Предмета</span> 
                    \t\t<span class="d-block">00:00 - 00:00</span>
                    \t\t<span class="d-block highlight danger">Лб/Пр/Лк</span>
                \t</div>
                \t<div class="flex-2 flex align-center justify-center">
                    \t\t<a href="#"><img src="img/zoom.png" alt="Zoom"></a>
                \t</div>
                \t<div class="flex-5 flex-column justify-center pl-1">
                    \t\t<div><span class="mr-1">Id:</span><span>741 6257 9534</span></div>
                    \t\t<div><span class="mr-1">Код:</span><span>9ZV0kB</span></div>
                    \t\t<div><span class="highlight info">Момуналиева Н.Т</span></div>
                \t</div>
            </div>
        `;
    }

    append(node) {node.append(this.html)} // добавить в конец node
    prepend(node) {node.prepend(this.html)} // добавить в начало node
    before(node) {node.before(this.html)} // добавить перед node
    after(node) {node.after(this.html)}  // добавить после node
    reaplceWith(node) {node.reaplceWith(this.html)} // заменить node
    
}

/* База Данных [START] */
let KSTU = {
    fullName: "Кыргызский Государственный Технический Университет",

    FIT: {
        fullName: "Факультет Информационных Технологий",

        IVT: {
            fullName: "Информатика и Вычислительная Техника",

            ["Бакасова П.С"]: {
                fullname: "Бакасова Пери Султановна",
                surname: "Bakasova P.S",
                img: function () {
                    return 'img/FIT/IVT/' + this.surname + '.jpg'
                },
                gender: "woman",
                conference: {
                    platform: "unknown",
                    link: undefined,
                    id: "?",
                    password: "?",
                },
            },

            ["Исраилова Н.А"]: {
                fullname: "Исраилова Нелла Амантаевна",
                surname: "Israilova N.A",
                img: function () {
                    return 'img/FIT/IVT/' + this.surname + '.jpg'
                },
                gender: "woman",
                conference: {
                    platform: "meet",
                    link: 'https://meet.google.com/gvw-hfev-sgf',
                    id: "?",
                    password: "?",
                },
            },

            ["Мананников Н.А"]: {
                fullname: "Мананников Никита Александрович",
                surname: "Manannikov N.A",
                img: function () {
                    return 'img/' + 'unnamed' + '.jpg'
                },
                gender: "man",
                conference: {
                    platform: "unknown",
                    link: undefined,
                    id: "?",
                    password: "?",
                },
            },

            ["Момуналиева Н.Т"]: {
                fullname: "Момуналиева Нуризат Тыныбековна",
                surname: "Momunalieva N.T",
                img: function () {
                    return 'img/FIT/IVT/' + this.surname + '.jpg'
                },
                gender: "woman",
                conference: {
                    platform: "zoom",
                    link: 'https://us04web.zoom.us/j/71133248404?pwd=ZTMyM3RVWmlxRThwWGp5YjJSWkdsdz09',
                    id: "711 3324 8404",
                    password: "SR2SJy",
                },
            },

            ["Шабданов М.А"]: {
                fullname: "Шабданов Мелис Адылович",
                surname: "Shabdanov M.A",
                img: function () {
                    return 'img/FIT/IVT/' + this.surname + '.jpg'
                },
                gender: "man",
                conference: {
                    platform: "unknown",
                    link: undefined,
                    id: "?",
                    password: "?",
                },
            },
        },
    },

    EF: {
        fullName: "Энергетический Факультет",

        TB: {
            fullName: "Техносферная Безопасность",

            ["Исагалиева А.К"]: {
                fullname: "Исагалиева Айнура Карагуловна",
                surname: "Isagalieva A.K",
                img: function () {
                    return 'img/EF/TB/' + this.surname + '.jpg'
                },
                gender: "woman",
                conference: {
                    platform: "unknown",
                    link: undefined,
                    id: "?",
                    password: "?",
                }
            },

            ["Жапакова Б.С"]: {
                fullname: "Жапакова Бурул Сабырбековна",
                surname: "Japakova B.S",
                img: function () {
                    return 'img/EF/TB/' + this.surname + '.jpg'
                },
                gender: "woman",
                conference: {
                    platform: "zoom",
                    link: 'https://us04web.zoom.us/j/74662744072?pwd=MkZBb1ZiMTZtcUtPeHZCV216QnVWZz09',
                    id: "746 6274 4072",
                    password: "FkLc25",
                },
            },

            ["Мурзаканов А.Н"]: {
                fullname: "Мурзаканов Абат Нурланбекович",
                surname: "Murzakanov A.N",
                img: function () {
                    return 'img/EF/TB/' + this.surname + '.jpg'
                },
                gender: "man",
                conference: {
                    platform: "unknown",
                    link: undefined,
                    id: "?",
                    password: "?",
                },
            },
        },
    },
};
/* База Данных [END] */


/* группа ИВТ-1-18 [START] */
let IVT_1_18 = {

    groupId: 'ivt-1-18',

    brief: {

        'Понедельник': [new EmptySubject({groupId: 'ivt-1-18', day: 'Понедельник'})],

        'Вторник': [
            new BriefSubject({ // Урок №1
                subject: { name: "Безопасность Жизнедеятельности", type: "Лекция" }, time: { start: { h: 9, m: 30 }, end: { h: 10, m: 50 } },
                teacher: { names: "Жапакова Б.С", url: KSTU.EF.TB['Жапакова Б.С'].img() }, day: 'Вторник', groupId: 'ivt-1-18',
                conference: { link: KSTU.EF.TB['Жапакова Б.С'].conference.link, platform: KSTU.EF.TB['Жапакова Б.С'].conference.platform },
            }),
            new BriefSubject({ // Урок №2
                subject: { name: "Компьютерная Графика", type: "Лекция" }, time: { start: { h: 11, m: 0 }, end: { h: 12, m: 20 } },
                teacher: { names: "Момуналиева Н.Т", url: KSTU.FIT.IVT['Момуналиева Н.Т'].img() }, day: 'Вторник', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform },
            }),
            new BriefSubject({ // Урок №3
                subject: { name: "Системное Программирование", type: "Лекция" }, time: { start: { h: 13, m: 0 }, end: { h: 14, m: 20 } },
                teacher: { names: "Исраилова Н.А", url: KSTU.FIT.IVT['Исраилова Н.А'].img() }, day: 'Вторник', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Исраилова Н.А'].conference.link, platform: KSTU.FIT.IVT['Исраилова Н.А'].conference.platform},
            }),
        ],

        'Среда': [
            new BriefSubject({ // Урок №1
                subject: { name: "Человеко-Машинное Взаимодействие", type: "Лекция" }, time: { start: { h: 9, m: 30 }, end: { h: 10, m: 50 } },
                teacher: { names: "Момуналиева Н.Т", url: KSTU.FIT.IVT['Момуналиева Н.Т'].img() }, day: 'Среда', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform },
            }),
            new BriefSubject({ // Урок №2
                subject: { name: "Компьютерная Графика", type: "Лабораторная" }, time: { start: { h: 11, m: 0 }, end: { h: 12, m: 20 } },
                teacher: { names: "Момуналиева Н.Т", url: KSTU.FIT.IVT['Момуналиева Н.Т'].img() }, day: 'Среда', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform },
            }),
            new BriefSubject({ // Урок №3
                subject: { name: "Компьютерная Графика", type: "Лабораторная" }, time: { start: { h: 13, m: 0 }, end: { h: 14, m: 20 } },
                teacher: { names: "Момуналиева Н.Т", url: KSTU.FIT.IVT['Момуналиева Н.Т'].img() }, day: 'Среда', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform },
            }),
            new BriefSubject({ // Урок №4
                subject: { name: "Экология", type: "Лабораторная" }, time: { start: { h: 14, m: 30 }, end: { h: 15, m: 50 } },
                teacher: { names: "Исагалиева А.К", url: KSTU.EF.TB['Исагалиева А.К'].img() }, day: 'Среда', groupId: 'ivt-1-18',
                conference: { link: KSTU.EF.TB['Исагалиева А.К'].conference.link, platform: KSTU.EF.TB['Исагалиева А.К'].conference.platform },
            }),

        ],

        'Четверг': [
            new BriefSubject({ // Урок №1
                subject: { name: "Системное Программирование", type: "ЛБ", week: 'Знам' }, time: { start: { h: 9, m: 30 }, end: { h: 10, m: 50 } },
                teacher: { names: "Бакасова П.С", url: KSTU.FIT.IVT['Бакасова П.С'].img() }, day: 'Четверг', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Бакасова П.С'].conference.link, platform: KSTU.FIT.IVT['Бакасова П.С'].conference.platform },
            }),
            new BriefSubject({ // Урок №2
                subject: { name: "Системное Программирование", type: "Лабораторная" }, time: { start: { h: 11, m: 0 }, end: { h: 12, m: 20 } },
                teacher: { names: "Бакасова П.С", url: KSTU.FIT.IVT['Бакасова П.С'].img() }, day: 'Четверг', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Бакасова П.С'].conference.link, platform: KSTU.FIT.IVT['Бакасова П.С'].conference.platform },
            }),
            new BriefSubject({ // Урок №3
                subject: { name: "Безопасность Жизнедеятельности", type: "ПР", week: 'Знам' }, time: { start: { h: 13, m: 0 }, end: { h: 14, m: 20 } },
                teacher: { names: "Мурзаканов А.Н", url: KSTU.EF.TB['Мурзаканов А.Н'].img() }, day: 'Четверг', groupId: 'ivt-1-18',
                conference: { link: KSTU.EF.TB['Мурзаканов А.Н'].conference.link, platform: KSTU.EF.TB['Мурзаканов А.Н'].conference.platform },
            }),
            new BriefSubject({ // Урок №4
                subject: { name: "Экология", type: "ЛБ", week: 'Знам' }, time: { start: { h: 14, m: 30 }, end: { h: 15, m: 50 }},
                teacher: { names: "Исагалиева А.К", url: KSTU.EF.TB['Исагалиева А.К'].img() }, day: 'Четверг', groupId: 'ivt-1-18',
                conference: { link: KSTU.EF.TB['Исагалиева А.К'].conference.link, platform: KSTU.EF.TB['Исагалиева А.К'].conference.platform },
            }),
        ],

        'Пятница': [
            new BriefSubject({ // Урок №1
                subject: { name: "ЭВМ и Периферийные Устройства", type: "Пр", week: 'Знам' }, time: { start: { h: 9, m: 30 }, end: { h: 10, m: 50 } },
                teacher: { names: "Мананников Н.А", url: KSTU.FIT.IVT['Мананников Н.А'].img() }, day: 'Пятница', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link, platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform },
            }),
            new BriefSubject({ // Урок №2
                subject: { name: "ЭВМ и Периферийные Устройства", type: "Практика" }, time: { start: { h: 11, m: 0 }, end: { h: 12, m: 20 } },
                teacher: { names: "Шабданов М.А", url: KSTU.FIT.IVT['Шабданов М.А'].img() }, day: 'Пятница', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Шабданов М.А'].conference.link, platform: KSTU.FIT.IVT['Шабданов М.А'].conference.platform },
            }),
            new BriefSubject({ // Урок №3
                subject: { name: "ЭВМ и Периферийные Устройства", type: "Практика" }, time: { start: { h: 13, m: 0 }, end: { h: 14, m: 20 } },
                teacher: { names: "Мананников Н.А", url: KSTU.FIT.IVT['Мананников Н.А'].img() }, day: 'Пятница', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link, platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform },
            }),
            new BriefSubject({ // Урок №4
                subject: { name: "Человеко-Машинное Взаимодействие", type: "Лабораторная" }, time: { start: { h: 13, m: 0 }, end: { h: 14, m: 20 } },
                teacher: { names: "Момуналиева Н.Т", url: KSTU.FIT.IVT['Момуналиева Н.Т'].img() }, day: 'Пятница', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform },
            }),
            new BriefSubject({ // Урок №5
                subject: { name: "Человеко-Машинное Взаимодействие", type: "Лабораторная" }, time: { start: { h: 14, m: 30 }, end: { h: 15, m: 50 } },
                teacher: { names: "Момуналиева Н.Т", url: KSTU.FIT.IVT['Момуналиева Н.Т'].img() }, day: 'Пятница', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform },
            }),
            new BriefSubject({ // Урок №6
                subject: { name: "ЭВМ и Периферийные Устройства", type: "Лабораторная" }, time: { start:{h: 14, m:30}, end:{h: 15, m:50} },
                teacher: { names: "Мананников Н.А", url: KSTU.FIT.IVT['Мананников Н.А'].img() }, day: 'Пятница', groupId: 'ivt-1-18',
                conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link, platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform },
            }),
        ]

    },

    full: {
        'Понедельник': [
            new EmptySubject({groupId: 'ivt-1-18', day: 'Понедельник'})
        ],

        'Вторник': [
            new FullSubject({ // Урок №1
                subject: { name: 'БЖД', type: 'Лекция', week: ""}, time: {start: '9:30', end: '10:50'},
                teacher: 'Жапакова Б.С', conference: { link: KSTU.EF.TB['Жапакова Б.С'].conference.link,
                platform: KSTU.EF.TB['Жапакова Б.С'].conference.platform, id: KSTU.EF.TB['Жапакова Б.С'].conference.id,
                password: KSTU.EF.TB['Жапакова Б.С'].conference.password }
            }),
            
            new FullSubject({ // Урок №2
                subject: { name: 'КС', type: 'Лекция', week: ""}, time: { start: '11:00', end: '12:20' },
                teacher: 'Момуналиева Н.Т', conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link,
                platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform, id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id,
                password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password }
            }),

            new FullSubject({ // Урок №3
                subject: { name: 'СП', type: 'Лекция', week: "" }, time: { start: '13:00', end: '14:20' },
                teacher: 'Исраилова Н.А', conference: { link: KSTU.FIT.IVT['Исраилова Н.А'].conference.link,
                platform: KSTU.FIT.IVT['Исраилова Н.А'].conference.platform, id: KSTU.FIT.IVT['Исраилова Н.А'].conference.id,
                password: KSTU.FIT.IVT['Исраилова Н.А'].conference.password }
            }),

        ],

        'Среда': [
            new FullSubject({ // Урок №1
                subject: { name: 'ЧМВ', type: 'Лекция', week: "" }, time: { start: '9:30', end: '10:50' },
                teacher: 'Момуналиева Н.Т', conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link,
                platform: KSTU.FIT.IVT['Момуналиева Н.Т'].platform, id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id,
                password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password }
            }),

            new FullSubject({ // Урок №2
                subject: { name: 'КГ', type: 'Лабораторная', week: "" }, time: { start: '11:00', end: '12:20' },
                teacher: 'Момуналиева Н.Т', conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link,
                platform: KSTU.FIT.IVT['Момуналиева Н.Т'].platform, id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id,
                password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password }
            }),

            new FullSubject({ // Урок №3
                subject: { name: 'КГ', type: 'Лабораторная', week: "" }, time: { start: '13:00', end: '14:20' },
                teacher: 'Момуналиева Н.Т', conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link,
                platform: KSTU.FIT.IVT['Момуналиева Н.Т'].platform, id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id,
                password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password }
            }),

            new FullSubject({ // Урок №4
                subject: { name: 'Экология', type: 'Лабораторная', week: "" }, time: { start: '14:30', end: '15:50' },
                teacher: 'Исагалиева А.К', conference: { link: KSTU.EF.TB['Исагалиева А.К'].conference.link,
                platform: KSTU.EF.TB['Исагалиева А.К'].platform, id: KSTU.EF.TB['Исагалиева А.К'].conference.id,
                password: KSTU.EF.TB['Исагалиева А.К'].conference.password }
            }),
        ],

        'Четверг': [

            new FullSubject({ // Урок №1
                subject: { name: 'СП', type: 'Лабораторная', week: "" }, time: { start: '9:30', end: '10:50' },
                teacher: 'Бакасова П.С', conference: { link: KSTU.FIT.IVT['Бакасова П.С'].conference.link,
                platform: KSTU.FIT.IVT['Бакасова П.С'].conference.platform, id: KSTU.FIT.IVT['Бакасова П.С'].conference.id,
                password: KSTU.FIT.IVT['Бакасова П.С'].conference.password }
            }),

            new FullSubject({ // Урок №2
                subject: { name: 'СП', type: 'Лабораторная', week: "" }, time: { start: '11:00', end: '12:20' },
                teacher: 'Бакасова П.С', conference: { link: KSTU.FIT.IVT['Бакасова П.С'].conference.link,
                platform: KSTU.FIT.IVT['Бакасова П.С'].conference.platform, id: KSTU.FIT.IVT['Бакасова П.С'].conference.id,
                password: KSTU.FIT.IVT['Бакасова П.С'].conference.password }
            }),

            new FullSubject({ // Урок №3
                subject: { name: 'БЖД', type: 'Практика', week: "Знам" }, time: { start: '13:00', end: '14:20' },
                teacher: 'Мурзаканов А.Н', conference: { link: KSTU.EF.TB['Мурзаканов А.Н'].conference.link,
                platform: KSTU.EF.TB['Мурзаканов А.Н'].conference.platform, id: KSTU.EF.TB['Мурзаканов А.Н'].conference.id,
                password: KSTU.EF.TB['Мурзаканов А.Н'].conference.password }
            }),

            new FullSubject({ // Урок №4
                subject: { name: 'Экология', type: 'Лекция', week: "Знам" }, time: { start: '14:30', end: '15:50' },
                teacher: 'Исагалиева А.К', conference: { link: KSTU.EF.TB['Исагалиева А.К'].conference.link,
                platform: KSTU.EF.TB['Исагалиева А.К'].platform, id: KSTU.EF.TB['Исагалиева А.К'].conference.id,
                password: KSTU.EF.TB['Исагалиева А.К'].conference.password }
            }),
        ],

        'Пятница': [
            new FullSubject({ // Урок №1
                subject: { name: 'ЭВМ', type: 'ПР', week: "Знам", subGroup: '1-группа'}, time: { start: '9:30', end: '10:50' },
                teacher: 'Мананников Н.А', conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link,
                platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform, id: KSTU.FIT.IVT['Мананников Н.А'].conference.id,
                password: KSTU.FIT.IVT['Мананников Н.А'].conference.password }
            }),

            new FullSubject({ // Урок №2
                subject: { name: 'ЭВМ', type: 'Лекция', week: "" }, time: { start: '11:00', end: '12:20' },
                teacher: 'Шабданов М.А', conference: { link: KSTU.FIT.IVT['Шабданов М.А'].conference.link,
                platform: KSTU.FIT.IVT['Шабданов М.А'].conference.platform, id: KSTU.FIT.IVT['Шабданов М.А'].conference.id,
                password: KSTU.FIT.IVT['Шабданов М.А'].conference.password }
            }),

            new FullSubject({ // Урок №3
                subject: { name: 'ЭВМ', type: 'Лабораторная', week: "" }, time: { start: '13:00', end: '14:20' },
                teacher: 'Мананников Н.А', conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link,
                platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform, id: KSTU.FIT.IVT['Мананников Н.А'].conference.id,
                password: KSTU.FIT.IVT['Мананников Н.А'].conference.password }
            }),

            new FullSubject({ // Урок №4
                subject: { name: 'ЧМВ', type: 'Лабораторная', week: "" }, time: { start: '13:00', end: '14:20' },
                teacher: 'Момуналиева Н.Т', conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link,
                platform: KSTU.FIT.IVT['Момуналиева Н.Т'].platform, id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id,
                password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password }
            }),

            new FullSubject({ // Урок №5
                subject: { name: 'ЧМВ', type: 'Лабораторная', week: "" }, time: { start: '14:30', end: '15:50' },
                teacher: 'Момуналиева Н.Т', conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link,
                platform: KSTU.FIT.IVT['Момуналиева Н.Т'].platform, id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id,
                password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password }
            }),

            new FullSubject({ // Урок №6
                subject: { name: 'ЭВМ', type: 'Лабораторная', week: "" }, time: { start: '14:30', end: '15:50' },
                teacher: 'Мананников Н.А', conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link,
                platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform, id: KSTU.FIT.IVT['Мананников Н.А'].conference.id,
                password: KSTU.FIT.IVT['Мананников Н.А'].conference.password }
            }),
        ],
    }
};

/* группа ИВТ-1-18 [END] */


let ISOP_1_18 = {
    groupId: 'isop-1-18',
    
    brief: {
        'Понедельник': [new EmptySubject({groupId: 'isop-1-18', day: 'Понедельник'})],
        'Втоник': [new EmptySubject({groupId: 'isop-1-18', day: 'Вторник'})],
        'Среда': [new EmptySubject({groupId: 'isop-1-18', day: 'Среда'})],
        'Четверг': [new EmptySubject({groupId: 'isop-1-18', day: 'Четверг'})],
        'Пятница': [new EmptySubject({groupId: 'isop-1-18', day: 'Пятница' })],
    }, 
    full: {
        'Понедельник': [new EmptySubject({ groupId: 'isop-1-18', day: 'Понедельник' })],
        'Втоник': [new EmptySubject({ groupId: 'isop-1-18', day: 'Вторник' })],
        'Среда': [new EmptySubject({ groupId: 'isop-1-18', day: 'Среда' })],
        'Четверг': [new EmptySubject({ groupId: 'isop-1-18', day: 'Четверг' })],
        'Пятница': [new EmptySubject({ groupId: 'isop-1-18', day: 'Пятница' })],
    }
}

function addAll(group, type) {

    document.querySelector('.shedule').classList.remove('full');
    document.querySelector('.shedule').classList.remove('brief');
    document.querySelector('.shedule').classList.add(type);

    let id = document.getElementById(group.groupId);
    
    for (let item in group[type]) {

        let AllDicpilineInDay = group[type][item];
        let days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']

        for (let elem in AllDicpilineInDay) {
            let indexDay = days.indexOf(AllDicpilineInDay[elem].day);
            AllDicpilineInDay[elem].append(id.querySelectorAll('.content')[indexDay])
        }
    }

}

function setIndicate(group, day) {

    let days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
    let indexDay = days[day];

    for (let item in group.brief[indexDay]) {
        let dicpiline = group.brief[indexDay][item];

        if (dicpiline.checkLesson('LIVE')) dicpiline.setIndicate('LIVE');
        if (dicpiline.checkLesson('NEXT')) dicpiline.setIndicate('NEXT');
    }
}

addAll(IVT_1_18, 'brief'); // ПЕРЕДЕЛАТЬ !!! ***
setIndicate(IVT_1_18, getPresentDay()); // ПЕРЕДЕЛАТЬ !!! ***

addAll(ISOP_1_18, 'brief'); // ПЕРЕДЕЛАТЬ !!! ***
setIndicate(ISOP_1_18, getPresentDay()); // ПЕРЕДЕЛАТЬ !!! ***

// главная функция для запуска
window.onload = function main() {
    localStorage.clear();

    localStorage.setItem("group-name", "ИВТ-1-18");
    localStorage.setItem("subject", "brief");

    setDay(getPresentDay()); // установить день недели
    showGroupName(getGroupName()); // отобразить имени группы
    setContent(getPresentDay(), localStorage.getItem("group-name")); // установить контент
}
