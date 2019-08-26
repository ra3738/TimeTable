let timetable_number = 0;

let map = new Map();
map.set("9:00", 0);
map.set("9:30", 1);
map.set("10:00", 2);
map.set("10:30", 3);
map.set("11:00", 4);
map.set("11:30", 5);
map.set("12:00", 6);
map.set("12:30", 7);
map.set("13:00", 8);
map.set("13:30", 9);
map.set("14:00", 10);
map.set("14:30", 11);
map.set("15:00", 12);
map.set("15:30", 13);
map.set("16:00", 14);
map.set("16:30", 15);
map.set("17:00", 16);
map.set("17:30", 17);
map.set("18:00", 18);

let lecture_days = [];
let lecture_startTime = [];


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#form').onsubmit = () => {

    const request = new XMLHttpRequest();
    request.open('POST', '/table');

    request.onload = () => {

        // Extract JSON data from request
        const data = JSON.parse(request.responseText);
        lecture_days = data.lecture_days;
        lecture_startTime = data.lecture_startTime

        console.log(data.success);

        for (i = 0; i < lecture_days[timetable_number].length; i++){
          const demoClass = document.getElementsByClassName(lecture_days[timetable_number][i]);
          common_time = map.get(lecture_startTime[timetable_number]);
          demoClass[common_time].style.backgroundColor= "lightgrey";
          demoClass[common_time].rowSpan = "2";
        }
    }

    const data = new FormData();
    // data.append('currency', currency);

    // Send request
    request.send(data);
    return false;
  };
});


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#next').onclick = () => {
    for (i = 0; i < lecture_days[timetable_number].length; i++){
      const demoClass = document.getElementsByClassName(lecture_days[timetable_number][i]);
      common_time = map.get(lecture_startTime[timetable_number]);
      demoClass[common_time].style.backgroundColor= "white";
    }

    timetable_number++;

    for (i = 0; i < lecture_days[timetable_number].length; i++){
      const demoClass = document.getElementsByClassName(lecture_days[timetable_number][i]);
      common_time = map.get(lecture_startTime[timetable_number]);
      demoClass[common_time].style.backgroundColor= "lightgrey";
    }

  };
});
