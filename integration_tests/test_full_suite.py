import unittest
import requests

from .base import BaseCase
# from .base import update_timestamps


class TestFullSuite(BaseCase):
    def setUp(self):
        self.session = self.get_db_session()
        self.Course = self.Base.classes['course']
        self.Exam = self.Base.classes['exam']
        self.Question = self.Base.classes['question']
        self.User = self.Base.classes['user']
        self.Comment = self.Base.classes['comment']

        # Constant data for tests
        self.COURSE_CODE = "CSSE6400"
        self.EXAM_YEAR = 2024
        self.EXAM_SEMESTER = 1
        self.EXAM_TYPE = "Final"
        self.COURSE_CODE = "CSSE6400"
        self.COURSE_NAME = "Software Architecture"
        self.COURSE_DESCRIPTION = "I have created this course to test."
        self.UNIVERSITY = "The University of Queensland"
        self.QUESTION_TEXT = "Who is the best tutor at UQ?"
        self.QUESTION_TYPE = "Multiple Choice"
        self.QUESTION_PNG = None
        self.USER_ID = 86868686
        self.COMMENT_TEXT = "This is a comment for the question"
        self.COMMENT_PNG = None
        self.PARENT_COMMENT_ID = None

        self.session.commit()

    # Wipe all data in all tables

    def tearDown(self):
        self.session.rollback()
        self.session.query(self.Base.classes.comment).delete()
        self.session.query(self.Base.classes.user).delete()
        self.session.query(self.Base.classes.question).delete()
        self.session.query(self.Base.classes.exam).delete()
        self.session.query(self.Base.classes.course).delete()
        self.session.commit()
        self.session.close()

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
          Delete the comment
            Check the question has no comments
        """

        course = {
            "courseCode": self.COURSE_CODE,
            "courseName": self.COURSE_NAME,
            "courseDescription": self.COURSE_DESCRIPTION,
            "university": self.UNIVERSITY,
            "stars": 0,
            "votes": 0
        }

        # Create a course
        response = requests.post(self.host() + '/courses', json=course)
        self.assertEqual(201, response.status_code)

        # Check the course params set correctly
        # Get the course
        response = requests.get(
            self.host() + '/courses/' + self.COURSE_CODE)
        self.assertEqual(200, response.status_code)

        # Verify received information about course is correct
        self.assertEqual(course, response.json())

        # Check the course has no exams
        response = requests.get(
            self.host() + '/courses/' + self.COURSE_CODE + '/exams')
        self.assertEqual(200, response.status_code)
        self.assertEqual([], response.json())

        # Create an exam for the course
        exam = {
            "examYear": self.EXAM_YEAR,
            "examSemester": self.EXAM_SEMESTER,
            "examType": self.EXAM_TYPE,
            "courseCode": self.COURSE_CODE
        }

        # Create the exam
        response = requests.post(self.host() + '/exams', json=exam)
        self.assertEqual(201, response.status_code)
        # Testing examId returned and is a valid int
        examId = response.json()['examId']
        self.assertIsInstance(examId, int)
        exam['examId'] = int(examId)  # Add the id to the exam

        # Check the course has the exam
        response = requests.get(
            self.host() + '/courses/' + self.COURSE_CODE + '/exams')
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
        response = requests.get(
            self.host() + '/exams/' + str(exam['examId']) + '/questions')
        self.assertEqual(200, response.status_code)
        expectedResponse = {
            "questionId": question['questionId'],
            "questionText": question['questionText'],
            "questionPNG": question['questionPNG'],
            "questionType": question['questionType'],
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }
        self.assertEqual(expectedResponse, response.json())

        # Create comments for the question
        comment = {
            "questionId": question['questionId'],
            "parentCommentId": None,
            "userId": str(self.USER_ID),
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
        response = requests.get(
            self.host() + '/questions/' + str(question['questionId']) + '/comments')
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
            "updated_at": response.json()[0]['updated_at'],
            "questionId": question['questionId']
        }

        self.assertEqual([expectedResponse], response.json())

        commentUpdateBody = {
            "userId": comment['userId'],
        }

        # Delete the comment
        response = requests.patch(self.host(
        ) + '/comments/' + str(comment['commentId']) + '/delete', json=commentUpdateBody)
        self.assertEqual(200, response.status_code)

        # Check the question has no comments
        response = requests.get(
            self.host() + '/questions/' + str(question['questionId']) + '/comments')
        self.assertEqual(200, response.status_code)


if __name__ == '__main__':
    unittest.main()
