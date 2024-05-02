import unittest
import requests
import random

from .base import BaseCase


class TestUser(BaseCase):
    def test_exam_post(self):
        """
        Checks for a 201 response from the /exam endpoint
        Checks for the correct response message
        """
        response = requests.get(self.host() + '/exam', headers={'Accept': 'application/json'})
        self.assertEqual(201, response.status_code)
        self.assertEqual("Exam Added!", response.json())



if __name__ == '__main__':
    unittest.main()