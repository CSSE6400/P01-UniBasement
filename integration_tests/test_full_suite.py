import unittest
import requests

from .base import BaseCase


class TestFullSuite(BaseCase):
    def test_full_1(self):
        pass
        """
        #TODO rewrite the below from what i actually did lmao
        Creates a Course. 
          Checks the course params set correctly with a GET request
          Checks the course has no exams
        Creates Exam for the course
          Checks the course has the exam


        Creates Questions for the Exam
        Creates Comments for the Questions
        Creates Nested Comments for the Questions
        Deletes Various Comments
        Upvotes Comments
        Downvotes Comments
        Endorses Comments
        Mark Comments as correct
        """

        course = {
            "courseCode": "TOYOTA86",
            "courseName": "The History of Toyota 86",
            "courseDescription": "A course on the history of the Toyota 86 and its impact on the automotive industry."
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
        questions = {
            "questionText": "What is the impact of the Toyota 86 on the automotive industry?",
              "questionPNG": None,
              "examId": exam['examId'],
              "questionType": "Short Answer"
        }

        response = requests.post(self.host() + '/questions', json=questions)
        self.assertEqual(201, response.status_code)
        questionId = response.json()['questionId']
        self.assertIsInstance(questionId, int)
        questions['questionId'] = int(questionId)

        # Check the exam has the question
        response = requests.get(self.host() + '/exams/' + str(exam['examId']) + '/questions')
        self.assertEqual(200, response.status_code)
        expectedResponse = {
            "questionId": questions['questionId'],
            "questionText": questions['questionText'],
            "questionPNG": questions['questionPNG'],
            "questionType": questions['questionType']
        }
        self.assertEqual([expectedResponse], response.json())









if __name__ == '__main__':
    unittest.main()