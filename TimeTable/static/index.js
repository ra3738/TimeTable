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

var lecture_days = [];
var lecture_startTime = [];
var timeDifference = 2;
var baseCell;
var removedElements = [];
var table_1;
var table_2;
var course_name = "";
var course_number = "";

function color(){
  for (i = lecture_days[timetable_number].length-1; i >= 0; i--){
    var timing = document.getElementById(lecture_startTime[timetable_number]);
    var td_list = timing.getElementsByTagName("td");
    var j = td_list.length-1;
    while (j > 0){
      var class_name = td_list[j].className;
      class_name = class_name.split(" ");
      if (class_name[1] === lecture_days[timetable_number][i]){
        td_list[j].style.backgroundColor= "lightgrey";
        td_list[j].rowSpan = timeDifference;
        td_list[j].innerHTML = course_name + " " + course_number;
        removeElements(j);
        break;
      }
      j--;
    }
  }
}

// Assumes all inputs are valid and no overlapping classes
function removeElements(j){
  var timing = lecture_startTime[timetable_number];
  var timeDiff = timeDifference-1;
  console.log("Removed Element");
  while(timeDiff > 0){
    var common_time = map.get(timing);
    common_time = common_time + timeDiff;
    var timing = document.getElementById(reverseMap.get(common_time));
    var td_list = timing.getElementsByTagName("td");
    td_list[j].remove(td_list[j]);
    timeDiff--;
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

// function lengthOfTimeDiff(i){
//   const demoClass = document.getElementsByClassName(lecture_days[timetable_number][i]);
//   startTime = map.get(lecture_startTime[timetable_number]);
//   endTime = map.get(lecture_endTime[timetable_number]);
//   return ( (endTime - startTime)/2 + ((endTime - startTime)%2) );
// }

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
