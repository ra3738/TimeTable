import requests
import urllib.request
from bs4 import BeautifulSoup

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

course_name = ""
course_number = ""

class_type = []
class_days = []
class_startTime = []
class_endTime = []

lecture_days = []
lecture_startTime = []
lecture_endTime = []

def parser():
    # global class_type
    # class_type = []
    # global class_days
    # class_days = []
    # global class_startTime
    # class_startTime = []
    # global class_endTime
    # class_endTime = []

    global lecture_days
    lecture_days = []
    global lecture_startTime
    lecture_startTime = []
    global lecture_endTime
    lecture_endTime = []

    url = "https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=" + course_name + "&course=" + course_number
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    section1 = soup.findAll('tr', class_='section1')
    section2 = soup.findAll('tr', class_='section2')

    for i in range(len(section1)):
        section1_tdList = section1[i].findAll('td')
        class_type.append(section1_tdList[2].getText())
        class_days.append(section1_tdList[5].getText().split())
        class_startTime.append(section1_tdList[6].getText())
        class_endTime.append(section1_tdList[7].getText())

        if section1_tdList[2].getText() == "Lecture":
            lecture_days.append(section1_tdList[5].getText().split())
            lecture_startTime.append(section1_tdList[6].getText())
            lecture_endTime.append(section1_tdList[7].getText())

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/table", methods=["POST"])
def table():
    global course_name
    course_name = request.form.get("course_name")
    global course_number
    course_number = request.form.get("course_number")
    # parser()
    
    return jsonify({"lecture_days": lecture_days, "lecture_startTime": lecture_startTime, "lecture_endTime": lecture_endTime})

    # return jsonify({"success": True})
