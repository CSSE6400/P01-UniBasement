import unittest
import requests

from .base import BaseCase


class TestUser(BaseCase):
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
        
    def tearDown(self):
        self.session.rollback()
        self.session.query(self.Base.classes.comment).delete()
        self.session.query(self.Base.classes.user).delete()
        self.session.query(self.Base.classes.question).delete()
        self.session.query(self.Base.classes.exam).delete()
        self.session.query(self.Base.classes.course).delete()
        self.session.commit()
        self.session.close()
        
        
        
    def test_user_post(self):
        """
        Checks for a 201 response from the /courses endpoint
        Checks for the correct response message
        """
        userData = {
            "userId": self.USER_ID,
        }

        response = requests.post(self.host() + '/users', json=userData, headers={'Accept': 'application/json'})

        # Verify response from API
        self.assertEqual(201, response.status_code)
        self.assertEqual("User Added", response.json())
        
        # Verify database changes
        user = self.session.query(self.User).filter_by(userId=self.USER_ID).first()
        self.assertIsNotNone(user)
        self.assertEqual(user.userId, self.USER_ID)
        self.assertEqual(user.role, 0)
        self.assertEqual(user.rated, [])
        self.assertEqual(user.upvoted, '[]')
        self.assertEqual(user.downvoted, '[]')
        


    def test_user_post_missing(self):
        """
        Checks for a 201 response from the /courses endpoint
        Checks for the correct response message
        """
        userData = {
            "filler": "meow",
        }

        response = requests.post(self.host() + '/users', json=userData, headers={'Accept': 'application/json'})

        # Verify response from API
        self.assertEqual(400, response.status_code)
        self.assertEqual("Missing userId", response.json())


    def test_user_post_double(self):
        """
        Checks for a 201 response from the /courses endpoint
        Checks for the correct response message
        """
        userData = {
            "userId": "DoughBell",
        }

        response = requests.post(self.host() + '/users', json=userData, headers={'Accept': 'application/json'})

        # Verify response from API
        self.assertEqual(201, response.status_code)
        self.assertEqual("User Added", response.json())

        response = requests.post(self.host() + '/users', json=userData, headers={'Accept': 'application/json'})

        # Verify response from API
        self.assertEqual(409, response.status_code)
        self.assertEqual("User already exists", response.json())

if __name__ == '__main__':
    unittest.main()
