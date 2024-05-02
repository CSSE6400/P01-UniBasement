import unittest
import requests

from .base import BaseCase


class TestQuestions(BaseCase):
    def test_edit_question_successful(self):
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

    def test_edit_question_invalid_id(self):
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

    def test_edit_question_no_changes(self):
        # Test editing a question with no changes
        # Make a PUT request without providing any changes
        # Check that the response status code is 400
        # Verify that the response message indicates no changes were made
        pass

    def test_edit_question_invalid_params(self):
        # Test editing a question with invalid parameters
        # Make a PUT request with invalid parameters
        # Check that the response status code is 400
        # Verify that the response message indicates invalid parameters
        pass

    def test_edit_question_missing_params(self):
        # Test editing a question with missing parameters
        # Make a PUT request without providing all required parameters
        # Check that the response status code is 400
        # Verify that the response message indicates missing parameters
        pass

if __name__ == '__main__':
    unittest.main()





        # def test_exam_post(self):
        # """
        # Checks for a 201 response from the /exam endpoint
        # Checks for the correct response message
        # """
        # body = {
        #     "examYear": 2021,
        #     "examSemester": "1",
        #     "examType": "Final",
        #     "courseCode": "CSSE6400"
        # }

        # response = requests.post(self.host() + '/exams', json=body)
        # self.assertEqual(201, response.status_code)
        # self.assertEqual('Exam created', response.json())