import unittest
import requests
import sqlalchemy

from .base import BaseCase
from .base import update_timestamps


class TestQuestions(BaseCase):
    def setUp(self):
        self.session = self.get_db_session()

        # Create course
        course_data = {
            "courseCode": "CSSE6400",
            "courseName": "Software Architecture",
            "courseDescription": "I have created this course to test questions.",
            "university": "The University of Queensland"
        }

        # Get the Course class
        Course = self.Base.classes.course

        # Create a new course
        newCourse = Course(**course_data)

        # Add the new course to the session
        self.session.add(newCourse)

        # Create an Exam
        body = {
            "examYear": 2024,
            "examSemester": "1",
            "examType": "Final",
            "courseCodeCourseCode": "CSSE6400"
        }

        Exam = self.Base.classes.exam

        newExam = Exam(**body)
        self.session.add(newExam)

        # Get the id of the exam from db
        examTable = self.Base.classes['exam']
        self.examId = self.session.query(examTable).filter_by(
            examYear=2024, examSemester='1', examType='Final', courseCodeCourseCode='CSSE6400').first().examId

        # Create a new question to be edited.
        body = {
            "examIdExamId": self.examId,
            "questionText": "Who is the best tutor at UQ?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }

        Question = self.Base.classes.question

        newQuestion = Question(**body)
        self.session.add(newQuestion)

        # Get the id of the question from db
        questionTable = self.Base.classes['question']
        self.questionId = self.session.query(questionTable).filter_by(
            examIdExamId=self.examId, questionText='Who is the best tutor at UQ?', questionType='Multiple Choice').first().questionId

        # Create a new question to be edited 2
        body = {
            "examIdExamId": self.examId,
            "questionText": "What is the best Toyota?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }

        newQuestion = Question(**body)
        self.session.add(newQuestion)

        # Get the id of the question from db
        self.questionId2 = self.session.query(questionTable).filter_by(
            examIdExamId=self.examId, questionText='What is the best Toyota?', questionType='Multiple Choice').first().questionId

        # Creates a new user
        self.userId = 86868686
        userData = {
            "userId": self.userId
        }

        User = self.Base.classes.user
        newUser = User(**userData)
        self.session.add(newUser)

        # Create a new comment
        commentData = {
            "userIdUserId": self.userId,
            "questionIdQuestionId": self.questionId,
            "parentCommentId": None,
            "commentText": "This is a comment for the question",
            "commentPNG": None

        }

        Comment = self.Base.classes.comment
        newComment = Comment(**commentData)
        self.session.add(newComment)

        # # Get the id of the comment from db
        commentTable = self.Base.classes['comment']
        self.commentId = self.session.query(commentTable).filter_by(
            commentText='This is a comment for the question').first().commentId

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

    def test_put_edit_question_successful(self):
        """
        Check for a 201 response from the /questions/:questionId/edit endpoint
        Check for the correct response message
        """

        # Edit Question
        body = {
            "questionId": self.questionId,
            "questionText": "Who is the best tutor at UQ?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }
        response = requests.put(
            self.host() + '/questions/' + str(self.questionId) + '/edit', json=body)

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Question edited', response.json())

        # Verify database changes
        questionTable = self.Base.classes['question']
        updatedQuestion = self.session.query(questionTable).filter_by(
            questionId=self.questionId).first()
        self.assertEqual(body["questionText"], updatedQuestion.questionText)

    def test_put_edit_question_invalid_id(self):
        """
        Check for a 404 response from the /questions/:questionId/edit endpoint
        Check for the correct response message
        """
        questionId = 8686
        body = {
            "questionId": questionId,
            "questionText": "Who is the best tutor at UQ?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }
        response = requests.put(
            self.host() + '/questions/' + str(questionId) + '/edit', json=body)

        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual('Question not found', response.json())

        # Verify no database changes
        questionTable = self.Base.classes['question']
        updatedQuestion = self.session.query(
            questionTable).filter_by(questionId=questionId).first()
        self.assertIsNone(updatedQuestion)

    def test_put_edit_question_no_changes(self):
        """
        Check for a 400 response from the /questions/:questionId/edit endpoint
        Check for the correct response message
        """
        questionId = 1
        body = {
            "questionId": None,
            "questionText": None,
            "questionType": None,
            "questionPNG": None
        }

        response = requests.put(
            self.host() + '/questions/' + str(questionId) + '/edit', json=body)

        # Verify response from API
        self.assertEqual(400, response.status_code)
        self.assertEqual('No changes made', response.json())

        # Verify no database changes
        questionTable = self.Base.classes['question']
        updatedQuestion = self.session.query(
            questionTable).filter_by(questionId=questionId).first()
        self.assertIsNone(updatedQuestion)

    def test_post_add_question_successful(self):
        """
        Check for a 201 response from the /questions endpoint
        Check for the correct response message
        """
        body = {
            "examId": self.examId,
            "questionText": "Do you use Arch?",
            "questionType": "Multiple Choice",
            "questionPNG": None
        }

        # Verify response from API
        response = requests.post(self.host() + '/questions', json=body)
        self.assertEqual(201, response.status_code)
        questionId = response.json()['questionId']

        # Verify database changes
        questionTable = self.Base.classes['question']
        question = self.session.query(questionTable).filter_by(
            questionId=questionId).first()

        expectedStoredQuestion = {
            "examIdExamId": body["examId"],
            "questionId": questionId,
            "questionText": body["questionText"],
            "questionType": body["questionType"],
            "questionPNG": body["questionPNG"],
            "created_at": question.created_at,
            "updated_at": question.updated_at
        }
        # Convert SQLAlchemy ORM object to a dict
        question_dict = {column.key: getattr(
            question, column.key) for column in sqlalchemy.inspect(question).mapper.column_attrs}
        self.assertEqual(expectedStoredQuestion, question_dict)

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

        # Verify response from API
        response = requests.post(self.host() + '/questions', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('ExamId not found', response.json())

        # Verify no database changes
        questionTable = self.Base.classes['question']
        updatedQuestion = self.session.query(
            questionTable).filter(questionTable.questionText == "This question is going to an invalid examId").first()
        self.assertIsNone(updatedQuestion)

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

        # Verify response from API
        response = requests.post(self.host() + '/questions', json=body)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Missing examId', response.json())

        # Verify no database changes
        questionTable = self.Base.classes['question']
        updatedQuestion = self.session.query(
            questionTable).filter(questionTable.questionText == "This question is going to an invalid examId").first()
        self.assertIsNone(updatedQuestion)

    def test_get_comments_by_questionId(self):
        """
        Check for a 200 response from the /questions/:questionId/comments endpoint
        Check for the correct response message
        """
        # To verify no database changes
        commentTable = self.Base.classes['comment']
        comment = self.session.query(commentTable)

        # Get comments for a question
        questionId = self.questionId
        expectedResponse = [{
            "commentId": self.commentId,
            "parentCommentId": None,
            "commentText": "This is a comment for the question",
            "commentPNG": None,
            "created_at": None,
            "updated_at": None,
            "upvotes": 0,
            "downvotes": 0,
            "isCorrect": False,
            "isEndorsed": False
        }]

        response = requests.get(
            self.host() + '/questions/' + str(questionId) + '/comments')
        update_timestamps(expectedResponse, response.json()[
                          0]['created_at'], response.json()[0]['updated_at'])

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedResponse, response.json())

        # Verify no database changes
        commentAfterGet = self.session.query(commentTable)
        self.assertEqual(comment.count(), commentAfterGet.count())

    def test_get_comments_by_invalid_questionId(self):
        """
        Check for a 404 response from the /questions/:questionId/comments endpoint
        Check for the correct response message
        """
        # To verify no database changes
        commentTable = self.Base.classes['comment']
        comment = self.session.query(commentTable)

        # Get comments for a question
        questionId = 3344
        expectedResponse = {
            'error': 'Question not found'
        }
        response = requests.get(
            self.host() + '/questions/' + str(questionId) + '/comments')

        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual(expectedResponse, response.json())

        # Verify no database changes
        commentAfterGet = self.session.query(commentTable)
        self.assertEqual(comment.count(), commentAfterGet.count())

    def test_get_comment_by_questionId_no_comments(self):
        """
        Check for a 200 response from the /questions/:questionId/comments endpoint
        Check for the correct response message
        """
        questionId = self.questionId2
        expectedResponse = []
        response = requests.get(
            self.host() + '/questions/' + str(questionId) + '/comments')

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedResponse, response.json())

    def test_get_question_information_by_id(self):
        """
        Check for a 200 response from the /questions/:questionId endpoint
        Check for the correct response message
        """

        response = requests.get(
            self.host() + '/questions/' + str(self.questionId))
        expectedResponse = {
            "questionId": self.questionId,
            "questionText": "Who is the best tutor at UQ?",
            "questionType": "Multiple Choice",
            "questionPNG": None,
            "created_at": response.json()['created_at'],
            "updated_at": response.json()['updated_at']
        }

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedResponse, response.json())

    def test_get_question_information_by_invalid_id(self):
        """
        Check for a 404 response from the /questions/:questionId endpoint
        Check for the correct response message
        """
        questionId = 4486
        expectedResponse = "Question not found"

        response = requests.get(self.host() + '/questions/' + str(questionId))

        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual(expectedResponse, response.json())


if __name__ == '__main__':
    unittest.main()
