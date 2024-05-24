# import re
# from ..base import BaseCase
# from playwright.sync_api import sync_playwright, expect
#
#
# class FullE2E(BaseCase):
#     def setUp(self):
#         self.p = sync_playwright().start()
#         self.browser = self.p.chromium.launch()
#         self.context = self.browser.new_context()
#         self.page = self.context.new_page()
#         self.page.goto("http://frontend:3000")
#         self.session = self.get_db_session()
#         self.User = self.Base.classes['user']
#         self.session.commit()
#
#     def tearDown(self):
#         self.page.close()
#         self.context.close()
#         self.browser.close()
#         self.p.stop()
#
#
#     def test_e2e(self):
#         # Sign in as admin user
#         self.page.get_by_role("link", name="Sign in").click()
#         self.page.get_by_label("Email address*").click()
#         self.page.get_by_label("Email address*").fill("admin@unibasement.local")
#         self.page.get_by_label("Password*").click()
#         self.page.get_by_label("Password*").fill("Admin_Password")
#         self.page.get_by_role("button", name="Continue", exact=True).click()
#         self.page.wait_for_url("http://frontend:3000/")
#
#         # Check that the user is redirected to the home page which shows a greeting
#         # <greeting>, admin
#         expect(self.page.locator("body")).to_contain_text(", admin")
#
#         print(self.session.query(self.User).all())
#
#         created_user = self.session.query(self.User).filter_by(
#             userId="auth0|6650788478a66f328f8351b4").first()
#         created_user.role = 1
#         self.session.commit()
#
#         # Go to courses
#         self.page.get_by_role("link", name="Courses").click()
#         self.page.wait_for_url("http://frontend:3000/courses")
#
#         # Expect to see the add courses button as admin
#         expect(self.page.get_by_role("link", name="Add Course")).to_be_visible()
#
#         # Add a course
#         self.page.get_by_role("link", name="Add Course").click()
#         self.page.wait_for_url("http://frontend:3000/courses/add")
#         expect(self.page.get_by_text("Add Course")).to_be_visible()
#
#         # Fill in form
#         self.page.locator("input[name=\"courseCode\"]").click()
#         self.page.locator("input[name=\"courseCode\"]").fill("CSSE6400")
#         self.page.locator("input[name=\"courseName\"]").click()
#         self.page.locator("input[name=\"courseName\"]").fill("Software Architectures")
#         self.page.locator("textarea[name=\"courseDescription\"]").click()
#         self.page.locator("textarea[name=\"courseDescription\"]").fill("My favourite course :)")
#         self.page.get_by_role("button", name="Submit").click()
#
#         # Expect to be redirected to the courses page on submit
#         self.page.wait_for_url("http://frontend:3000/courses")
