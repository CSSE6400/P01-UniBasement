import re
import pytest
from playwright.sync_api import sync_playwright


class TestFrontEnd:
    @pytest.fixture(scope="class")
    def page(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            yield page
            page.close()
            browser.close()

    def test_has_title(self, page):
        page.goto("http://localhost:3000")
        assert re.compile("EVAN").search(
            page.title()), "Title does not contain 'Evan' who is our lord and saviour."

    # def test_get_started_link(self, page):
    #     page.goto("https://localhost:3000")
    #     page.click("text=Get started")
    #     assert page.wait_for_selector(
    #         "text=Installation"), "Installation heading not found"