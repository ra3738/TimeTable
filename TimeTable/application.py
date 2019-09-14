import requests
import urllib.request
from bs4 import BeautifulSoup

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

map = {"8:00": 0, "8:30": 1, "9:00": 2, "9:30": 3, "10:00": 4, "10:30": 5, "11:00": 6, "11:30": 7, "12:00": 8, "12:30": 9, "13:00": 10, "13:30": 11, "14:00": 12, "14:30": 13,
       "15:00": 14, "15:30": 15, "16:00": 16, "16:30": 17, "17:00": 18, "17:30": 19, "18:00": 20, "18:30": 21, "19:00": 22, "19:30": 23, "20:00": 24, "20:30": 25, "21:00": 26}

# class_type, class_days, class_startTime, class_endTime = [], [], [], []
course_name, course_number, academicTerm = "", "", 0
lecture_days, lecture_startTime, lecture_endTime, lecture_courseNames = [], [], [], []
firstSchedule_days, firstSchedule_startTime, firstSchedule_endTime = [], [], []
secondSchedule_days, secondSchedule_startTime, secondSchedule_endTime = [], [], []

def isThereConflict(i, j):
    for k in range(len(firstSchedule_days[i])):
        if (((map.get(firstSchedule_startTime[i][k]) <= map.get(secondSchedule_startTime[j]) < map.get(firstSchedule_endTime[i][k])) or
             (map.get(firstSchedule_startTime[i][k]) < map.get(secondSchedule_endTime[j]) <= map.get(firstSchedule_endTime[i][k]))) and
             (firstSchedule_days[i][k] == secondSchedule_days[j])):
            return True
    return False

def filterOut():
    global firstSchedule_days, firstSchedule_startTime, firstSchedule_endTime
    global secondSchedule_days, secondSchedule_startTime, secondSchedule_endTime

    if not firstSchedule_days:
        for i in range(len(secondSchedule_days)):
            firstSchedule_days.append([secondSchedule_days[i]])
            firstSchedule_startTime.append([secondSchedule_startTime[i]])
            firstSchedule_endTime.append([secondSchedule_endTime[i]])
        return

    temp_days, temp_startTime, temp_endTime = [], [], []

    for i in range(len(firstSchedule_days)):
        for j in range(len(secondSchedule_days)):
            if not isThereConflict(i, j):
                daysToAppend = firstSchedule_days[i].copy()
                temp_days.append(daysToAppend)
                startTimeToAppend = firstSchedule_startTime[i].copy()
                temp_startTime.append(startTimeToAppend)
                endTimeToAppend = firstSchedule_endTime[i].copy()
                temp_endTime.append(endTimeToAppend)
                index = len(temp_days)-1
                temp_days[index].append(secondSchedule_days[j])
                temp_startTime[index].append(secondSchedule_startTime[j])
                temp_endTime[index].append(secondSchedule_endTime[j])

    firstSchedule_days = temp_days
    firstSchedule_startTime = temp_startTime
    firstSchedule_endTime = temp_endTime

def parser():
    global lecture_days, lecture_startTime, lecture_endTime, lecture_courseNames
    lecture_days, lecture_startTime, lecture_endTime = [], [], []

    url = "https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=" + course_name + "&course=" + course_number
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    section1 = soup.findAll('tr', class_='section1')
    section2 = soup.findAll('tr', class_='section2')
    section1 = section1+section2

    for i in range(len(section1)):
        section1_tdList = section1[i].findAll('td')
        if section1_tdList[2].getText() == "Lecture":
            if section1_tdList[3].getText() == academicTerm:
                lecture_days.append(section1_tdList[5].getText().split())
                lecture_startTime.append(section1_tdList[6].getText())
                lecture_endTime.append(section1_tdList[7].getText())

    global secondSchedule_days, secondSchedule_startTime, secondSchedule_endTime
    secondSchedule_days = lecture_days
    secondSchedule_startTime = lecture_startTime
    secondSchedule_endTime = lecture_endTime
    lecture_courseNames.append(course_name+" "+course_number)

    print(lecture_days)
    print(lecture_startTime)
    print(lecture_endTime)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/table", methods=["POST"])
def table():
    global course_name, course_number, academicTerm
    course_name = request.form.get("course_name")
    course_number = request.form.get("course_number")
    academicTerm = request.form.get("academicTerm")
    print("academicTerm: ", academicTerm)
    parser()
    filterOut()
    return jsonify({"firstSchedule_days": firstSchedule_days, "firstSchedule_startTime": firstSchedule_startTime,
                    "firstSchedule_endTime": firstSchedule_endTime, "lecture_courseNames": lecture_courseNames})
