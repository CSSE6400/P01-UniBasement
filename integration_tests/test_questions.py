import unittest
import requests

from .base import BaseCase
from .base import update_timestamps



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
        self.assertEqual('Missing examId', response.json())


# expected response for get question infromation by question id

    def test_get_question_by_questionId(self):
        """
        Check for a 200 response from the /questions endpoint
        Check for the correct response message
        """
        questionId = 1
        expectedResponse = [
            {
                "commentId": 1,
                "parentCommentId": None,
                "userId": "evan",
                "commentText": "Evan Hughes",
                "commentPNG": None,
                "isCorrect": True,
                "isEndorsed": True,
                "upvotes": 100,
                "downvotes": 1,
                "created_at": "2024-05-03T02:36:21.849Z",
                "updated_at": "2024-05-03T02:36:21.849Z",
                "children": [
                    {
                        "commentId": 2,
                        "parentCommentId": 1,
                        "userId": "liv",
                        "commentText": "Are you stupid it is clearly Liv Ronda",
                        "commentPNG": None,
                        "isCorrect": False,
                        "isEndorsed": False,
                        "upvotes": 0,
                        "downvotes": 100,
                        "created_at": "2024-05-03T02:36:21.849Z",
                        "updated_at": "2024-05-03T02:36:21.849Z",
                        "children": [
                            {
                                "commentId": 3,
                                "parentCommentId": 2,
                                "userId": "jackson",
                                "commentText": "Bro went to stupid school L",
                                "commentPNG": None,
                                "isCorrect": False,
                                "isEndorsed": True,
                                "upvotes": 999,
                                "downvotes": 1,
                                "created_at": "2024-05-03T02:36:21.849Z",
                                "updated_at": "2024-05-03T02:36:21.849Z"
                            }
                        ]
                    },
                    {
                        "commentId": 4,
                        "parentCommentId": 1,
                        "userId": "lakshan",
                        "commentText": "Fax what a goat",
                        "commentPNG": None,
                        "isCorrect": False,
                        "isEndorsed": False,
                        "upvotes": 80,
                        "downvotes": 1,
                        "created_at": "2024-05-03T02:36:21.849Z",
                        "updated_at": "2024-05-03T02:36:21.849Z"
                    }
                ]
            }
        ]

        response = requests.get(self.host() + '/questions/' + str(questionId) + '/comments')

        update_timestamps(expectedResponse, response.json()[0]['created_at'], response.json()[0]['updated_at'])
        
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedResponse, response.json())


    def test_get_question_by_invalid_questionId(self):
        """
        Check for a 404 response from the /questions endpoint
        Check for the correct response message
        """
        questionId = 3344
        expectedResponse = {
          'error': 'Question not found'
        }
        response = requests.get(self.host() + '/questions/' + str(questionId) + '/comments')
        self.assertEqual(404, response.status_code)
        self.assertEqual(expectedResponse, response.json())


    def test_get_question_by_questionId_no_comments(self):
        """
        Check for a 200 response from the /questions endpoint
        Check for the correct response message
        """
        questionId = 4
        expectedResponse = []
        response = requests.get(self.host() + '/questions/' + str(questionId) + '/comments')
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedResponse, response.json())


    def test_get_question_information_by_id(self):
        """
        Check for a 200 response from the /questions endpoint
        Check for the correct response message
        """
        questionId = 1
        expectedResponse = {
            "questionId": 1,
            "questionText": "Who is the best tutor at UQ?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }
        response = requests.get(self.host() + '/questions/' + str(questionId))
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedResponse, response.json())


    def test_get_question_information_by_invalid_id(self):
        """
        Check for a 404 response from the /questions endpoint
        Check for the correct response message
        """
        questionId = 4486
        expectedResponse = {
            "error": "Question not found"
        }

        response = requests.get(self.host() + '/questions/' + str(questionId))
        self.assertEqual(404, response.status_code)
        self.assertEqual(expectedResponse, response.json())


if __name__ == '__main__':
    unittest.main()
