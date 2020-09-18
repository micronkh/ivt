

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
