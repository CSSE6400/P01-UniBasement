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
            "commentPNG": None,
            "userId": "evan",
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
            "commentPNG": None,
            "userId": "evan",
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
        body = {
            "userId": "evan"
        }

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/downvote', json=body)
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment downvoted', response.json())


    def test_patch_downvotes_comment_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686
        body = {
            "userId": "evan"
        }

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/downvote', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())


    def test_patch_upvotes_comment(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 19
        body = {
            "userId": "evan"
        }

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/upvote', json=body)
        self.assertEqual(200, response.status_code)
        self.assertEqual('Comment upvoted', response.json())


    def test_patch_upvotes_comment_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 86868686
        body = {
            "userId": "evan"
        }

        response = requests.patch(self.host() + '/comments/' + str(commentId) + '/upvote', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Comment not found', response.json())

    def test_post_comment_success(self):
        """
        Checks for a 201 response from the /comments endpoint
        Checks for the correct response message
        """
        body = {
            "questionId": 13,
            "parentCommentId": 0,
            "userId": "evan",
            "commentText": "This is a comment",
            "commentPNG": None,
            "isCorrect": False,
            "isEndorsed": False,
            "upvotes": 0,
            "downvotes": 0
        }
        
        response = requests.post(self.host() + '/comments', json=body)
        self.assertEqual(201, response.status_code)

    def test_post_comment_invalid_question_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        body = {
            "questionId": 868686,
            "parentCommentId": 0,
            "userId": "evan",
            "commentText": "This is a comment",
            "commentPNG": None,
            "isCorrect": False,
            "isEndorsed": False,
            "upvotes": 0,
            "downvotes": 0
        }

        response = requests.post(self.host() + '/comments', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Question not found', response.json())


    def test_post_comment_no_question_id(self):
        """
        Checks for a 400 response from the /comments endpoint
        Checks for the correct response message
        """
        body = {
            "questionId": None,
            "parentCommentId": 0,
            "userId": "evan",
            "commentText": "This is a comment",
            "commentPNG": None,
            "isCorrect": False,
            "isEndorsed": False,
            "upvotes": 0,
            "downvotes": 0
        }

        response = requests.post(self.host() + '/comments', json=body)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Missing questionId or userId', response.json())


    def test_post_comment_no_comment_text_or_png(self):
        """
        Checks for a 400 response from the /comments endpoint
        Checks for the correct response message
        """
        body = {
            "questionId": 13,
            "parentCommentId": 0,
            "userId": "evan",
            "commentText": None,
            "commentPNG": None,
            "isCorrect": False,
            "isEndorsed": False,
            "upvotes": 0,
            "downvotes": 0
        }

        response = requests.post(self.host() + '/comments', json=body)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Missing commentText or commentPNG', response.json())


    def test_post_comment_nested_comment(self):
        """
        Checks for a 201 response from the /comments endpoint
        Checks for the correct response message
        """
        body = {
            "questionId": 14,
            "parentCommentId": 21,
            "userId": "evan",
            "commentText": "This is a nested comment",
            "commentPNG": None,
            "isCorrect": False,
            "isEndorsed": False,
            "upvotes": 0,
            "downvotes": 0
        }
        
        response = requests.post(self.host() + '/comments', json=body)
        self.assertEqual(201, response.status_code)


    def test_post_comment_nested_invalid_parentID(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        body = {
            "questionId": 14,
            "parentCommentId": 868686,
            "userId": "evan",
            "commentText": "This is a nested comment",
            "commentPNG": None,
            "isCorrect": False,
            "isEndorsed": False,
            "upvotes": 0,
            "downvotes": 0
        }

        response = requests.post(self.host() + '/comments', json=body)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Parent comment not found', response.json())


    def test_post_comment_nested_parentId_not_from_same_question(self):
        """
        Checks for a 400 response from the /comments endpoint
        Checks for the correct response message
        """
        body = {
            "questionId": 15,
            "parentCommentId": 1,
            "userId": "evan",
            "commentText": "This is a nested comment",
            "commentPNG": None,
            "isCorrect": False,
            "isEndorsed": False,
            "upvotes": 0,
            "downvotes": 0
        }

        response = requests.post(self.host() + '/comments', json=body)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Parent comment is not from the same question', response.json())

    def test_get_comment_by_id(self):
        """
        Checks for a 200 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 23
        expectedResponse = {
                "commentId": commentId,
                "parentCommentId": None,
                "userId": 'evan',
                "commentText": "This is a comment.",
                "commentPNG": None,
                "isCorrect": True,
                "isEndorsed": True,
                "upvotes": 100,
                "downvotes": 1,
                "questionId": 16,
                "created_at": "2001-06-01T09:00:00",
                "updated_at": "2001-06-01T09:00:00"
        }

        response = requests.get(self.host() + '/comments/' + str(commentId))

        def update_timestamps(response_dict, created_at, updated_at):
            if isinstance(response_dict, list):
                for item in response_dict:
                    update_timestamps(item, created_at, updated_at)
            elif isinstance(response_dict, dict):
                if 'created_at' in response_dict:
                    response_dict['created_at'] = created_at
                if 'updated_at' in response_dict:
                    response_dict['updated_at'] = updated_at
                for key, value in response_dict.items():
                    if isinstance(value, (list, dict)):
                        update_timestamps(value, created_at, updated_at)

        update_timestamps(expectedResponse, response.json()['created_at'], response.json()['updated_at'])

        self.assertEqual(200, response.status_code)
        self.assertEqual(expectedResponse, response.json())


    def test_get_comment_by_id_invalid_id(self):
        """
        Checks for a 404 response from the /comments endpoint
        Checks for the correct response message
        """
        commentId = 868686

        expectedResponse = {
            "error": "Comment not found"
        }

        response = requests.get(self.host() + '/comments/' + str(commentId))
        self.assertEqual(404, response.status_code)
        self.assertEqual(expectedResponse, response.json())

if __name__ == '__main__':
    unittest.main()