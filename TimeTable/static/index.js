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
map.set("20:00", 22)


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
  for (i = 0; i < lecture_days[timetable_number].length; i++){
    const demoClass = document.getElementsByClassName(lecture_days[timetable_number][i]);
    common_time = map.get(lecture_startTime[timetable_number]);
    console.log(common_time);
    demoClass[common_time].style.backgroundColor= "lightgrey";
    // timeDifference = lengthOfTimeDiff(i);
    demoClass[common_time].rowSpan = timeDifference;
    demoClass[common_time].innerHTML = course_name + " " + course_number;
    // while (timeDifference > 1){
    demoClass[common_time+1].remove(demoClass[common_time+1]);
    //   timeDifference--;
    // }
    console.log("common_time: " + common_time);


    var printText = document.getElementById("row_9:00");
    var printText1 = printText.getElementsByTagName("td");
    var i = 0;
    while (i < printText1.length){
      var class_name = printText1[i].className;
      class_name = class_name.split(" ");
      console.log(class_name[1]);

      if (class_name[1] === ("Tue")){
        printText1[i].innerHTML = "RANDOM";
        break;
      }

      i++
    }
    // printText2.innerHTML = "TEST_DATA";

    // ------------------
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
