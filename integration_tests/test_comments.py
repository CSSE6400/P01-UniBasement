import unittest
import requests

from .base import BaseCase


class TestComments(BaseCase):   
    def test_put_edits_comment_success(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 12
        body = {
            "commentText": "This is a edited comment",
            "commentPNG": None
        }

        response = requests.put(self.host() + '/comments/' + str(commentId) + '/edit', json=body)
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment edited', response.json())

    def test_put_edits_comment_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686
        body = {
            "commentText": "The questionId does not exist so this should not work",
            "commentPNG": None
        }

        response = requests.put(self.host() + '/comments/' + str(commentId) + '/edit', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_put_edits_comment_no_changes(self):
        """
        Checks for a 400 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 1
        body = {
            "commentText": None,
            "commentPNG": None
        }

        response = requests.put(self.host() + '/comments/' + str(commentId) + '/edit', json=body)
        self.assertEqual(400, response.status_code)
        self.assertEqual('No changes made', response.json())

    def test_patch_deletes_comment_success(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 13

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/delete')
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment deleted', response.json())


    def test_patch_deletes_comment_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/delete')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())





if __name__ == '__main__':
    unittest.main()