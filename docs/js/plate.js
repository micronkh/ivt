let timerId;
function showCurrentTime() {
    timerId = setTimeout(function tick() {
        let date = new Date();

        document.querySelector(".watch-date .date").textContent = date.getDate();
        document.querySelector(".watch-alert .day").textContent = 21 - date.getDate();

        let scale = - 100 - (15 * (11 - date.getDate()));
        scale = (scale > 50) ? 50 : scale;
        document.querySelector(".watch-week .week-arrow").style.transform = `rotate(${scale}deg)`;

        let watch = {
            hours: document.querySelector(".watch-tips .minutes"),
            minutes: document.querySelector(".watch-tips .hours"),
            seconds: document.querySelector(".watch-tips .seconds"),
        };
    
        watch.seconds.style.transform = `rotate(${date.getSeconds() * 6}deg)`;
        watch.hours.style.transform = `rotate(${date.getHours() * 30}deg)`;
        watch.minutes.style.transform = `rotate(${date.getMinutes() * 6}deg)`;

        timerId = setTimeout(tick, 1000);
    }, 0);

}

document.onclick = function(event) {
    if (event.target.classList.contains('option-input')) {
        let index = event.target.dataset.index;
        let items = document.querySelectorAll("#todo .todo__item");

        if (index) items[index].classList.toggle('cross');
    }

    document.getElementById('bg').play(); 
}


let [timerContent, wrap, content] = [
    null,
    document.querySelector('.wrapper'),
    document.querySelector('.container-app')];


function toggleShow() {
    timerContent = setTimeout(function tick() {
        
        wrap.classList.toggle('show');
        content.classList.toggle("show");

        timerContent = setTimeout(tick, 10 * 1000);
    }, 0);
}


(function main() {
    showCurrentTime();
    toggleShow();
    document.getElementById("bg").volume = 0.3;
})();

