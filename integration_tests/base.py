import unittest
import os
import requests
from base import update_timestamps

class BaseCase(unittest.TestCase):
    def host(self):
        base = os.getenv('API_URL', "http://localhost:8080/api")
        
        if base[-1] == '/':
            requests.get(base[:-1] + '/sketch', headers={'Accept': 'application/json'})
            return base[:-1]
        requests.get(base + '/sketch', headers={'Accept': 'application/json'})
        return base

    def assertDictSubset(self, expected_subset: dict, whole: dict, dict_sort=lambda d: d['name']):
        for key, value in expected_subset.items():
            if key not in whole:
                self.assertFalse(True, f'Key {key} not found in {whole}')
            if isinstance(value, dict):
                self.assertDictSubset(value, whole[key])

            if isinstance(value, list):
                if len(value) > 0 and isinstance(value[0], dict):
                    self.assertEqual(sorted(value, key=dict_sort), sorted(whole[key], key=dict_sort))
                else:
                    self.assertEqual(sorted(value), sorted(whole[key]))
            else:
                self.assertEqual(value, whole[key])
    
    # This function is used to update the timestamps of the response dictionary
    # Can handle both list and dict
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