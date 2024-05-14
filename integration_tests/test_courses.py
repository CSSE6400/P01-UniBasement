import unittest
import requests

from .base import BaseCase


class TestCourse(BaseCase):
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

        # Creates a new user
        userData = {
            "userId": self.USER_ID
        }

        newUser = self.User(**userData)
        self.session.add(newUser)

        # Create a new comment
        commentData = {
            "userId": self.USER_ID,
            "questionId": self.questionId,
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

    def test_course_post(self):
        """
        Checks for a 201 response from the /courses endpoint
        Checks for the correct response message
        """
        courseData = {
            "courseCode": "COMP3506",
            "courseName": "Data Structures and Algorithms",
            "courseDescription": "Doing some DSA",
            "university": "The University of Queensland",
        }

        response = requests.post(
            self.host() + '/courses', json=courseData, headers={'Accept': 'application/json'})

        # Verify response from API
        self.assertEqual(201, response.status_code)
        self.assertEqual("Course added", response.json())

        # Verify database changes
        newCourse = self.session.query(self.Course).filter_by(
            courseCode="COMP3506").first()
        self.assertEqual(courseData["courseCode"], newCourse.courseCode)
        self.assertEqual(courseData["courseName"], newCourse.courseName)
        self.assertEqual(
            courseData["courseDescription"], newCourse.courseDescription)
        self.assertEqual(courseData["university"], newCourse.university)
        self.assertEqual(0, newCourse.stars)
        self.assertEqual(0, newCourse.votes)

    def test_course_post_null_coursecode(self):
        """
        Checks for a 400 response from the /courses endpoint
        Checks for the correct response message
        """
        courseData = {
            "courseCode": "",
            "courseName": "Software Architecture",
            "courseDescription": "Doing some software architecture stuff with Richard and Evan (my bestie)",
            "university": "The University of Queensland",
        }

        response = requests.post(
            self.host() + '/courses', json=courseData, headers={'Accept': 'application/json'})

        # Verify response from API
        self.assertEqual(400, response.status_code)
        self.assertEqual(
            'Missing courseCode, courseName, courseDescription, or university', response.json())

        # Verify no database changes
        courseList = self.session.query(self.Course)
        # One created in setup should be the only course.
        self.assertEqual(1, courseList.count())

    def test_course_post_duplicate_coursecode(self):
        """
        Checks for a 400 response from the /courses endpoint
        Checks for the correct response message
        """
        courseData = {
            "courseCode": "CSSE6400",
            "courseName": "Software Architecture",
            "courseDescription": "Doing some software architecture stuff with Richard and Evan (my bestie)",
            "university": "The University of Queensland",
        }

        # Should error as duplicate when posting same course again.
        response = requests.post(
            self.host() + '/courses', json=courseData, headers={'Accept': 'application/json'})

        # Verify response from API
        self.assertEqual(409, response.status_code)
        self.assertEqual('Course already exists', response.json())

        # Verify no database changes
        newCourse = self.session.query(self.Course)
        self.assertEqual(1, newCourse.count())

    def test_course_get_exam_by_code(self):
        """
        Checks for a 200 response from the /courses/:courseCode/exams endpoint
        Checks for the correct response message
        """
        courseCode = "CSSE6400"

        expectedExamsForCourse = [
            {"examId": self.examId, "examYear": 2024,
                "examSemester": 1, "examType": "Final"},
        ]

        response = requests.get(
            self.host() + '/courses/' + courseCode + '/exams')

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedExamsForCourse, response.json())

    def test_course_get_course(self):
        """
        Checks for a 200 response from the /courses/:courseCode endpoint
        Checks for the correct response message
        """
        courseCode = "CSSE6400"

        expectedCourse = {
            "courseCode": self.COURSE_CODE,
            "courseName": self.COURSE_NAME,
            "courseDescription": self.COURSE_DESCRIPTION,
            "university": self.UNIVERSITY,
            "stars": 0,
            "votes": 0
        }

        response = requests.get(self.host() + '/courses/' + courseCode)

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedCourse, response.json())

    def test_course_get_course_not_found(self):
        """
        Checks for a 404 response from the /courses/:courseCode endpoint
        Checks for the correct response message
        """
        courseCode = "ENGG1000"

        response = requests.get(self.host() + '/courses/' + courseCode)

        # Verify response from API
        self.assertEqual(404, response.status_code)
        self.assertEqual('Course not found', response.json())

    def test_course_get_all(self):
        """
        Checks for a 200 response from the /courses endpoint
        Checks for the correct response message
        """
        expectedCourses = [
            {"courseCode": self.COURSE_CODE, "courseName": self.COURSE_NAME, "courseDescription": self.COURSE_DESCRIPTION, "university": self.UNIVERSITY, "stars": 0, "votes": 0}]

        response = requests.get(self.host() + '/courses')
        self.assertEqual(200, response.status_code)

        # Check if each expected course is included in the response
        for expectedCourse in expectedCourses:
            self.assertIn(expectedCourse, response.json())


    def test_course_patch_star(self):
        """
        Checks for a 200 response from the /courses/:courseCode/star endpoint
        Checks for the correct response message
        """

        # Verify Database has 0 Stars for CSSE6400
        course = self.session.query(self.Course).filter_by(
            courseCode=self.COURSE_CODE).first()
        self.assertEqual(0, course.stars)

        stars = {
            "starRating": 5,
            "userId": self.USER_ID,
        }

        response = requests.patch(
            self.host() + '/courses/' + self.COURSE_CODE + '/star', json=stars)

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Course starred', response.json())
        
        
        # Verify Database changes
        course = self.session.query(self.Course).filter_by(
            courseCode=self.COURSE_CODE).first()
        self.session.refresh(course)
        self.assertEqual(5, course.stars)

        stars = {
            "starRating": 3,
            "userId": self.USER_ID,
        }

        response = requests.patch(
            self.host() + '/courses/' + 'CSSE6400' + '/star', json=stars)

        # Verify response from API
        self.assertEqual(200, response.status_code)
        self.assertEqual('Course starred', response.json())

        # Verify Database changes
        course = self.session.query(self.Course).filter_by(
            courseCode=self.COURSE_CODE).first()
        self.session.refresh(course)
        self.assertEqual(3, course.stars)


    def test_course_patch_star_miss(self):
        """
        Checks for a 400 response from the /courses/:courseCode/star endpoint
        Checks for the correct response message
        """
        stars = {
            "starRating": 5,
        }

        response = requests.patch(
            self.host() + '/courses/' + 'STAR2001' + '/star', json=stars)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Missing starRating or userId', response.json())

        stars = {
            "userId": self.USER_ID,
        }

        response = requests.patch(
            self.host() + '/courses/' + 'STAR2001' + '/star', json=stars)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Missing starRating or userId', response.json())

    def test_course_patch_bad_star(self):
        """
        Checks for a 400 response from the /courses/:courseCode/star endpoint
        Checks for the correct response message
        """

        stars = {
            "starRating": 6,
            "userId": self.USER_ID,
        }

        response = requests.patch(
            self.host() + '/courses/' + self.COURSE_CODE + '/star', json=stars)
        
        # Verify response from API
        self.assertEqual(400, response.status_code)
        self.assertEqual(
            'Star rating must be between 0 and 5', response.json())
        
        # Verify Database
        course = self.session.query(self.Course).filter_by(
            courseCode=self.COURSE_CODE).first()
        self.session.refresh(course)
        self.assertEqual(0, course.stars)
        

        stars = {
            "starRating": -1,
            "userId": self.USER_ID,
        }

        response = requests.patch(
            self.host() + '/courses/' + self.COURSE_CODE + '/star', json=stars)
        
        # Verify response from API
        self.assertEqual(400, response.status_code)
        self.assertEqual(
            'Star rating must be between 0 and 5', response.json())
        
        # Verify Database
        course = self.session.query(self.Course).filter_by(
            courseCode=self.COURSE_CODE).first()
        self.session.refresh(course)
        self.assertEqual(0, course.stars)

    def test_course_patch_star_user(self):
        """
        Checks for a 404 response from the /courses/:courseCode/star endpoint
        Checks for the correct response message
        """
        stars = {
            "starRating": 5,
            "userId": "aRandomUserWhoDoesNotExist",
        }

        response = requests.patch(
            self.host() + '/courses/' + self.COURSE_CODE + '/star', json=stars)
        self.assertEqual(404, response.status_code)
        self.assertEqual('User not found', response.json())

    def test_course_patch_star_course(self):
        """
        Checks for a 404 response from the /courses/:courseCode/star endpoint
        Checks for the correct response message
        """
        stars = {
            "starRating": 5,
            "userId": self.USER_ID,
        }

        response = requests.patch(
            self.host() + '/courses/' + 'NOEXISTCOURSE' + '/star', json=stars)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Course not found', response.json())


if __name__ == '__main__':
    unittest.main()
