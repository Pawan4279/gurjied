import os
import secrets
import unittest
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch
import httpx

os.environ['MONGODB_DATABASE'] = 'guruji_test_' + secrets.token_hex(8)
os.environ['GURUJI_ENV_FILE'] = str(Path(__file__).with_name('missing-test.env'))
from fastapi.testclient import TestClient
from backend.main import app, db, client

class API(unittest.TestCase):
    @classmethod
    def tearDownClass(cls):
        assert db.name.startswith('guruji_test_')
        client.drop_database(db.name)

    def test_accounts(self):
        with TestClient(app) as browser:
            self.assertEqual(browser.get('/api/session').status_code, 401)
            self.assertEqual(browser.post('/api/login', json={'email':'guru@ji.com','password':'12345'}).status_code, 401)
            creds = {'email':'learner@example.com','password':secrets.token_urlsafe(18),'name':'Learner'}
            self.assertEqual(browser.post('/api/register', json={**creds,'password':'12345'}).status_code, 422)
            self.assertEqual(browser.post('/api/register', json=creds).status_code, 201)
            saved = db.users.find_one({'email':creds['email']})
            self.assertNotIn('password', saved)
            self.assertNotEqual(saved['password_hash'], creds['password'])
            self.assertEqual(browser.post('/api/register', json={**creds,'email':'LEARNER@example.com'}).status_code, 409)
            profile = {'name':'Learner','course':'SSC','learningMode':'Assessment','subject':'Mathematics'}
            self.assertEqual(browser.put('/api/profile', json=profile).status_code, 200)
            self.assertEqual(browser.post('/api/logout', headers={'origin':'https://other.example'}).status_code, 403)
            self.assertEqual(browser.post('/api/logout').status_code, 200)
            self.assertEqual(browser.get('/api/session').status_code, 401)
            self.assertEqual(browser.post('/api/login', json={**creds,'password':'wrong'}).status_code, 401)
            self.assertEqual(browser.post('/api/login', json=creds).status_code, 200)
            self.assertEqual(browser.get('/api/session').json()['profile'], profile)
            question_types = ['single_choice', 'multi_select', 'fill_blank', 'numeric', 'true_false']
            questions = []
            for index, question_type in enumerate(question_types):
                options = ['A', 'B', 'C', 'D']
                correct = ['A', 'B'] if question_type == 'multi_select' else (['True'] if question_type == 'true_false' else ['A'] if question_type == 'single_choice' else ['42'])
                questions.append({'type':question_type,'prompt':f'Question {index+1}','mathml':'<math><mfrac><mn>1</mn><mn>2</mn></mfrac></math>' if index == 0 else None,'options':options,'correct_answers':correct,'explanation':'Checked explanation.'})
            draft = {'title':'SSC Mathematics Assessment','duration_minutes':20,'instructions':'Answer all questions.','questions':questions}
            async def model_response(*args, **kwargs):
                return httpx.Response(200, json={'message':{'content':json.dumps(draft)}}, request=httpx.Request('POST','http://localhost/api/chat'))
            with patch('backend.main.httpx.AsyncClient.post', new=model_response):
                generated = browser.post('/api/assessments/generate')
            self.assertEqual(generated.status_code, 200)
            assessment = generated.json()
            self.assertNotIn('correct_answers', json.dumps(assessment))
            self.assertIn('<mfrac>', assessment['questions'][0]['mathml'])
            answers = {f'q{i+1}': (['A','B'] if kind == 'multi_select' else 'True' if kind == 'true_false' else 'A' if kind == 'single_choice' else '42') for i, kind in enumerate(question_types)}
            scored = browser.post(f"/api/assessments/{assessment['id']}/submit", json={'answers':answers})
            self.assertEqual(scored.json()['score'], 5)
            with TestClient(app) as other:
                self.assertEqual(other.post('/api/register', json={**creds,'email':'other@example.com'}).status_code, 201)
                self.assertIsNone(other.get('/api/session').json()['profile'])
            db.sessions.update_many({}, {'$set':{'expires':datetime.now(timezone.utc)-timedelta(seconds=1)}})
            self.assertEqual(browser.get('/api/session').status_code, 401)

if __name__ == '__main__':
    unittest.main()
