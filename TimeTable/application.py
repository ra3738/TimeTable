import requests
import urllib.request
from bs4 import BeautifulSoup

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

course_name = ""
course_number = ""

# class_type = []
# class_days = []
# class_startTime = []
# class_endTime = []

lecture_days = []
lecture_startTime = []
lecture_endTime = []

# list_days = []
# list_startTime = []
# list_endTime = []
# list_courseNames = []

firstSchedule_days = []
firstSchedule_startTime = []
firstSchedule_endTime = []

secondSchedule_days = []
secondSchedule_startTime = []
secondSchedule_endTime = []

def isThereConflict(i, j):
    return False

def filterOut():
    global firstSchedule_days
    global firstSchedule_startTime
    global firstSchedule_endTime

    global secondSchedule_days
    global secondSchedule_startTime
    global secondSchedule_endTime

    # if not firstSchedule_days:
    #     firstSchedule_days = secondSchedule_days
    #     firstSchedule_startTime = secondSchedule_startTime
    #     firstSchedule_endTime = secondSchedule_endTime
    #     print("firstSchedule_days: ")
    #     print(firstSchedule_days)
    #     return

    if not firstSchedule_days:
        for i in range(len(secondSchedule_days)):
            firstSchedule_days.append([secondSchedule_days[i]])
            firstSchedule_startTime.append([secondSchedule_startTime[i]])
            firstSchedule_endTime.append([secondSchedule_endTime[i]])
            print("!!!!!!!!!!!!")

        print(" ")
        print("firstSchedule_days: ")
        print(firstSchedule_days)
        print(" ")
        return

    temp_days = []
    temp_startTime = []
    temp_endTime = []

    print("firstSchedule_days: ")
    print(firstSchedule_days)
    print("secondSchedule_days: ")
    print(secondSchedule_days)
    # print("secondSchedule_days: "+secondSchedule_days)

    print(len(firstSchedule_days))
    print(len(secondSchedule_days))

    for i in range(len(firstSchedule_days)):
        for j in range(len(secondSchedule_days)):
            # if not isThereConflict(i, j):
            daysToAppend = firstSchedule_days[i].copy()
            temp_days.append(daysToAppend)
            startTimeToAppend = firstSchedule_startTime[i].copy()
            temp_startTime.append(startTimeToAppend)
            endTimeToAppend = firstSchedule_endTime.copy()
            temp_endTime.append(endTimeToAppend)
            index = len(temp_days)-1
            temp_days[index].append(secondSchedule_days[j])
            temp_startTime[index].append(secondSchedule_startTime[j])
            temp_endTime[index].append(secondSchedule_endTime[j])

            print(" ")
            # print(temp_days)
            # print(temp_startTime[index])
            print(temp_startTime)
            # print(secondSchedule_startTime[j])
            # print(temp_endTime)

    # for i in range(len(firstSchedule_days)):
    #     for j in range(len(secondSchedule_days)):
    #         if not isThereConflict(i, j):
    #             print("Entered If")
    #             temp_days.append([firstSchedule_days[i]])
    #             temp_startTime.append([firstSchedule_startTime[i]])
    #             temp_endTime.append([firstSchedule_endTime[i]])
    #             index = len(temp_days)-1
    #             temp_days[index].append(secondSchedule_days[j])
    #             temp_startTime[index].append(secondSchedule_startTime[j])
    #             temp_endTime[index].append(secondSchedule_endTime[j])
    #
    #             print(" ")
    #             print(temp_days)
    #             print(temp_startTime)
    #             print(temp_endTime)
    #             print(" ")
    #

    firstSchedule_days = temp_days
    # print("firstSchedule_days: "+firstSchedule_startTime)
    firstSchedule_startTime = temp_startTime
    firstSchedule_endTime = temp_endTime



def parser():
    global lecture_days
    lecture_days = []
    global lecture_startTime
    lecture_startTime = []
    global lecture_endTime
    lecture_endTime = []

    # global list_days
    # global list_startTime
    # global list_endTime
    # global list_courseNames

    url = "https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=" + course_name + "&course=" + course_number
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    section1 = soup.findAll('tr', class_='section1')
    section2 = soup.findAll('tr', class_='section2')

    for i in range(len(section1)):
        section1_tdList = section1[i].findAll('td')
        # class_type.append(section1_tdList[2].getText())
        # class_days.append(section1_tdList[5].getText().split())
        # class_startTime.append(section1_tdList[6].getText())
        # class_endTime.append(section1_tdList[7].getText())

        if section1_tdList[2].getText() == "Lecture":
            lecture_days.append(section1_tdList[5].getText().split())
            lecture_startTime.append(section1_tdList[6].getText())
            lecture_endTime.append(section1_tdList[7].getText())

    global secondSchedule_days
    global secondSchedule_startTime
    global secondSchedule_endTime

    secondSchedule_days = lecture_days
    secondSchedule_startTime = lecture_startTime
    secondSchedule_endTime = lecture_endTime

    print("ABC")

    # list_days.append(lecture_days)
    # list_startTime.append(lecture_startTime)
    # list_endTime.append(lecture_endTime)
    # list_courseNames.append(course_name+" "+course_number)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/table", methods=["POST"])
def table():
    global course_name
    course_name = request.form.get("course_name")
    global course_number
    course_number = request.form.get("course_number")

    parser()
    filterOut()
    # lecture_days = [["Mon", "Wed", "Fri"], ["Mon", "Wed", "Fri"], ["Tue", "Thu"]]
    # lecture_startTime = ["11:00", "13:00", "15:00"]
    # lecture_endTime = ["12:00", "13:30", "16:30"]

    return jsonify({"lecture_days": lecture_days, "lecture_startTime": lecture_startTime, "lecture_endTime": lecture_endTime})

    # return jsonify({"success": True})
