'use strict' // ES 5-6 ON

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


function setTypeOfWeek() {

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

  
    let typeOfWeek = '';
    for (let i = 0; i < denominator.length; i++) {
        let numFromDenom = (days > denominator[i]) ? (days - denominator[i]) : denominator[i] - days;
        let numFromNumer = (days > numerator[i]) ? (days - numerator[i]) : numerator[i] - days;

        if (numFromDenom + numFromNumer == 7) {

            if (days >= denominator[i] && days < numerator[i]) {
                typeOfWeek = "Числ"; //
                break;
            }
            else {
                typeOfWeek = "Знам"; // 
                break;
            }

        }
        typeOfWeek = "Знам";
    }

    document.getElementById("week").innerText = typeOfWeek;
}



/* выделить переданый в параметр день недели */
function setActiveDay(day) {
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

        setActiveDay(getIndex); // выделить день недели
        setGroupWrap(getIndex, getGroupName()); // показать расписанию выбранного дня недели
    }    
})



// функция для показа расписание для выбранной группы [ПЕРЕДЕЛАТЬ !!!] ***
function setGroupWrap(day, groupName) {

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

        setActiveDay(getPresentDay()); // установить день недели
        showGroupName(getGroupName()); // отобразить имени группы
        setGroupWrap(getPresentDay(), getGroupName()); // показать обёртки для выбранной группы
        setGroupContent();
    };
}


function setGroupContent() {
    let groups = {
        'ИВТ-1-18': IVT_1_18,
        'ИСОП-1-18': ISOP_1_18
    }

    let userProps = {
        groupName: groups[localStorage.getItem('group-name')],
        subjectType: localStorage.getItem('subject')
    }

    let userGroup = new SubjectController(userProps.groupName, userProps.subjectType);
    userGroup.addAll();
}


class EmptySubject {
    constructor({ groupId, day}) {
        this.groupId = groupId;
        this.day = day;
    }

    create() {
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


class Subject {

    constructor({groupId, day, subject: {name, type, week="", subGroup=""}, time: {start:{h: hStart, m: mStart}, end:{h: hEnd, m: mEnd}},
                teacher: {surname, img='img/unnamed.jpg'}, conference: {link="#", platform="unknown", id="?", password="?"}}) {

        this.groupId = groupId;
        this.day = day;
        this.subject = {name, type, week, subGroup};
        this.time = {start: {hStart, mStart}, end: {hEnd, mEnd}};
        this.teacher = {surname, img};
        this.conference = {link, platform, id, password};
    
    }

    create(type) {
        if (type === 'brief' || !type) this.briefSubject();
        if (type === 'full') this.fullSubject();
    } 

    briefSubject() {

        /* Левая часть [Время] */
        let template = function template(h = 0, m = 0) {
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
            end: createElement('span', { className: 'd-block' }, template(this.time.end.hEnd, this.time.end.mEnd)),
        }
        let partLeft = createElement('div', { className: 'flex-column justify-center highlight light subject-time' }, time.start, time.end);


        /* Правая часть */ /* [Блок Предмет + Ссылка] */

        // Ссылка на конференцию
        let path = 'img/' + this.conference.platform + '.png';
        let platformImg = createElement('img', { src: path, alt: this.conference.platform });
        let linkA = createElement("a", { href: this.conference.link, className: 'flex mr-m align-self-center' }, platformImg);

        // Имя_Предмета + Форма обучения + Неделя [Числ | Знам]
        let subSubject = {
            name: createElement('span', { className: 'highlight light d-block mb-s' }, this.subject.name),
            type: createElement('span', { className: 'highlight primary mr-s' }, this.subject.type),
            week: createElement('span', { className: 'highlight warning mr-s text-center' }, this.subject.week),
            subGroup: createElement('span', { className: 'highlight success' }, this.subject.subGroup),
        }
        let subjectWrap = createElement('div', {}, subSubject.name, subSubject.type, subSubject.week, subSubject.subGroup);

        let blockSubject = createElement("div", { className: 'flex' }, linkA, subjectWrap);


        // Блок Преподователь
        let teacherImg = createElement('img', { className: 'staff d-block', alt: this.teacher.surname, src: this.teacher.img });
        let indicator = createElement('span', {});

        this.indicator = indicator; // сохранению ссылки для индикация элемента [LIVE || NEXT]
        let teacherWrap = createElement('div', { className: 'flex-column align-center justify-center ml-m' }, teacherImg, indicator);

        let partRight = createElement('div', { className: 'flex align-center justify-between w-100' }, blockSubject, teacherWrap);


        // Формирование блока-оболочки предмета
        let subject = createElement('div', { className: 'flex p-1' }, partLeft, partRight);
        this.html = subject;
    }

    fullSubject() {

        let template = function template(h, m) {
            let hour = h;
            let min = m;

            if (Number(m) < 10)
                min = '0' + m;

            return hour + ":" + min;
        };

        // Столбец Предмет
        let weekText = this.subject.week != false ? `[${this.subject.week}]` : '';
        let subjectWeek = createElement("span", { className: "highlight warning" }, weekText);
        let subjectName = createElement("span", { className: "d-block highlight text-light" }, this.subject.name, subjectWeek);

        let subjectTime = createElement("span", { className: "d-block" },
            template(this.time.start.hStart, this.time.start.mStart), " - ", template(this.time.end.hEnd, this.time.end.mEnd));

        let subGroupText = this.subject.subGroup != false ? `[${this.subject.subGroup}]` : '';
        let subGroup = createElement('span', { className: 'highlight success' }, subGroupText);
        let subjectType = createElement("span", { className: "d-block highlight primary" }, this.subject.type, subGroup);

        let blockSubject = createElement("div", { className: 'flex-5 flex-column align-center justify-center' },
            subjectName, subjectTime, subjectType);

        // Столбец Перейти
        let path = 'img/' + this.conference.platform + '.png';
        let platformImg = createElement('img', { src: path, alt: this.conference.platform });
        let linkA = createElement("a", { href: this.conference.link }, platformImg);
        let blockGo = createElement('div', { className: 'flex-2 flex align-center justify-center' }, linkA);


        // Столбец Ссылка
        let linkId = {
            left: createElement("span", { className: "mr-1" }, "Id:"),
            right: createElement("span", { className: "mr-1" }, this.conference.id)
        };

        let linkPassword = {
            left: createElement("span", { className: "mr-1" }, "Код:"),
            right: createElement("span", { className: "mr-1" }, this.conference.password)
        };
        let teacherName = createElement("span", { className: "highlight info" }, this.teacher.surname);


        let wrapper = {
            linkIdWrap: createElement("div", {}, linkId.left, linkId.right),
            linkPasswordWrap: createElement("div", {}, linkPassword.left, linkPassword.right),
            teacherNameWrap: createElement("div", {}, teacherName),
        };

        let blockLink = createElement('div', { className: 'flex-5 flex-column justify-center align-center pl-1' },
            wrapper.linkIdWrap, wrapper.linkPasswordWrap, wrapper.teacherNameWrap);


        // Формирование блока-оболочки предмета
        let subject = createElement('div', { className: 'flex' }, blockSubject, blockGo, blockLink);
        this.html = subject;
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

        if (type === 'LIVE') {
            this.indicator.innerText = 'LIVE';
            this.indicator.classList.remove('next-subject');
            this.indicator.classList.add('live-subject');

        }

        if (type === 'NEXT') {
            this.indicator.innerText = 'NEXT';
            this.indicator.classList.remove('live-subject');
            this.indicator.classList.add('next-subject');
        }
    }

    

    fullSubjectHTML() {
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

    briefSubjectHTML() {
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

    append(node) { node.append(this.html); } // добавить в конец node
    prepend(node) { node.prepend(this.html); } // добавить в начало node
    before(node) { node.before(this.html); } // добавить перед node
    after(node) { node.after(this.html); }  // добавить после node
    reaplceWith(node) { node.reaplceWith(this.html); } // заменить node

}


/* База Данных  */
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
                    platform: "zoom",
                    link: "https://us04web.zoom.us/j/74759485570?pwd=RDZNVWlpTXFRazJrY29OWE9DVFk0Zz09",
                    id: "747 5948 5570",
                    password: "w0fU2d",
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
                    platform: "zoom",
                    link: 'https://us02web.zoom.us/j/82470313329?pwd=VCtCSGYrMzVodVc0ZUV5aXVSUEE3QT09',
                    id: "824 7031 3329",
                    password: "1111",
                },
            },

            ["Мананников Н.А"]: {
                fullname: "Мананников Никита Александрович",
                surname: "Manannikov N.A",
                img: function() {
                    return 'img/FIT/IVT/' + this.surname + '.jpg';
                },
                gender: "man",
                conference: {
                    platform: "meet",
                    link: 'https://meet.google.com/bvq-vftp-xwx',
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
                    platform: "zoom",
                    link: 'https://us04web.zoom.us/j/2734483986?pwd=VGRyd0VJQXVOZFFCcDF3MXUveml4UT09',
                    id: "273 448 3986",
                    password: "0000",
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
                    platform: "zoom",
                    link: "https://us04web.zoom.us/j/73099464143?pwd=d2dCZndaYWhKa3BFVnJqU1pidG9sZz09",
                    id: "730 9946 4143",
                    password: "37UCAs",
                },
            },
        },
    },
};


let IVT_1_18 = {

    groupId: 'ivt-1-18',

    'Понедельник': [new EmptySubject({groupId: 'ivt-1-18', day: 'Понедельник'})],

    'Вторник': [

        new Subject({ // Урок №1
            groupId: 'ivt-1-18', day: "Вторник", subject: { name: "Безопасность Жизнедеятельности", type: "Лекция" },
            time: { start: { h: 9, m: 30 }, end: { h: 10, m: 50 } }, teacher: { surname: "Жапакова Б.С", img: KSTU.EF.TB['Жапакова Б.С'].img()},
            conference: { link: KSTU.EF.TB['Жапакова Б.С'].conference.link, platform: KSTU.EF.TB['Жапакова Б.С'].conference.platform,
                          id: KSTU.EF.TB['Жапакова Б.С'].conference.id, id: KSTU.EF.TB['Жапакова Б.С'].conference.password}
        }),
        new Subject({ // Урок №2
            groupId: 'ivt-1-18', day: "Вторник", subject: { name: "Компьютерная Графика", type: "Лекция" },
            time: { start: { h: 11, m: 0 }, end: { h: 12, m: 20 } }, teacher: { surname: "Момуналиева Н.Т", img: KSTU.FIT.IVT['Момуналиева Н.Т'].img() },
            conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform,
                          id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password}
        }),
        new Subject({ // Урок №3
            groupId: 'ivt-1-18', day: "Вторник", subject: { name: "Системное Программирование", type: "Лекция" },
            time: {start: {h:13, m:0}, end: {h:14, m:20}}, teacher: { surname: "Исраилова Н.А", img: KSTU.FIT.IVT['Исраилова Н.А'].img() },
            conference: { link: KSTU.FIT.IVT['Исраилова Н.А'].conference.link, platform: KSTU.FIT.IVT['Исраилова Н.А'].conference.platform,
                          id: KSTU.FIT.IVT['Исраилова Н.А'].conference.id, password: KSTU.FIT.IVT['Исраилова Н.А']}
        }),
    ],

    'Среда': [
        new Subject({ // Урок №1
            groupId: 'ivt-1-18', day: 'Среда', subject: { name: "Человеко-Машинное Взаимодействие", type: "Лекция" },
            time: {start: {h:9, m:30}, end:{h:10, m:50}}, teacher: { surname: "Момуналиева Н.Т", img: KSTU.FIT.IVT['Момуналиева Н.Т'].img() },
            conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform, 
                          id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password}
        }),
        new Subject({ // Урок №2
            groupId: 'ivt-1-18', day: 'Среда', subject: { name: "Компьютерная Графика", type: "Лб", week: "Числ", subGroup: "группа I" },
            time: {start:{h: 11, m:0}, end:{h:12, m:20}}, teacher: {surname: "Момуналиева Н.Т", img: KSTU.FIT.IVT['Момуналиева Н.Т'].img() },
            conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform,
                          id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password }
        }),
        new Subject({ // Урок №3
            groupId: 'ivt-1-18', day: 'Среда', subject: { name: "Компьютерная Графика", type: "Лб", week: "Числ", subGroup: "группа I" },
            time: {start:{h: 13, m:0}, end: {h:14, m:20} }, teacher: { surname: "Момуналиева Н.Т", img: KSTU.FIT.IVT['Момуналиева Н.Т'].img() },
            conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform,
                          id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password}
        }),
        new Subject({ // Урок №2
            groupId: 'ivt-1-18', day: 'Среда', subject: { name: "Компьютерная Графика", type: "Лб", week: "Знам", subGroup: "группа II" },
            time: { start: { h: 11, m: 0 }, end: { h: 12, m: 20 } }, teacher: { surname: "Момуналиева Н.Т", img: KSTU.FIT.IVT['Момуналиева Н.Т'].img() },
            conference: {
                link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform,
                id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password
            }
        }),
        new Subject({ // Урок №3
            groupId: 'ivt-1-18', day: 'Среда', subject: { name: "Компьютерная Графика", type: "Лб", week: "Знам", subGroup: "группа II" },
            time: { start: { h: 13, m: 0 }, end: { h: 14, m: 20 } }, teacher: { surname: "Момуналиева Н.Т", img: KSTU.FIT.IVT['Момуналиева Н.Т'].img() },
            conference: {
                link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform,
                id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password
            }
        }),

    ],

    'Четверг': [
        new Subject({ // Урок №1
            groupId: 'ivt-1-18', day: 'Четверг', subject: { name: "Безопасность Жизнедеятельности", type: "Пр", week: 'Знам' },
            time: {start:{h:8, m:0}, end:{h:9, m:20}}, teacher: { surname: "Мурзаканов А.Н", img: KSTU.EF.TB['Мурзаканов А.Н'].img() },
            conference: { link: KSTU.EF.TB['Мурзаканов А.Н'].conference.link, platform: KSTU.EF.TB['Мурзаканов А.Н'].conference.platform,
                          id: KSTU.EF.TB['Мурзаканов А.Н'].conference.id, password: KSTU.EF.TB['Мурзаканов А.Н'].conference.password}
        }),

        new Subject({ // Урок №2
            groupId: 'ivt-1-18', day: 'Четверг', subject: { name: "Системное Программирование", type: "Лб", week: "Числ", subGroup: "группа I" },
            time: {start:{ h:9, m:30}, end:{h:10, m:50}}, teacher: { surname: "Бакасова П.С", img: KSTU.FIT.IVT['Бакасова П.С'].img() },
            conference: { link: KSTU.FIT.IVT['Бакасова П.С'].conference.link, platform: KSTU.FIT.IVT['Бакасова П.С'].conference.platform,
                          id: KSTU.FIT.IVT['Бакасова П.С'].conference.id, password: KSTU.FIT.IVT['Бакасова П.С'].conference.password}
        }),
        new Subject({ // Урок №3
            groupId: 'ivt-1-18', day: 'Четверг', subject: { name: "Системное Программирование", type: "Лб", week: "Числ", subGroup: "группа I"},            
            time: {start:{h:11, m:0}, end:{h:12, m:20}}, teacher: { surname: "Бакасова П.С", img: KSTU.FIT.IVT['Бакасова П.С'].img() },
            conference: { link: KSTU.FIT.IVT['Бакасова П.С'].conference.link, platform: KSTU.FIT.IVT['Бакасова П.С'].conference.platform,
                          id: KSTU.FIT.IVT['Бакасова П.С'].conference.id, password: KSTU.FIT.IVT['Бакасова П.С'].conference.password}
        }),
        new Subject({ // Урок №2
            groupId: 'ivt-1-18', day: 'Четверг', subject: { name: "Системное Программирование", type: "Лб", week: "Знам", subGroup: "группа II" },
            time: {start:{ h:9, m:30}, end:{h:10, m:50}}, teacher: { surname: "Бакасова П.С", img: KSTU.FIT.IVT['Бакасова П.С'].img() },
            conference: { link: KSTU.FIT.IVT['Бакасова П.С'].conference.link, platform: KSTU.FIT.IVT['Бакасова П.С'].conference.platform,
                          id: KSTU.FIT.IVT['Бакасова П.С'].conference.id, password: KSTU.FIT.IVT['Бакасова П.С'].conference.password}
        }),
        new Subject({ // Урок №3
            groupId: 'ivt-1-18', day: 'Четверг', subject: { name: "Системное Программирование", type: "Лб", week: "Знам", subGroup: "группа II"},
            time: {start:{h:11, m:0}, end:{h:12, m:20}}, teacher: { surname: "Бакасова П.С", img: KSTU.FIT.IVT['Бакасова П.С'].img() },
            conference: { link: KSTU.FIT.IVT['Бакасова П.С'].conference.link, platform: KSTU.FIT.IVT['Бакасова П.С'].conference.platform,
                          id: KSTU.FIT.IVT['Бакасова П.С'].conference.id, password: KSTU.FIT.IVT['Бакасова П.С'].conference.password}
        }),
     
        new Subject({ // Урок №4
            groupId: 'ivt-1-18', day: 'Четверг', subject: { name: "Экология", type: "Лк", week: 'Знам' },
            time: {start:{h:14, m:30}, end:{h:15, m:50}}, teacher: { surname: "Исагалиева А.К", img: KSTU.EF.TB['Исагалиева А.К'].img() },
            conference: { link: KSTU.EF.TB['Исагалиева А.К'].conference.link, platform: KSTU.EF.TB['Исагалиева А.К'].conference.platform,
                          id: KSTU.FIT.IVT['Бакасова П.С'].conference.id, password: KSTU.FIT.IVT['Бакасова П.С'].conference.password}
        }),

        new Subject({ // Урок №4
            groupId: 'ivt-1-18', day: 'Четверг', subject: { name: "Экология", type: "Лабораторная", week: 'Знам' },
            time: {start:{h:16, m:0}, end:{h:17, m:20}}, teacher: { surname: "Исагалиева А.К", img: KSTU.EF.TB['Исагалиева А.К'].img() },
            conference: { link: KSTU.EF.TB['Исагалиева А.К'].conference.link, platform: KSTU.EF.TB['Исагалиева А.К'].conference.platform,
                          id: KSTU.EF.TB['Исагалиева А.К'].conference.id, password: KSTU.EF.TB['Исагалиева А.К'].conference.password}
        }),
    ],

    'Пятница': [
        new Subject({ // Урок №1
            groupId: 'ivt-1-18', day: 'Пятница', subject: { name: "ЭВМ и Периферийные Устройства", type: "Пр", week: 'Знам' },
            time: {start:{h:9, m:30}, end:{ h:10, m:50}}, teacher: { surname: "Мананников Н.А", img: KSTU.FIT.IVT['Мананников Н.А'].img() },
            conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link, platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform,
                          id: KSTU.FIT.IVT['Мананников Н.А'].conference.id, password: KSTU.FIT.IVT['Мананников Н.А'].conference.password}
        }),
        new Subject({ // Урок №2
            groupId: 'ivt-1-18', day: 'Пятница', subject: { name: "ЭВМ и Периферийные Устройства", type: "Лекция" },
            time: {start:{h:11, m:0}, end:{h: 12, m:20}}, teacher: { surname: "Шабданов М.А", img: KSTU.FIT.IVT['Шабданов М.А'].img() },
            conference: { link: KSTU.FIT.IVT['Шабданов М.А'].conference.link, platform: KSTU.FIT.IVT['Шабданов М.А'].conference.platform,
                          id: KSTU.FIT.IVT['Шабданов М.А'].conference.id, password: KSTU.FIT.IVT['Шабданов М.А'].conference.password}
        }),

        
         new Subject({ // Урок №3
            groupId: 'ivt-1-18', day: 'Пятница', subject: { name: "ЭВМ и Периферийные Устройства", type: "Лб", week: "Числ"},
            time: {start:{h:13, m:0}, end:{ h:14, m:20}}, teacher: { surname: "Мананников Н.А", img: KSTU.FIT.IVT['Мананников Н.А'].img() },
            conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link, platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform,
                          id: KSTU.FIT.IVT['Мананников Н.А'].conference.id, password: KSTU.FIT.IVT['Мананников Н.А'].conference.password}
        }),

       
        new Subject({ // Урок №4
            groupId: 'ivt-1-18', day: 'Пятница', subject: { name: "ЭВМ и Периферийные Устройства", type: "Лб", week: "Числ"},
            time: {start:{h:14, m:30}, end:{h:15, m:50}}, teacher: { surname: "Мананников Н.А", img: KSTU.FIT.IVT['Мананников Н.А'].img() },
            conference: { link: KSTU.FIT.IVT['Мананников Н.А'].conference.link, platform: KSTU.FIT.IVT['Мананников Н.А'].conference.platform,
                          id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password}
        }),

        new Subject({ // Урок №3
            groupId: 'ivt-1-18', day: 'Пятница', subject: { name: "Человеко-Машинное Взаимодействие", type: "Лб", week: "Знам"},
            time: {start:{h:13, m:0}, end:{h:14, m:20}}, teacher: { surname: "Момуналиева Н.Т", img: KSTU.FIT.IVT['Момуналиева Н.Т'].img() },
            conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform,
                          id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password}
        }),

        new Subject({ // Урок №4
            groupId: 'ivt-1-18', day: 'Пятница', subject: { name: "Человеко-Машинное Взаимодействие", type: "Лб", week: "Знам"},
            time: {start:{h:14, m:30}, end:{h:15, m:50}}, teacher: { surname: "Момуналиева Н.Т", img: KSTU.FIT.IVT['Момуналиева Н.Т'].img() },
            conference: { link: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.link, platform: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.platform,
                          id: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.id, password: KSTU.FIT.IVT['Момуналиева Н.Т'].conference.password}
        }),

       
    ]
};


let ISOP_1_18 = {

    groupId: 'isop-1-18',

    'Понедельник': [new EmptySubject({ groupId: 'isop-1-18', day: 'Понедельник' })],
    'Втоник': [new EmptySubject({ groupId: 'isop-1-18', day: 'Вторник' })],
    'Среда': [new EmptySubject({ groupId: 'isop-1-18', day: 'Среда' })],
    'Четверг': [new EmptySubject({ groupId: 'isop-1-18', day: 'Четверг' })],
    'Пятница': [new EmptySubject({ groupId: 'isop-1-18', day: 'Пятница' })],
}


class SubjectController {
    
    static days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];
    static groups = ['ИВТ-1-18', 'ИСОП-1-18'];
    static subjectTypes = ['brief', 'full'];

    constructor(group, type = "brief", updateStatus = 5000) {
        this.group = group;
        this.delay = updateStatus;
        this.type = type;
        this.container = document.getElementById(group.groupId); // контейнер группы в html структуре
    }


    setIndicate() {
        

        let dayIndex = getPresentDay();
        let dayName = SubjectController.days[dayIndex];

        for (let item in this.group[dayName]) {
            let dicpiline = this.group[dayName][item];

            if (dicpiline.__proto__ === Subject.prototype) {

                if (dicpiline.subject.week.length > 0) {
                    if (dicpiline.subject.week != document.getElementById('week').innerText) {
                        dicpiline.checkLesson = () => undefined;
                    }
                } 
                
                if (dicpiline.checkLesson('LIVE')) { dicpiline.setIndicate('LIVE')}
                if (dicpiline.checkLesson('NEXT')) { dicpiline.setIndicate('NEXT')}
            }
        }
      
    }

    clearContentBlocks() {
        let contentBlocks = this.container.querySelectorAll('.content');
        contentBlocks.forEach(item => item.innerHTML = "");
    }

    addAll() {
        
       this.clearContentBlocks() // перед доавбленеим очищать

        let shedule = document.querySelector('.shedule');
        
        SubjectController.subjectTypes.forEach(item => shedule.classList.remove(item))
        shedule.classList.add(this.type);
        
        
        for (let item in this.group) {

            let AllDicpilineInDay = this.group[item];

            if (typeof AllDicpilineInDay === 'object') {
                
                for (let elem in AllDicpilineInDay) {

                    AllDicpilineInDay[elem].create(this.type);

                    let indexDay = SubjectController.days.indexOf(AllDicpilineInDay[elem].day);
                    let contentBlock = this.container.querySelectorAll('.content')[indexDay];
                    AllDicpilineInDay[elem].append(contentBlock);
                }
            } 
            
        }

        if (this.type === "brief")  {
            this.setIndicate();
            this.timer = setInterval(() => this.setIndicate(), this.delay);
        }

    }
    
}

/* Глобальные параметры [START] */
let defaultProps = {
    "group-name": "ИВТ-1-18",
    "subject": "brief",
};

function setProps(obj) {
    for (let [key, value] of Object.entries(obj))
        localStorage.setItem(key, value);
}

window.onload = function main() {
    setProps(defaultProps);
    setTypeOfWeek(); // установить тип недели [знаминатель или числитель]
    setActiveDay(getPresentDay()); // установить день недели
    showGroupName(getGroupName()); // отобразить имени группы
    setGroupWrap(getPresentDay(), getGroupName()); // показать блок-обёртку за текущий день
    setGroupContent();  // добавить расписанию группу в обёртку
}
