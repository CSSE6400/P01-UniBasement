import unittest
import requests

from ..base import BaseCase


class Health(BaseCase):
    def test_evan(self):
        """
        Checks for a 200 response from the evan endpoint
        """
        response = requests.get(self.host() + '/evan', headers={'Accept': 'application/json'})
        self.assertEqual(200, response.status_code)

    def test_health(self):
        """
        Checks for a 200 response from the health endpoint
        """
        response = requests.get(self.host() + '/health', headers={'Accept': 'application/json'})
        self.assertEqual(200, response.status_code)




if __name__ == '__main__':
    unittest.main()