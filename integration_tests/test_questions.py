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


    #TODO finished the first route for questions. so the rest need to be done

if __name__ == '__main__':
    unittest.main()
