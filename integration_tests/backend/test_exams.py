import unittest
import requests

from ..base import BaseCase


class Exams(BaseCase):
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

        # Create course
        courseData = {
            "courseCode": self.COURSE_CODE,
            "courseName": self.COURSE_NAME,
            "courseDescription": self.COURSE_DESCRIPTION,
            "university": self.UNIVERSITY
        }

        # Create a new course
        newCourse = self.Course(**courseData)

        # Add the new course to the session
        self.session.add(newCourse)

        # Create an Exam
        body = {
            "examYear": self.EXAM_YEAR,
            "examSemester": self.EXAM_SEMESTER,
            "examType": self.EXAM_TYPE,
            "courseCode": self.COURSE_CODE
        }

        newExam = self.Exam(**body)
        self.session.add(newExam)

        # Get the id of the exam from db
        self.examId = self.session.query(self.Exam).filter_by(
            examYear=2024, examSemester='1', examType='Final', courseCode='CSSE6400').first().examId

        # Create a new question to be edited.
        body = {
            "examId": self.examId,
            "questionText": self.QUESTION_TEXT,
            "questionType": self.QUESTION_TYPE,
            "questionPNG": self.QUESTION_PNG
        }

        newQuestion = self.Question(**body)
        self.session.add(newQuestion)

        # Get the id of the question from db
        self.questionId = self.session.query(self.Question).filter_by(
            examId=self.examId, questionText=self.QUESTION_TEXT, questionType=self.QUESTION_TYPE).first().questionId

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

    def test_exam_post(self):
        """
        Checks for a 201 response from the /exam endpoint
        Checks for the correct response message
        """
        body = {
            "examYear": self.EXAM_YEAR,
            "examSemester": self.EXAM_SEMESTER,
            "examType": self.EXAM_TYPE,
            "courseCode": self.COURSE_CODE
        }

        response = requests.post(self.host() + '/exams', json=body)

        # Verify response from API
        self.assertEqual(201, response.status_code)

        # Verify database changes
        exam = self.session.query(self.Exam).filter_by(
            examId=response.json()['examId']).first()
        self.assertEqual(self.EXAM_YEAR, exam.examYear)
        self.assertEqual(self.EXAM_SEMESTER, exam.examSemester)
        self.assertEqual(self.EXAM_TYPE, exam.examType)

    def test_exam_post_missing_courseCode(self):
        """
        Checks for a 400 response from the /exam endpoint
        Checks for the correct response message
        """
        body = {
            "examYear": self.EXAM_YEAR,
            "examSemester": self.EXAM_SEMESTER,
            "examType": self.EXAM_TYPE
        }

        response = requests.post(self.host() + '/exams', json=body)

        # Verify response from API
        self.assertEqual(400, response.status_code)
        self.assertEqual(
            'Missing courseCode, examYear, examSemester, or examType', response.json())

        # Verify no database changes
        exam = self.session.query(self.Exam).filter_by(examYear=self.EXAM_YEAR)
        self.assertEqual(1, exam.count())

    def test_exam_post_course_not_found(self):
        """
        Checks for a 404 response from the /exam endpoint
        Checks for the correct response message
        """
        body = {
            "examYear": self.EXAM_YEAR,
            "examSemester": self.EXAM_SEMESTER,
            "examType": self.EXAM_TYPE,
            "courseCode": "TOYOTA86"
        }

        response = requests.post(self.host() + '/exams', json=body)

        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual('Course not found', response.json())

        # Verify no database changes
        exam = self.session.query(self.Exam).filter_by(examYear=self.EXAM_YEAR)
        self.assertEqual(1, exam.count())

    def test_exam_get_questions_by_exam_id(self):
        """
        Checks for a 200 response from the /exam endpoint
        Checks for the correct response message
        """
        response = requests.get(
            self.host() + f'/exams/{self.examId}/questions')

        expectedBody = {
            "examId": self.examId,
            "questionId": self.questionId,
            "questionText": self.QUESTION_TEXT,
            "questionType": self.QUESTION_TYPE,
            "questionPNG": self.QUESTION_PNG,
            "createdAt": response.json()[0]['createdAt'],
            "updatedAt": response.json()[0]['updatedAt']
        }

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedBody, response.json()[0])

    def test_exam_get_questions_by_examId_not_found(self):
        """
        Checks for a 404 response from the /exam endpoint
        Checks for the correct response message
        """
        examId = 8686
        response = requests.get(self.host() + f'/exams/{examId}/questions')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Questions not found', response.json())

    def test_exam_get_exam_by_id(self):
        """
        Checks for a 200 response from the /exam endpoint
        Checks for the correct response message
        """
        expectedBody = {
            "courseCode": self.COURSE_CODE,
            "examId": self.examId,
            "examYear": self.EXAM_YEAR,
            "examSemester": self.EXAM_SEMESTER,
            "examType": self.EXAM_TYPE,
        }
        response = requests.get(self.host() + f'/exams/{self.examId}')
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedBody, response.json())

    def test_exam_get_exam_by_id_not_found(self):
        """
        Checks for a 404 response from the /exam endpoint
        Checks for the correct response message
        """
        invalidExamId = 8686
        response = requests.get(self.host() + f'/exams/{invalidExamId}')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Exam not found', response.json())


if __name__ == '__main__':
    unittest.main()
