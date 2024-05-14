import re


class TestFrontEnd:
    def test_has_title(self, page):
        page.goto("http://frontend:3000")
        assert re.compile("EVAN").search(
            page.title()), "Title does not contain 'Evan' who is our lord and saviour."

