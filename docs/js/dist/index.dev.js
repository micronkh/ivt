"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var weekMsg = document.getElementById("week"); // Неделя - Числитель или Знаминатель?

(function () {
  /* Формирование массива из дней недели числитель или знаминатель */
  var denominator = []; // Знаминатель

  var numerator = []; // Числитель

  var flag = true;

  for (var i = 257; i < 365; i += 7) {
    // счет начинается с 14-сентября, прошло 257 дней с начала года
    if (flag == true) {
      denominator.push(Math.round(i));
      flag = false;
    } else {
      numerator.push(Math.round(i));
      flag = true;
    }
  }

  var date = new Date('January 1, 2020 00:00:00'); // 1-январь 2020-года

  var currentDate = Date.parse(new Date()); // текущая дата

  var days = (currentDate - Date.parse(date)) / 86400000; // 1 сутка = 86 400 000 миллисекунд 

  for (var _i = 0; _i < denominator.length; _i++) {
    var numFromDenom = days > denominator[_i] ? days - denominator[_i] : denominator[_i] - days;
    var numFromNumer = days > numerator[_i] ? days - numerator[_i] : numerator[_i] - days;

    if (numFromDenom + numFromNumer == 7) {
      if (days >= denominator[_i] && days < numerator[_i]) {
        weekMsg.innerText = "Числ"; //

        break;
      } else {
        weekMsg.innerText = "Знам"; // 

        break;
      }
    }

    weekMsg.innerText = "Знам";
  }
})(); // функция для более удобной и быстрой создание элементов 


function createElement(tag, props) {
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var element = document.createElement(tag);

  for (var _i2 = 0, _Object$entries = Object.entries(props); _i2 < _Object$entries.length; _i2++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    element[key] = value;
  }

  children.forEach(function (item) {
    if (typeof item === 'string') {
      var textNode = document.createTextNode(item);
      element.appendChild(textNode);
    } else element.appendChild(item);
  });
  return element;
} // функция для показа уведомлений, который удалится через time секунд


function alert(msg, time, style) {
  var div = createElement("div", {
    className: "alert ".concat(style),
    id: "alert"
  }, [msg]);
  document.querySelector(".container-app").append(div);
  setTimeout(function () {
    document.getElementById("alert").remove();
  }, time); // Пример: alert("Добро Пожаловать", 1000, "success bold");
} // сообщение для отсталых


function helpMsg() {
  var aware = localStorage.getItem('aware');
  var modal = document.querySelector('.modal');

  if (!aware) {
    modal.classList.add('show');
    var checkBtn = modal.querySelector('#instruction');

    checkBtn.onclick = function () {
      var check = modal.querySelector('.option-input').checked;

      if (check) {
        localStorage.setItem('aware', true);
      }

      modal.remove();
    };
  } else modal.remove();
}
/* получиль какой сегодня день, вместо суббота и вокресенье возвращает понедельник*/


function getPresentDay() {
  var dayToday = new Date().getDay();
  dayToday -= 1;
  if (dayToday <= 0 || dayToday >= 5) return 0;else return dayToday;
}
/* выделить переданый в параметр день недели */


function setDay(day) {
  var getIndex = day;
  var days = shedule.allDays;
  days.forEach(function (day) {
    day.classList.remove('active');
  });
  days[getIndex].classList.add('active');
}

var shedule = {
  self: document.querySelector(".shedule"),
  // главный блок график
  sheduleDay: document.querySelector(".shedule__day"),
  // вкладка дни [родитель-объертка]
  allDays: document.querySelectorAll('.shedule__day .day'),
  // вкладки дни [5 элементов]
  content: document.querySelectorAll('.shedule__content') // тело расписании

}; // функция для показа расписание для выбранной группы

function setContent(day, groupName) {
  var indexContent = groupName || 'ivt-1-18'; // если groupName пустой по умолчанию показать ИВТ-1-18

  var contentWrap = document.querySelector('#' + indexContent);
  var allContent = shedule.content;
  allContent.forEach(function (element) {
    element.classList.remove('show');
  });
  contentWrap.classList.add('show');
  var content = contentWrap.querySelectorAll('.content');
  content.forEach(function (element) {
    element.classList.remove('show');
  });
  content[day].classList.add('show');
} // добавление возможности выборки дней 


shedule.sheduleDay.addEventListener('click', function (event) {
  var getDay = event.target.closest('.day');
  if (!getDay) return;
  var getIndex = getDay.getAttribute("data-index") || 0;
  if (!getDay.classList.contains('active')) setDay(getIndex);else return;
  setContent(getIndex, getGroupName());
});
var groupShowNames = {
  'ivt-1-18': 'ИВТ-1-18',
  'isop-1-18': 'ИСОП-1-18'
}; // показать расписанию в зависимости от выбранной группы

var showToDOM = {
  choiceGroup: document.getElementById('choice-group'),
  dropdown: document.querySelector('.dropdown.group'),
  nameGroup: document.getElementById('name-group')
};

function getGroupName() {
  return shedule.self.dataset.group;
}

function setGroupname(newValue) {
  shedule.self.dataset.group = newValue;
}

function showGroupName(newValue) {
  showToDOM.nameGroup.innerText = newValue;
} // показать расписанию в зависимости от выбранной группы


showToDOM.choiceGroup.onclick = function () {
  var dropdown = showToDOM.dropdown;
  dropdown.classList.toggle('show');

  dropdown.onclick = function (event) {
    var getGroupName = event.target.dataset.group;
    dropdown.classList.remove('show');
    setDay(getPresentDay());
    setGroupname(getGroupName);
    showGroupName(groupShowNames[getGroupName]);
    setContent(getPresentDay(), getGroupName);
    localStorage.setItem('group-name', getGroupName);
    localStorage.setItem('group-name-rus', groupShowNames[getGroupName]);
  };
};

var colours = ["sea-blue", "skyline", "lawrencuium", "dark-ocean", "amin", "seleniuim", "ocean", "celestial", "orca", "frost", "royal", "dark-sky", "virgin", "turquoise", "twitch", "ash"]; // [min; max)

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
/* установить какой то случайный цвет на фон */


function setRandomColor() {
  var length = colours.length;
  var colorName = colours[rand(0, length)];
  document.body.classList.add(colorName);
} // при загрузке страницы показать расписанию


window.onload = function main() {
  setRandomColor(); // установить рандонмый цвет фона

  /* Показать расписанию по выбранное группе за текущий день [START] */

  var groupNameId = localStorage.getItem("group-name") || getGroupName();
  var presentDay = getPresentDay();
  setDay(presentDay);
  setGroupname(groupNameId);
  showGroupName(groupShowNames[groupNameId]);
  setContent(presentDay, groupNameId);
  /* Показать расписанию по выбранное группе за текущий день [END] */

  helpMsg(); // инструкция
};