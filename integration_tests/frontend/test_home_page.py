import re
from ..base import BaseCase
from playwright.sync_api import sync_playwright, expect


class HomePage(BaseCase):
    def setUp(self):
        self.p = sync_playwright().start()
        self.browser = self.p.chromium.launch()
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
        self.page.goto("http://frontend:3000")

    def tearDown(self):
        self.page.close()
        self.context.close()
        self.browser.close()
        self.p.stop()
        

    def test_has_title(self):
        assert re.compile("EVAN").search(
            self.page.title()), "Title does not contain 'Evan' who is our lord and saviour."

    def test_has_body_text(self):
        assert "Enhance your exam revision and level up with the community!" in self.page.locator(
            "body").inner_text()

    def test_has_courses(self):
        assert "Courses" in self.page.locator("text=Courses").inner_text()

    def test_has_working_with_text(self):
        assert "Working with the following to give you all the exam prepartion you need" in self.page.locator(
            "body").inner_text()
