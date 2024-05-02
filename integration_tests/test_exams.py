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


    def test_exam_get_questions_by_exam_id(self):
        """
        Checks for a 200 response from the /exam endpoint
        Checks for the correct response message
        """
        examId = 1
        expectedBody = [{
            "questionId": 1,
            "questionText": "Who is the best tutor at UQ?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }]
        response = requests.get(self.host() + f'/exams/{examId}/questions')
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedBody, response.json())


    def test_exam_get_questions_by_examId_not_found(self):
        """
        Checks for a 404 response from the /exam endpoint
        Checks for the correct response message
        """
        examId = 8686
        response = requests.get(self.host() + f'/exams/{examId}/questions')
        self.assertEqual(404, response.status_code)
        self.assertEqual('No questions found for this exam', response.json())


    def test_exam_get_exam_by_id(self):
        """
        Checks for a 200 response from the /exam endpoint
        Checks for the correct response message
        """
        examId = 1
        expectedBody = {
            "examId": 1,
            "examYear": 2021,
            "examSemester": 1,
            "examType": "Final"
        }
        response = requests.get(self.host() + f'/exams/{examId}')
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedBody, response.json())


    def test_exam_get_exam_by_id_not_found(self):
        """
        Checks for a 404 response from the /exam endpoint
        Checks for the correct response message
        """
        examId = 8686
        response = requests.get(self.host() + f'/exams/{examId}')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Exam not found', response.json())


if __name__ == '__main__':
    unittest.main()