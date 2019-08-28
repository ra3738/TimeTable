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

var lecture_days = [];
var lecture_startTime = [];
var timeDifference = 2;
var baseCell;
var removedElements = [];
var table_1;
var table_2;
// var _course_name;
// var _course_number;

function color(){
  for (i = 0; i < lecture_days[timetable_number].length; i++){
    const demoClass = document.getElementsByClassName(lecture_days[timetable_number][i]);
    common_time = map.get(lecture_startTime[timetable_number]);
    demoClass[common_time].style.backgroundColor= "lightgrey";
    // demoClass[common_time].rowSpan = timeDifference;
    demoClass[common_time].innerHTML = ""
    // demoClass[common_time+1].remove(demoClass[common_time+1]);
    // removedElements.push(demoClass[common_time+1]);
    // console.log(removedElements);
  }
}

function decolor(){
  // for (i = 0; i < lecture_days[timetable_number].length; i++){
  //   const demoClass = document.getElementsByClassName(lecture_days[timetable_number][i]);
  //   common_time = map.get(lecture_startTime[timetable_number]);
  //   demoClass[common_time].style.backgroundColor= "white";
  //   // demoClass[common_time].rowSpan = 1;
  //   // demoClass[common_time+1].add(removedElements[0]);
  // }
  const demoClass = document.getElementById('table');
  demoClass.remove(demoClass);
  var start_ = document.getElementById('start');
  table_1 = table_2.cloneNode(true);
  console.log(table_1);
  start_.appendChild(table_1);
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#form').onsubmit = () => {

    const request = new XMLHttpRequest();
    request.open('POST', '/table');

    const _course_name = document.getElementById('course_name').value;
    console.log("course_name: " + _course_name);

    const _course_number = document.getElementById('course_number').value;
    console.log("course_number: " + _course_number);

    request.onload = () => {

        // Extract JSON data from request
        const data = JSON.parse(request.responseText);
        lecture_days = data.lecture_days;
        lecture_startTime = data.lecture_startTime

        console.log(lecture_startTime);
        var original_table = document.getElementById('table');
        table_1 = original_table.cloneNode(true);
        table_2 = original_table.cloneNode(true);
        console.log(table_1);

        color();
    }

    const data = new FormData();
    data.append('course_number', _course_number);
    data.append('course_name', _course_name)

    // Send request
    request.send(data);
    return false;
  };
});


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#next').onclick = () => {
    decolor();
    timetable_number++;
    color();
  };
});
