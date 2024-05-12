import unittest
import requests

from .base import BaseCase
from .base import update_timestamps


class TestComments(BaseCase):   
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
        self.USER_ID = "868686"
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
            "courseCodeCourseCode": self.COURSE_CODE
        }

        newExam = self.Exam(**body)
        self.session.add(newExam)

        # Get the id of the exam from db
        self.examId = self.session.query(self.Exam).filter_by(
            examYear=2024, examSemester='1', examType='Final', courseCodeCourseCode='CSSE6400').first().examId

        # Create a new question to be edited.
        body = {
            "examIdExamId": self.examId,
            "questionText": self.QUESTION_TEXT,
            "questionType": self.QUESTION_TYPE,
            "questionPNG": self.QUESTION_PNG
        }

        newQuestion = self.Question(**body)
        self.session.add(newQuestion)

        # Get the id of the question from db
        self.questionId = self.session.query(self.Question).filter_by(
            examIdExamId=self.examId, questionText=self.QUESTION_TEXT, questionType=self.QUESTION_TYPE).first().questionId

        # Creates a new user
        userData = {
            "userId": self.USER_ID
        }

        newUser = self.User(**userData)
        self.session.add(newUser)

        # Create a new comment
        commentData = {
            "userId": self.USER_ID,
            "questionIdQuestionId": self.questionId,
            "parentCommentId": None,
            "commentText": self.COMMENT_TEXT,
            "commentPNG": self.COMMENT_PNG
        }
        
        

        newComment = self.Comment(**commentData)
        self.session.add(newComment)

        # # Get the id of the comment from db
        self.commentId = self.session.query(self.Comment).filter_by(
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
        
        
        
        
    def test_put_edits_comment_success(self):
        """
        Checks for a 200 response from the /comments/:commentId/edit endpoint
        Checks for the correct response message
        """
        
        # Verify database current state
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        self.assertEqual('This is a comment for the question', comment.commentText)
        
        body = {
            "commentText": "This is a edited comment",
            "commentPNG": self.COMMENT_PNG,
            "userId": self.USER_ID,
        }

        response = requests.put(self.host() + '/comments/' + str(self.commentId) + '/edit', json=body)
        
        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment edited', response.json())
        
        
        # Verify database changes
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        self.session.refresh(comment)
        
        self.assertEqual('This is a edited comment', comment.commentText)
        self.assertEqual(self.COMMENT_PNG, comment.commentPNG)
        self.assertEqual(self.USER_ID, comment.userId)


    def test_put_edits_comment_invalid_id(self):
        """
        Checks for a 404 response from the /comments/:commentId/edit endpoint
        Checks for the correct response message
        """
        commentId = 86868686
        body = {
            "commentText": "The questionId does not exist so this should not work",
            "commentPNG": self.COMMENT_PNG,
            "userId": self.USER_ID,
        }

        response = requests.put(self.host() + '/comments/' + str(commentId) + '/edit', json=body)
        
        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_put_edits_comment_no_changes(self):
        """
        Checks for a 400 response from the /comments/:commentId/edit endpoint
        Checks for the correct response message
        """
        body = {
            "commentText": self.COMMENT_TEXT,
            "commentPNG": self.COMMENT_PNG,
            "userId": self.USER_ID,
        }

        response = requests.put(self.host() + '/comments/' + str(self.commentId) + '/edit', json=body)
        
        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment edited', response.json())

    def test_patch_deletes_comment_success(self):
        """
        Checks for a 200 response from the /comments/:commentId/delete endpoint
        Checks for the correct response message
        """
        body = {
            "userId": self.USER_ID
        }

        response = requests.patch(self.host() + '/comments/' + str(self.commentId) + '/delete', json=body)
        
        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment deleted', response.json())
        
        # Verify database changes
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        self.session.refresh(comment)
        self.assertEqual('Deleted', comment.commentText)
        
        


    def test_patch_deletes_comment_invalid_id(self):
        """
        Checks for a 404 response from the /comments/:commentId/delete endpoint
        Checks for the correct response message
        """
        body = {
            "userId": self.USER_ID
        }

        response = requests.patch(self.host() + '/comments/' + str(86) + '/delete', json=body)
        
        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_sets_comment_as_correct(self):
        """
        Checks for a 200 response from the /comments/:commentId/correct endpoint
        Checks for the correct response message
        """

        response = requests.patch(self.host() + '/comments/' + str(self.commentId) + '/correct')
        
        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment marked as correct', response.json())
        
        # Verify database changes
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        self.session.refresh(comment)
        self.assertEqual(True, comment.isCorrect)


    def test_patch_sets_comment_as_correct_invalid_id(self):
        """
        Checks for a 404 response from the /comments/:commentId/correct endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/correct')
        
        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_sets_comment_as_incorrect(self):
        """
        Checks for a 200 response from the /comments/:commentId/incorrect endpoint
        Checks for the correct response message
        """
        
        # Set as correct
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        comment.isCorrect = True
        self.session.commit()

        response = requests.patch(self.host() + '/comments/' + str(self.commentId) + '/incorrect')
        
        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment marked as incorrect', response.json())
        
        # Verify database changes
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        self.session.refresh(comment)
        self.assertEqual(False, comment.isCorrect)


    def test_patch_sets_comment_as_incorrect_invalid_id(self):
        """
        Checks for a 404 response from the /comments/:commentId/incorrect endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/incorrect')
        
        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_sets_comment_as_endorsed(self):
        """
        Checks for a 200 response from the /comments/:commentId/endorse endpoint
        Checks for the correct response message
        """
        response = requests.patch(self.host() + '/comments/' + str(self.commentId) + '/endorse')
        
        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment endorsed', response.json())
        
        # Verify database changes
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        self.session.refresh(comment)
        self.assertEqual(True, comment.isEndorsed)


    def test_patch_sets_comment_as_endorsed_invalid_id(self):
        """
        Checks for a 404 response from the /comments/:commentId/endorse endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/endorse')
        
        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_sets_comment_as_not_endorsed(self):
        """
        Checks for a 200 response from the /comments/:commentId/unendorse endpoint
        Checks for the correct response message
        """
        
        # Set as endorsed
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        comment.isEndorsed = True
        self.session.commit()

        response = requests.patch(self.host() + '/comments/' + str(self.commentId) + '/unendorse')
        
        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment removed endorsement', response.json())
        
        # Verify database changes
        comment = self.session.query(self.Comment).filter_by(commentId=self.commentId).first()
        self.session.refresh(comment)
        self.assertEqual(False, comment.isEndorsed)


    def test_patch_sets_comment_as_not_endorsed_invalid_id(self):
        """
        Checks for a 404 response from the /comments/:commentId/unendorse endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/unendorse')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    # def test_patch_downvotes_comment(self):
    #     """
    #     Checks for a 200 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     commentId = 18
    #     body = {
    #         "userId": "evan"
    #     }

    #     response = requests.patch(self.host() + '/comments/' + str(commentId) + '/downvote', json=body)
    #     self.assertEqual(200, response.status_code)
    #     self.assertEqual('Comment downvoted', response.json())


    # def test_patch_downvotes_comment_invalid_id(self):
    #     """
    #     Checks for a 404 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     commentId = 86868686
    #     body = {
    #         "userId": "evan"
    #     }

    #     response = requests.patch(self.host() + '/comments/' + str(commentId) + '/downvote', json=body)
    #     self.assertEqual(404, response.status_code)
    #     self.assertEqual('Comment not found', response.json())


    # def test_patch_upvotes_comment(self):
    #     """
    #     Checks for a 200 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     commentId = 19
    #     body = {
    #         "userId": "evan"
    #     }

    #     response = requests.patch(self.host() + '/comments/' + str(commentId) + '/upvote', json=body)
    #     self.assertEqual(200, response.status_code)
    #     self.assertEqual('Comment upvoted', response.json())


    # def test_patch_upvotes_comment_invalid_id(self):
    #     """
    #     Checks for a 404 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     commentId = 86868686
    #     body = {
    #         "userId": "evan"
    #     }

    #     response = requests.patch(self.host() + '/comments/' + str(commentId) + '/upvote', json=body)
    #     self.assertEqual(404, response.status_code)
    #     self.assertEqual('Comment not found', response.json())

    # def test_post_comment_success(self):
    #     """
    #     Checks for a 201 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     body = {
    #         "questionId": 13,
    #         "parentCommentId": 0,
    #         "userId": "evan",
    #         "commentText": "This is a comment",
    #         "commentPNG": None,
    #         "isCorrect": False,
    #         "isEndorsed": False,
    #         "upvotes": 0,
    #         "downvotes": 0
    #     }
        
    #     response = requests.post(self.host() + '/comments', json=body)
    #     self.assertEqual(201, response.status_code)

    # def test_post_comment_invalid_question_id(self):
    #     """
    #     Checks for a 404 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     body = {
    #         "questionId": 868686,
    #         "parentCommentId": 0,
    #         "userId": "evan",
    #         "commentText": "This is a comment",
    #         "commentPNG": None,
    #         "isCorrect": False,
    #         "isEndorsed": False,
    #         "upvotes": 0,
    #         "downvotes": 0
    #     }

    #     response = requests.post(self.host() + '/comments', json=body)
    #     self.assertEqual(404, response.status_code)
    #     self.assertEqual('Question not found', response.json())


    # def test_post_comment_no_question_id(self):
    #     """
    #     Checks for a 400 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     body = {
    #         "questionId": None,
    #         "parentCommentId": 0,
    #         "userId": "evan",
    #         "commentText": "This is a comment",
    #         "commentPNG": None,
    #         "isCorrect": False,
    #         "isEndorsed": False,
    #         "upvotes": 0,
    #         "downvotes": 0
    #     }

    #     response = requests.post(self.host() + '/comments', json=body)
    #     self.assertEqual(400, response.status_code)
    #     self.assertEqual('Missing questionId or userId', response.json())


    # def test_post_comment_no_comment_text_or_png(self):
    #     """
    #     Checks for a 400 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     body = {
    #         "questionId": 13,
    #         "parentCommentId": 0,
    #         "userId": "evan",
    #         "commentText": None,
    #         "commentPNG": None,
    #         "isCorrect": False,
    #         "isEndorsed": False,
    #         "upvotes": 0,
    #         "downvotes": 0
    #     }

    #     response = requests.post(self.host() + '/comments', json=body)
    #     self.assertEqual(400, response.status_code)
    #     self.assertEqual('Missing commentText or commentPNG', response.json())


    # def test_post_comment_nested_comment(self):
    #     """
    #     Checks for a 201 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     body = {
    #         "questionId": 14,
    #         "parentCommentId": 21,
    #         "userId": "evan",
    #         "commentText": "This is a nested comment",
    #         "commentPNG": None,
    #         "isCorrect": False,
    #         "isEndorsed": False,
    #         "upvotes": 0,
    #         "downvotes": 0
    #     }
        
    #     response = requests.post(self.host() + '/comments', json=body)
    #     self.assertEqual(201, response.status_code)


    # def test_post_comment_nested_invalid_parentID(self):
    #     """
    #     Checks for a 404 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     body = {
    #         "questionId": 14,
    #         "parentCommentId": 868686,
    #         "userId": "evan",
    #         "commentText": "This is a nested comment",
    #         "commentPNG": None,
    #         "isCorrect": False,
    #         "isEndorsed": False,
    #         "upvotes": 0,
    #         "downvotes": 0
    #     }

    #     response = requests.post(self.host() + '/comments', json=body)
    #     self.assertEqual(404, response.status_code)
    #     self.assertEqual('Parent comment not found', response.json())


    # def test_post_comment_nested_parentId_not_from_same_question(self):
    #     """
    #     Checks for a 400 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     body = {
    #         "questionId": 15,
    #         "parentCommentId": 1,
    #         "userId": "evan",
    #         "commentText": "This is a nested comment",
    #         "commentPNG": None,
    #         "isCorrect": False,
    #         "isEndorsed": False,
    #         "upvotes": 0,
    #         "downvotes": 0
    #     }

    #     response = requests.post(self.host() + '/comments', json=body)
    #     self.assertEqual(400, response.status_code)
    #     self.assertEqual('Parent comment is not from the same question', response.json())

    # def test_get_comment_by_id(self):
    #     """
    #     Checks for a 200 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     commentId = 23
    #     expectedResponse = {
    #             "commentId": commentId,
    #             "parentCommentId": None,
    #             "userId": 'evan',
    #             "commentText": "This is a comment.",
    #             "commentPNG": None,
    #             "isCorrect": True,
    #             "isEndorsed": True,
    #             "upvotes": 100,
    #             "downvotes": 1,
    #             "questionId": 16,
    #             "created_at": "2001-06-01T09:00:00",
    #             "updated_at": "2001-06-01T09:00:00"
    #     }

    #     response = requests.get(self.host() + '/comments/' + str(commentId))

    #     update_timestamps(expectedResponse, response.json()['created_at'], response.json()['updated_at'])

    #     self.assertEqual(200, response.status_code)
    #     self.assertEqual(expectedResponse, response.json())


    # def test_get_comment_by_id_invalid_id(self):
    #     """
    #     Checks for a 404 response from the /comments endpoint
    #     Checks for the correct response message
    #     """
    #     commentId = 868686

    #     expectedResponse = {
    #         "error": "Comment not found"
    #     }

    #     response = requests.get(self.host() + '/comments/' + str(commentId))
    #     self.assertEqual(404, response.status_code)
    #     self.assertEqual(expectedResponse, response.json())

if __name__ == '__main__':
    unittest.main()
