import unittest
import os


class BaseCase(unittest.TestCase):
    def host(self):
        base = os.getenv('API_URL', "http://localhost:8080/api")
        
        if base[-1] == '/':
            return base[:-1]
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