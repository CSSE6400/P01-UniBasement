import unittest
import requests
import random

from .base import BaseCase


class TestUser(BaseCase):

    def test_course_post(self):
        """
        Checks for a 201 response from the /courses endpoint
        Checks for the correct response message
        """
        course_data = {
            "courseCode": "CSSE6400",
            "courseName": "Software Architecture",
            "courseDescription": "Doing some software architecture stuff with Richard and Evan (my bestie)"
        }

        response = requests.post(self.host() + '/courses', json=course_data, headers={'Accept': 'application/json'})

        self.assertEqual(201, response.status_code)

        self.assertEqual('Course Added!', response.json())

    def test_course_post_null_coursecode(self):
        """
        Checks for a 400 response from the /courses endpoint
        Checks for the correct response message
        """
        course_data = {
            "courseCode": "",
            "courseName": "Software Architecture",
            "courseDescription": "Doing some software architecture stuff with Richard and Evan (my bestie)"
        }

        response = requests.post(self.host() + '/courses', json=course_data, headers={'Accept': 'application/json'})

        self.assertEqual(400, response.status_code)

        self.assertEqual('Course Code is required', response.json())


    def test_course_post_duplicate_coursecode(self):
        """
        Checks for a 400 response from the /courses endpoint
        Checks for the correct response message
        """
        course_data = {
            "courseCode": "DECO2500",
            "courseName": "Human Computer Interaction",
            "courseDescription": "Models of action, perception, cognition and interaction in human-machine systems. Methods of interaction analysis and interaction representation. Human-machine system evaluation. Practical implementation. Introduction to user and use-centred design principles. Broader topics may include: societal considerations, groupware, multimedia, media perspectives."
        }

        response = requests.post(self.host() + '/courses', json=course_data, headers={'Accept': 'application/json'})
        # Should post the course fine the first time
        self.assertEqual(201, response.status_code)
        self.assertEqual('Course Added!', response.json())

        # Should error as duplicate when posting same course again.
        response = requests.post(self.host() + '/courses', json=course_data, headers={'Accept': 'application/json'})

        self.assertEqual(409, response.status_code)

        self.assertEqual('Course Code already exists', response.json())


    def test_course_get_exam_by_code(self):
        """
        Checks for a 200 response from the /courses/:courseCode/exams endpoint
        Checks for the correct response message
        """
        courseCode = "ENGG1001"

        expectedExamsForCourse = [
            {"examId": 1, "examYear": 2021, "examSemester": 1, "examType": "Final"},
            {"examId": 2, "examYear": 2022, "examSemester": 1, "examType": "Final"},
            {"examId": 3, "examYear": 2023, "examSemester": 1, "examType": "Final"}
        ]

        response = requests.get(self.host() + '/courses/' + courseCode + '/exams')
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedExamsForCourse, response.json())


    def test_course_get_course(self):
        """
        Checks for a 200 response from the /courses/:courseCode endpoint
        Checks for the correct response message
        """
        courseCode = "ENGG1001"

        expectedCourse = {
            "courseCode": "ENGG1001",
            "courseName": "Programming for Engineers",
            "courseDescription": "An introductory course covering basic concepts of software engineering."
        }

        response = requests.get(self.host() + '/courses/' + courseCode)
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedCourse, response.json())

    def test_course_get_course_not_found(self):
        """
        Checks for a 404 response from the /courses/:courseCode endpoint
        Checks for the correct response message
        """
        courseCode = "ENGG1000"

        response = requests.get(self.host() + '/courses/' + courseCode)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Course not found', response.json())


    def test_course_get_all(self):
        """
        Checks for a 200 response from the /courses endpoint
        Checks for the correct response message
        """
        expectedCourses = [
            {"courseCode": "ENGG1001", "courseName": "Programming for Engineers", "courseDescription": "An introductory course covering basic concepts of software engineering."},
            {"courseCode": "ENGG1100", "courseName": "Professional Engineering", "courseDescription": "An introductory course covering fundamental concepts in engineering principles."},
            {"courseCode": "MATH1051", "courseName": "Calculus & Linear Algebra", "courseDescription": "A foundational course in calculus covering limits, derivatives, and integrals."}
        ]

        response = requests.get(self.host() + '/courses')
        self.assertEqual(200, response.status_code)

        # Check if each expected course is included in the response
        for expectedCourse in expectedCourses:
            self.assertIn(expectedCourse, response.json())





if __name__ == '__main__':
    unittest.main()