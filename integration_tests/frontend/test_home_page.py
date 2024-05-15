import re
from ..base import BaseCase
from playwright.sync_api import sync_playwright, expect


class HomePage(BaseCase):
    def test_has_title(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto("http://frontend:3000")
            assert re.compile("EVAN").search(
                page.title()), "Title does not contain 'Evan' who is our lord and saviour."
            browser.close()

    def test_has_body_text(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto("http://frontend:3000")
            assert "Enhance your exam revision and level up with the community!" in page.locator(
                "body").inner_text()
            browser.close()

    def test_has_courses(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto("http://frontend:3000")
            assert "Courses" in page.locator("text=Courses").inner_text()
            browser.close()

    def test_has_favourites(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto("http://frontend:3000")
            assert "Favourites" in page.locator("text=Favourites").inner_text()
            browser.close()

    def test_has_working_with_text(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto("http://frontend:3000")
            assert "Working with the following to give you all the exam prepartion you need" in page.locator(
                "body").inner_text()
            browser.close()
