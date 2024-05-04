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


    def test_patch_sets_comment_as_correct(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 14

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/correct')
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment marked as correct', response.json())


    def test_patch_sets_comment_as_correct_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/correct')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_sets_comment_as_incorrect(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 15

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/incorrect')
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment marked as incorrect', response.json())


    def test_patch_sets_comment_as_incorrect_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/incorrect')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_sets_comment_as_endorsed(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 16

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/endorse')
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment endorsed', response.json())


    def test_patch_sets_comment_as_endorsed_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/endorse')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_sets_comment_as_not_endorsed(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 17

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/unendorse')
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment removed endorsement', response.json())


    def test_patch_sets_comment_as_not_endorsed_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/unendorse')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_downvotes_comment(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 18

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/downvote')
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment downvoted', response.json())


    def test_patch_downvotes_comment_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/downvote')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_upvotes_comment(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 19

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/upvote')
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment upvoted', response.json())


    def test_patch_upvotes_comment_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/upvote')
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())




if __name__ == '__main__':
    unittest.main()