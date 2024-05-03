import unittest
import requests

from .base import BaseCase


class TestQuestions(BaseCase):
    def test_put_edit_question_successful(self):
      """
      Check for a 201 response from the /questions endpoint
      Check for the correct response message
      """
      questionId = 1
      body = {
        "questionId": questionId,
        "questionText": "Who is the best tutor at UQ?",
        "questionType": "Multiple Choice",
        "questionPNG": None
      }

      response = requests.put(self.host() + '/questions/' + str(questionId) + '/edit', json=body)

      self.assertEqual(200, response.status_code)
      self.assertEqual('Question edited', response.json())


    def test_put_edit_question_invalid_id(self):
        """
        Check for a 404 response from the /questions endpoint
        Check for the correct response message
        """
        questionId = 8686
        body = {
            "questionId": questionId,
            "questionText": "Who is the best tutor at UQ?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }
        response = requests.put(self.host() + '/questions/' + str(questionId) + '/edit', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Question not found', response.json())


    def test_put_edit_question_no_changes(self):
        """
        Check for a 400 response from the /questions endpoint
        Check for the correct response message
        """
        questionId = 1
        body = {
            "questionId": None, 
            "questionText": None,
            "questionType": None,
            "questionPNG": None
        }

        response = requests.put(self.host() + '/questions/' + str(questionId) + '/edit', json=body)
        self.assertEqual(400, response.status_code)
        self.assertEqual('No changes made', response.json())


    def test_post_add_question_successful(self):
        """
        Check for a 201 response from the /questions endpoint
        Check for the correct response message
        """
        body = {
            "examId": 1,
            "questionText": "Do you use Arch?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }

        response = requests.post(self.host() + '/questions', json=body)
        self.assertEqual(201, response.status_code)
        self.assertEqual('Question added', response.json())


    def test_post_add_question_invalid_exam_id(self):
        """
        Check for a 404 response from the /questions endpoint
        Check for the correct response message
        """
        body = {
            "examId": 868686,
            "questionText": "This question is going to an invalid examId",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }

        response = requests.post(self.host() + '/questions', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('ExamId not found', response.json())


    def test_post_add_question_no_exam_id(self):
        """
        Check for a 400 response from the /questions endpoint
        Check for the correct response message
        """
        body = {
            "examId": None,
            "questionText": "This question is going to an invalid examId",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }

        response = requests.post(self.host() + '/questions', json=body)
        self.assertEqual(400, response.status_code)
        self.assertEqual('ExamId not found', response.json())







if __name__ == '__main__':
    unittest.main()
