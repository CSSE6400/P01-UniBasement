import unittest
import requests

from .base import BaseCase


class TestUser(BaseCase):

    def test_user_post(self):
        """
        Checks for a 201 response from the /courses endpoint
        Checks for the correct response message
        """
        user_data = {
            "userId": "EVAN",
        }

        response = requests.post(self.host() + '/users', json=user_data, headers={'Accept': 'application/json'})

        self.assertEqual(201, response.status_code)
        self.assertEqual("User Added", response.json())


    def test_user_post_missing(self):
        """
        Checks for a 201 response from the /courses endpoint
        Checks for the correct response message
        """
        user_data = {
            "filler": "meow",
        }

        response = requests.post(self.host() + '/users', json=user_data, headers={'Accept': 'application/json'})

        self.assertEqual(400, response.status_code)
        self.assertEqual("Missing userId", response.json())


    def test_user_post_double(self):
        """
        Checks for a 201 response from the /courses endpoint
        Checks for the correct response message
        """
        user_data = {
            "userId": "DoughBell",
        }

        response = requests.post(self.host() + '/users', json=user_data, headers={'Accept': 'application/json'})

        self.assertEqual(201, response.status_code)
        self.assertEqual("User Added", response.json())

        response = requests.post(self.host() + '/users', json=user_data, headers={'Accept': 'application/json'})

        self.assertEqual(409, response.status_code)
        self.assertEqual("User already exists", response.json())
