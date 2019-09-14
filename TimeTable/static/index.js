var timetable_number;

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
map.set("18:30", 19);
map.set("19:00", 20);
map.set("19:30", 21);
map.set("20:00", 22);

let reverseMap = new Map();
reverseMap.set(0, "9:00");
reverseMap.set(1, "9:30");
reverseMap.set(2, "10:00");
reverseMap.set(3, "10:30");
reverseMap.set(4, "11:00");
reverseMap.set(5, "11:30");
reverseMap.set(6, "12:00");
reverseMap.set(7, "12:30");
reverseMap.set(8, "13:00");
reverseMap.set(9, "13:30");
reverseMap.set(10, "14:00");
reverseMap.set(11, "14:30");
reverseMap.set(12, "15:00");
reverseMap.set(13, "15:30");
reverseMap.set(14, "16:00");
reverseMap.set(15, "16:30");
reverseMap.set(16, "17:00");
reverseMap.set(17, "17:30");
reverseMap.set(18, "18:00");
reverseMap.set(19, "18:30");
reverseMap.set(20, "19:00");
reverseMap.set(21, "19:30");
reverseMap.set(22, "20:00")

// var lecture_days = [];
// var lecture_startTime = [];
// var lecture_endTime = [];

var firstSchedule_days = [];
var firstSchedule_startTime = [];
var firstSchedule_endTime = [];
var lecture_courseNames = []

var timeDifference;
var baseCell;
var removedElements = [];
var table_1;
var table_2;
var course_name = "";
var course_number = "";

function color(){
  for (i = 0; i < firstSchedule_days[timetable_number].length; i++){
    for (j = 0; j < firstSchedule_days[timetable_number][i].length; j++){
      // console.log("");
      // console.log("Line 73");
      var timing = document.getElementById(firstSchedule_startTime[timetable_number][i]);
      // console.log("Line 75");
      var displayClass = "."+firstSchedule_days[timetable_number][i][j];
      // console.log("Line 77");
      timeDifference = lengthOfTimeDiff(i);
      var cell = timing.querySelector(displayClass);
      // console.log("Line 80");
      // console.log(firstSchedule_startTime[timetable_number][i]);
      cell.style.backgroundColor= "lightgrey";
      cell.rowSpan = timeDifference;
      cell.innerHTML = lecture_courseNames[i];
      removeElements(i, j);
      // console.log("Line 85");


      // console.log("!!!!!!");
      // console.log(firstSchedule_days[timetable_number][i]);
      // console.log(firstSchedule_days[timetable_number][i][j]);
      // console.log(firstSchedule_startTime[timetable_number][i]);
      // console.log(firstSchedule_endTime[timetable_number][i]);
      // console.log("!!!!!!");
    }
  }
}

// Assumes all inputs are valid and no overlapping classes
function removeElements(i, j){
  // console.log("Line 101");
  var timing = firstSchedule_startTime[timetable_number][i];
  var timeDiff = timeDifference-1;
  // console.log("Line 104");
  while(timeDiff > 0){
    var common_time = map.get(timing);
    common_time = common_time + timeDiff;
    // console.log("Line 108");
    var timing2 = document.getElementById(reverseMap.get(common_time));
    // console.log("Line 110");
    // console.log(firstSchedule_days[timetable_number][i][j]);
    var displayClass = "."+firstSchedule_days[timetable_number][i][j];
    // console.log("Line 112");
    var cell = timing2.querySelector(displayClass);
    // console.log("Line 114");
    // console.log(cell);
    cell.remove(cell);
    timeDiff--;
    // console.log("Line 117");
  }
}

function decolor(){
  const demoClass = document.getElementById('table');
  demoClass.remove(demoClass);
  var start_ = document.getElementById('start');
  table_1 = table_2.cloneNode(true);
  console.log(table_1);
  start_.appendChild(table_1);
}

function lengthOfTimeDiff(i){
  startTime = map.get(firstSchedule_startTime[timetable_number][i]);
  endTime = map.get(firstSchedule_endTime[timetable_number][i]);
  return endTime-startTime;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#form').onsubmit = () => {
    const request = new XMLHttpRequest();
    request.open('POST', '/table');

    var _course_name = document.getElementById('course_name').value;
    course_name = _course_name;
    console.log("course_name: " + _course_name);

    var _course_number = document.getElementById('course_number').value;
    course_number = _course_number;
    console.log("course_number: " + _course_number);

    timetable_number = 0

    request.onload = () => {
        // Extract JSON data from request
        const data = JSON.parse(request.responseText);
        // lecture_days = data.lecture_days;
        // lecture_startTime = data.lecture_startTime;
        // lecture_endTime = data.lecture_endTime;
        //
        // console.log(lecture_days);
        // console.log(lecture_startTime);
        // console.log(lecture_endTime);

        firstSchedule_days = data.firstSchedule_days;
        firstSchedule_startTime = data.firstSchedule_startTime;
        firstSchedule_endTime = data.firstSchedule_endTime;
        lecture_courseNames = data.lecture_courseNames;

        var original_table = document.getElementById('table');
        table_1 = original_table.cloneNode(true);
        table_2 = original_table.cloneNode(true);
        console.log(table_1);
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
  document.querySelector('#submitCourses').onclick = () => {
    color();
  };
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#next').onclick = () => {
    decolor();
    timetable_number++;
    color();
  };
});
