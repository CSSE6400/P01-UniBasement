import unittest
import requests
import random

from .base import BaseCase


class TestUser(BaseCase):
    def setUp(self):
        # Generate test data
        requests.get(self.host() + '/sketch', headers={'Accept': 'application/json'})

    def tearDown(self):
        # Delete test data
        requests.get(self.host() + '/sketchies', headers={'Accept': 'application/json'})
        


    # def test_course_post(self):
    #     """
    #     Checks for a 201 response from the /courses endpoint
    #     Checks for the correct response message
    #     """
    #     course_data = {
    #         "courseCode": "CSSE6400",
    #         "courseName": "Software Architecture",
    #         "courseDescription": "Doing some software architecture stuff with Richard and Evan (my bestie)"
    #     }

    #     response = requests.post(self.host() + '/courses', json=course_data, headers={'Accept': 'application/json'})

    #     self.assertEqual(201, response.status_code)

    #     self.assertEqual('Course Added!', response.json())



if __name__ == '__main__':
    unittest.main()