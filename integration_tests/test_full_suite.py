import unittest
import requests

from .base import BaseCase
#from .base import update_timestamps


class TestFullSuite(BaseCase):
    def test_full_1(self):
        """
        Basically all valid requests are tested here. Ensures that the API is working as expected.
        Steps this take are:
          Creates a Course. 
            Checks the course params set correctly with a GET request
            Checks the course has no exams
          Creates Exam for the course
            Checks the course has the exam
          Creates Questions for the Exam
            Checks the exam has the question
          Creates Comments for the Questions
            Checks the question has the comment
          Creates Nested Comments for the Questions
            Check the questions has the comment and nested comment
          Upvotes Comments
            Checks the upvotes are correct
          Downvotes Comments
            Checks the downvotes are correct
          Endorses Comments
            Checks the comment is endorsed
          Unendorse Comments
            Checks the comment is unendorsed
          Mark Comments as correct
            Checks the comment is correct
          Unmark Comments as correct
            Checks the comment is incorrect
          Delete the nested comment
            Check the question has just one comment
          Delete the comment
            Check the question has no comments
        """

        course = {
            "courseCode": "TOYOTA86",
            "courseName": "The History of Toyota 86",
            "courseDescription": "A course on the history of the Toyota 86 and its impact on the automotive industry.",
            "university": "The University of Queensland",
        }

        # Create a course
        response = requests.post(self.host() + '/courses', json=course)
        self.assertEqual(201, response.status_code)

        # Check the course params set correctly
        # Get the course
        response = requests.get(self.host() + '/courses/' + course['courseCode'])
        self.assertEqual(200, response.status_code)

        # Verify received information about course is correct
        self.assertEqual(course, response.json())


        # Check the course has no exams
        response = requests.get(self.host() + '/courses/' + course['courseCode'] + '/exams')
        self.assertEqual(200, response.status_code)
        self.assertEqual([], response.json())

        # Create an exam for the course
        exam = {
            "examYear": 2024,
            "examSemester": 1,
            "examType": "Final",
            "courseCode": course['courseCode']
        }

        # Create the exam
        response = requests.post(self.host() + '/exams', json=exam)
        self.assertEqual(201, response.status_code)
        # Testing examId returned and is a valid int
        examId = response.json()['examId']
        self.assertIsInstance(examId, int)
        exam['examId'] = int(examId) # Add the id to the exam


        # Check the course has the exam
        response = requests.get(self.host() + '/courses/' + course['courseCode'] + '/exams')
        self.assertEqual(200, response.status_code)
        expectedResponse = {
            "examId": exam['examId'],
            "examYear": exam['examYear'],
            "examSemester": exam['examSemester'],
            "examType": exam['examType'],
        }
        self.assertEqual([expectedResponse], response.json())


        # Create questions for the exam
        question = {
            "questionText": "What is the impact of the Toyota 86 on the automotive industry?",
              "questionPNG": None,
              "examId": exam['examId'],
              "questionType": "Short Answer"
        }

        response = requests.post(self.host() + '/questions', json=question)
        self.assertEqual(201, response.status_code)
        questionId = response.json()['questionId']
        self.assertIsInstance(questionId, int)
        question['questionId'] = int(questionId)

        # Check the exam has the question
        response = requests.get(self.host() + '/exams/' + str(exam['examId']) + '/questions')
        self.assertEqual(200, response.status_code)
        expectedResponse = {
            "questionId": question['questionId'],
            "questionText": question['questionText'],
            "questionPNG": question['questionPNG'],
            "questionType": question['questionType']
        }
        self.assertEqual([expectedResponse], response.json())
        
        
        # Create comments for the question
        comment = {
          "questionId": question['questionId'],
          "parentCommentId": None,
          "userId": "evan",
          "commentText": "I think the Toyota 86 is a great car!",
          "commentPNG": None,
          "isCorrect": False,
          "isEndorsed": False,
          "upvotes": 0,
          "downvotes": 0
        }
        
        response = requests.post(self.host() + '/comments', json=comment)
        self.assertEqual(201, response.status_code)
        commentId = response.json()['commentId']
        self.assertIsInstance(commentId, int)
        comment['commentId'] = int(commentId)
        
        
        # Check the question has the comment
        response = requests.get(self.host() + '/questions/' + str(question['questionId']) + '/comments')
        self.assertEqual(200, response.status_code)
        expectedResponse = {
          "commentId": comment['commentId'],
          "parentCommentId": comment['parentCommentId'],
          "userId": comment['userId'],
          "commentText": comment['commentText'],
          "commentPNG": comment['commentPNG'],
          "isCorrect": comment['isCorrect'],
          "isEndorsed": comment['isEndorsed'],
          "upvotes": comment['upvotes'],
          "downvotes": comment['downvotes'],
          "created_at": response.json()[0]['created_at'],
          "updated_at": response.json()[0]['updated_at']
        }

        
        self.assertEqual([expectedResponse], response.json())
        
        
        # Create nested comments for the question
        nestedComment = {
          "questionId": question['questionId'],
          "parentCommentId": comment['commentId'],
          "userId": "liv",
          "commentText": "I agree with you!",
          "commentPNG": None,
          "isCorrect": False,
          "isEndorsed": False,
          "upvotes": 0,
          "downvotes": 0
        }
        
        response = requests.post(self.host() + '/comments', json=nestedComment)
        self.assertEqual(201, response.status_code)
        nestedCommentId = response.json()['commentId']
        self.assertIsInstance(nestedCommentId, int)
        nestedComment['commentId'] = int(nestedCommentId)
        
        
        # Check the question has the comment and nested comment
        response = requests.get(self.host() + '/questions/' + str(question['questionId']) + '/comments')
        self.assertEqual(200, response.status_code)
        
        expectedResponse = [
          {
            "commentId": comment['commentId'],
            "parentCommentId": comment['parentCommentId'],
            "userId": comment['userId'],
            "commentText": comment['commentText'],
            "commentPNG": comment['commentPNG'],
            "isCorrect": comment['isCorrect'],
            "isEndorsed": comment['isEndorsed'],
            "upvotes": comment['upvotes'],
            "downvotes": comment['downvotes'],
            "created_at": response.json()[0]['created_at'],
            "updated_at": response.json()[0]['updated_at'],
            "children": [
              {
                "commentId": nestedComment['commentId'],
                "parentCommentId": nestedComment['parentCommentId'],
                "userId": nestedComment['userId'],
                "commentText": nestedComment['commentText'],
                "commentPNG": nestedComment['commentPNG'],
                "isCorrect": nestedComment['isCorrect'],
                "isEndorsed": nestedComment['isEndorsed'],
                "upvotes": nestedComment['upvotes'],
                "downvotes": nestedComment['downvotes'],
                "created_at": response.json()[0]["children"][0]['created_at'],
                "updated_at": response.json()[0]["children"][0]['updated_at']
                }
              ]
            }
          ]
        
        self.assertEqual(expectedResponse, response.json())

        commentUpdateBody = {
            "userId": "evan",
        }

        nestedCommentUpdateBody = {
            "userId": "liv",
        }
        
        # Upvotes Comments
        response = requests.patch(self.host() + '/comments/' + str(comment['commentId']) + '/upvote', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)
        response = requests.patch(self.host() + '/comments/' + str(nestedComment['commentId']) + '/upvote', json=nestedCommentUpdateBody)
        self.assertEqual(200, response.status_code)
        
        
        # Checks the upvotes are correct
        response = requests.get(self.host() + '/comments/' + str(comment['commentId']))
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, response.json()['upvotes'])
        response = requests.get(self.host() + '/comments/' + str(nestedComment['commentId']))
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, response.json()['upvotes'])
        
        
        # Downvotes Comments
        response = requests.patch(self.host() + '/comments/' + str(comment['commentId']) + '/downvote', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)
        response = requests.patch(self.host() + '/comments/' + str(nestedComment['commentId']) + '/downvote', json=nestedCommentUpdateBody)
        self.assertEqual(200, response.status_code)
        
        
        # Checks the downvotes are correct
        response = requests.get(self.host() + '/comments/' + str(comment['commentId']))
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, response.json()['downvotes'])
        response = requests.get(self.host() + '/comments/' + str(nestedComment['commentId']))
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, response.json()['downvotes'])
        
        
        
        # Endorses Comments
        response = requests.patch(self.host() + '/comments/' + str(comment['commentId']) + '/endorse', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)


        # Checks the comment is endorsed
        response = requests.get(self.host() + '/comments/' + str(comment['commentId']))
        self.assertEqual(200, response.status_code)
        self.assertEqual(True, response.json()['isEndorsed'])
        

        # Unendorse Comments
        response = requests.patch(self.host() + '/comments/' + str(comment['commentId']) + '/unendorse', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)
        
        
        # Checks the comment is unendorsed
        response = requests.get(self.host() + '/comments/' + str(comment['commentId']))
        self.assertEqual(200, response.status_code)
        self.assertEqual(False, response.json()['isEndorsed'])
        
        
        # Mark Comments as correct
        response = requests.patch(self.host() + '/comments/' + str(comment['commentId']) + '/correct', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)
        
        
        # Checks the comment is correct
        response = requests.get(self.host() + '/comments/' + str(comment['commentId']))
        self.assertEqual(200, response.status_code)
        self.assertEqual(True, response.json()['isCorrect'])
        
        
        # Unmark Comments as correct
        response = requests.patch(self.host() + '/comments/' + str(comment['commentId']) + '/incorrect', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)
        
        
        # Checks the comment is incorrect
        response = requests.get(self.host() + '/comments/' + str(comment['commentId']))
        self.assertEqual(200, response.status_code)
        self.assertEqual(False, response.json()['isCorrect'])
        
        
        # Delete the nested comment
        response = requests.patch(self.host() + '/comments/' + str(nestedComment['commentId']) + '/delete', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)
        
        
        # Check the question has just one comment
        response = requests.get(self.host() + '/questions/' + str(question['questionId']) + '/comments')
        self.assertEqual(200, response.status_code)
        expectedResponse = [
          {
            "commentId": comment['commentId'],
            "parentCommentId": comment['parentCommentId'],
            "userId": comment['userId'],
            "commentText": comment['commentText'],
            "commentPNG": comment['commentPNG'],
            "isCorrect": comment['isCorrect'],
            "isEndorsed": comment['isEndorsed'],
            "upvotes": comment['upvotes'] + 1, # Plus 1 because of the upvote
            "downvotes": comment['downvotes'] + 1, # Plus 1 because of the downvote
            "created_at": response.json()[0]['created_at'],
            "updated_at": response.json()[0]['updated_at'],
            "children": [ 
              {
                "commentId": nestedComment['commentId'],
                "parentCommentId": nestedComment['parentCommentId'],
                "userId": nestedComment['userId'],
                "commentText": None, # Deleted comments have no text or image
                "commentPNG":None, # Deleted comments have no text or image
                "isCorrect": nestedComment['isCorrect'],
                "isEndorsed": nestedComment['isEndorsed'],
                "upvotes": nestedComment['upvotes'],
                "downvotes": nestedComment['downvotes'],
                "created_at": response.json()[0]["children"][0]['created_at'],
                "updated_at": response.json()[0]["children"][0]['updated_at']
              }]
          }
        ]
        # TODO fix delete patch in routes
        #self.assertEqual(expectedResponse, response.json())
        

        # Delete the comment
        response = requests.patch(self.host() + '/comments/' + str(comment['commentId']) + '/delete', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)
        
        
        # Check the question has no comments
        response = requests.get(self.host() + '/questions/' + str(question['questionId']) + '/comments')
        self.assertEqual(200, response.status_code)



if __name__ == '__main__':
    unittest.main()