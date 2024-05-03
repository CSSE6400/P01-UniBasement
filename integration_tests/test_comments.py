import unittest
import requests

from .base import BaseCase


class TestComments(BaseCase):
    
    def test_put_edits_comment_success(self):
        pass



    # def test_put_edit_question_successful(self):
    #   """
    #   Check for a 201 response from the /questions endpoint
    #   Check for the correct response message
    #   """
    #   questionId = 1
    #   body = {
    #     "questionId": questionId,
    #     "questionText": "Who is the best tutor at UQ?",
    #     "questionType": "Multiple Choice",
    #     "questionPNG": None
    #   }

    #   response = requests.put(self.host() + '/questions/' + str(questionId) + '/edit', json=body)

    #   self.assertEqual(200, response.status_code)
    #   self.assertEqual('Question edited', response.json())




if __name__ == '__main__':
    unittest.main()