import re
from ..base import BaseCase
from playwright.sync_api import sync_playwright, expect


class HomePage(BaseCase):
    def test_has_title(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto("http://frontend:3000")
            assert re.compile("EVAN").search(page.title()), "Title does not contain 'Evan' who is our lord and saviour."
            browser.close()