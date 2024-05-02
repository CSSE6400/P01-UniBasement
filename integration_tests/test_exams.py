import unittest
import requests
import random

from .base import BaseCase


class TestUser(BaseCase):
    def test_exam_post(self):
        """
        Checks for a 201 response from the /exam endpoint
        Checks for the correct response message
        """
        body = {
            "examYear": 2021,
            "examSemester": "1",
            "examType": "Final",
            "courseCode": "CSSE6400"
        }

        response = requests.post(self.host() + '/exams', json=body)
        self.assertEqual(201, response.status_code)
        self.assertEqual('Exam created', response.json())


    def test_exam_post_missing_courseCode(self):
        """
        Checks for a 400 response from the /exam endpoint
        Checks for the correct response message
        """
        body = {
            "examYear": 2021,
            "examSemester": "1",
            "examType": "Final"
        }

        response = requests.post(self.host() + '/exams', json=body)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Missing courseCode', response.json())


    def test_exam_post_exam_not_found(self):
        """
        Checks for a 404 response from the /exam endpoint
        Checks for the correct response message
        """
        body = {
            "examYear": 2021,
            "examSemester": "1",
            "examType": "Final",
            "courseCode": "TOYO8686"
        }

        response = requests.post(self.host() + '/exams', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Course not found', response.json())




if __name__ == '__main__':
    unittest.main()