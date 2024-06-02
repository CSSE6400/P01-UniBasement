import unittest
import os
import requests
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy import create_engine, MetaData


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
                    self.assertEqual(sorted(value, key=dict_sort),
                                     sorted(whole[key], key=dict_sort))
                else:
                    self.assertEqual(sorted(value), sorted(whole[key]))
            else:
                self.assertEqual(value, whole[key])

    def get_db_session(self):
        db_url = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_DATABASE')}"
        engine = create_engine(db_url)

        # Reflect existing tables
        metadata = MetaData()
        metadata.reflect(bind=engine)

        # Create a base for automap
        self.Base = automap_base(metadata=metadata)
        self.Base.prepare(engine)

        Session = scoped_session(sessionmaker(bind=engine))
        session = Session()

        return session

# This function is used to update the timestamps of the response dictionary
# Can handle both list and dict


def update_timestamps(response_dict, created_at, updated_at):
    if isinstance(response_dict, list):
        for item in response_dict:
            update_timestamps(item, created_at, updated_at)
    elif isinstance(response_dict, dict):
        if 'createdAt' in response_dict:
            response_dict['createdAt'] = created_at
        if 'updatedAt' in response_dict:
            response_dict['updatedAt'] = updated_at
        for key, value in response_dict.items():
            if isinstance(value, (list, dict)):
                update_timestamps(value, created_at, updated_at)
