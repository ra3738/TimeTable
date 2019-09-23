let map = new Map(), reverseMap = new Map();
var firstSchedule_days = [], firstSchedule_startTime = [], firstSchedule_endTime = [], lecture_courseNames = [];
var timetable_number, timeDifference, table_1, table_2;
var course_name = "", course_number = "";

function setupMaps(){
  var trList = document.getElementsByTagName("tr");
  for (i = 1; i < trList.length; i++){
    map.set(trList[i].id, i-1);
    reverseMap.set(i-1, trList[i].id);
  }
}

function color(){
  for (i = 0; i < firstSchedule_days[timetable_number].length; i++){
    for (j = 0; j < firstSchedule_days[timetable_number][i].length; j++){
      var timing = document.getElementById(firstSchedule_startTime[timetable_number][i]);
      var displayClass = "."+firstSchedule_days[timetable_number][i][j];
      timeDifference = lengthOfTimeDiff(i);
      var cell = timing.querySelector(displayClass);
      cell.style.backgroundColor= "lightgrey";
      cell.rowSpan = timeDifference;
      cell.innerHTML = lecture_courseNames[i];
      removeElements(i, j);
    }
  }
}

// Assumes all inputs are valid and no overlapping classes
function removeElements(i, j){
  var timing = firstSchedule_startTime[timetable_number][i];
  var timeDiff = timeDifference-1;
  while(timeDiff > 0){
    var common_time = map.get(timing);
    common_time = common_time + timeDiff;
    var timing2 = document.getElementById(reverseMap.get(common_time));
    var displayClass = "."+firstSchedule_days[timetable_number][i][j];
    var cell = timing2.querySelector(displayClass);
    cell.remove(cell);
    timeDiff--;
  }
}

function decolor(){
  const demoClass = document.getElementById('table');
  demoClass.remove(demoClass);
  var start_ = document.getElementById('start');
  table_1 = table_2.cloneNode(true);
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

    var academicTerm;
    if (document.getElementById('term1').checked){
      academicTerm = 1;
    } else {
      academicTerm = 2;
    }

    timetable_number = 0

    var li = document.createElement("li");
    var inputValue = course_name + " " + course_number;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    document.getElementById("myUL").appendChild(li)

    request.onload = () => {
        // Extract JSON data from request
        const data = JSON.parse(request.responseText);

        firstSchedule_days = data.firstSchedule_days;
        firstSchedule_startTime = data.firstSchedule_startTime;
        firstSchedule_endTime = data.firstSchedule_endTime;
        lecture_courseNames = data.lecture_courseNames;

        console.log(firstSchedule_days);
        console.log(firstSchedule_startTime);
        console.log(firstSchedule_endTime);

        var original_table = document.getElementById('table');
        table_1 = original_table.cloneNode(true);
        table_2 = original_table.cloneNode(true);
    }

    const data = new FormData();
    data.append('course_number', _course_number);
    data.append('course_name', _course_name)
    data.append('academicTerm', academicTerm)

    // Send request
    request.send(data);
    return false;
  };
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#submitCourses').onclick = () => {
    setupMaps();
    color();
  };
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#next').onclick = () => {
    decolor();
    timetable_number++;
    var inText = ""
    color();
  };
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#previous').onclick = () => {
    decolor();
    timetable_number--;
    color();
  };
});
