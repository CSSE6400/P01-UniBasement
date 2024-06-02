import re

from playwright.sync_api import sync_playwright, expect

from ..base import BaseCase

"""
This test can only be run locally since it depends on the frontend
being run using npm and having auth0 credentials setup
"""


class FullE2E(BaseCase):
    def setUp(self):
        self.p = sync_playwright().start()
        self.browser = self.p.chromium.launch()
        self.context = self.browser.new_context(color_scheme="dark")
        self.page = self.context.new_page()
        self.page.goto("http://localhost:3000")
        self.session = self.get_db_session()
        self.User = self.Base.classes['user']

        # Creates the admin user in db
        admin_user_data = {
            "userId": "auth0|6650788478a66f328f8351b4",
            "role": 1  # admin role
        }

        admin_user = self.User(**admin_user_data)
        self.session.add(admin_user)

        # Creates the regular user in db
        regular_user_data = {
            "userId": "auth0|6650784678a66f328f835197",
            "role": 0  # regular user role
        }

        regular_user = self.User(**regular_user_data)
        self.session.add(regular_user)

        self.session.commit()

    def tearDown(self):
        self.page.close()
        self.context.close()
        self.browser.close()
        self.p.stop()

    def test_e2e(self):
        # Sign in as admin user
        self.page.get_by_role("link", name="Sign in").click()
        self.page.get_by_label("Email address*").click()
        self.page.get_by_label("Email address*").fill("admin@unibasement.local")
        self.page.get_by_label("Password*").click()
        self.page.get_by_label("Password*").fill("Admin_Password")
        self.page.get_by_role("button", name="Continue", exact=True).click()
        self.page.wait_for_url("http://localhost:3000/")

        # Check that the user is redirected to the home page which shows a greeting
        # <greeting>, admin
        expect(self.page.locator("body")).to_contain_text(", admin")

        # Go to courses
        self.page.get_by_role("link", name="Courses").click()
        self.page.wait_for_url("http://localhost:3000/courses")

        # Expect to see the add courses button as admin
        expect(self.page.get_by_role("link", name="Add Course")).to_be_visible()

        # Add a course
        self.page.get_by_role("link", name="Add Course").click()
        self.page.wait_for_url("http://localhost:3000/courses/add")
        expect(self.page.get_by_text("Add Course")).to_be_visible()

        # Fill in form
        self.page.locator("input[name=\"courseCode\"]").click()
        self.page.locator("input[name=\"courseCode\"]").fill("CSSE6400")
        self.page.locator("input[name=\"courseName\"]").click()
        self.page.locator("input[name=\"courseName\"]").fill("Software Architecture")
        self.page.locator("textarea[name=\"courseDescription\"]").click()
        self.page.locator("textarea[name=\"courseDescription\"]").fill("My favourite course :)")
        self.page.get_by_role("button", name="Submit").click()

        # Expect to be redirected to the courses page on submit
        self.page.wait_for_url("http://localhost:3000/courses")

        # Expect to see the course on the courses page
        expect(self.page.get_by_role("link", name="CSSE6400 Software Architecture")).to_be_visible()
        self.page.get_by_role("link", name="CSSE6400 Software Architecture").click()

        # Expect to be redirected to the CSSE6400 page
        self.page.wait_for_url("http://localhost:3000/courses/CSSE6400")

        # Expect to see the course description
        expect(self.page.get_by_text("My favourite course :)")).to_be_visible()

        # Go to past exams
        self.page.get_by_role("button", name="Past Exams").click()

        # Expect to see the add exam button as admin
        expect(self.page.get_by_role("link", name="Add Exam")).to_be_visible()

        # Add an exam
        self.page.get_by_role("link", name="Add Exam").click()
        self.page.wait_for_url("http://localhost:3000/courses/CSSE6400/exams/add")
        expect(self.page.get_by_text("Add Exam")).to_be_visible()

        # Fill in form
        self.page.get_by_role("textbox").click()
        self.page.get_by_role("textbox").fill("2023")
        self.page.locator("select[name=\"examSemester\"]").select_option("1")
        self.page.locator("select[name=\"examType\"]").select_option("final")
        self.page.get_by_role("button", name="Submit").click()

        # Expect to be redirected to the CSSE6400 page on submit
        self.page.wait_for_url("http://localhost:3000/courses/CSSE6400")
        self.page.get_by_role("button", name="Past Exams").click()

        # Expect to see the exam on the past exams page
        expect(self.page.get_by_role("heading", name="2023")).to_be_visible()
        expect(self.page.get_by_role("heading", name="Semester")).to_be_visible()
        expect(self.page.get_by_role("link", name="final")).to_be_visible()

        # Go to the exam page
        self.page.get_by_role("link", name="final").click()
        self.page.wait_for_url("http://localhost:3000/courses/CSSE6400/exams/1")

        # Expect to be able to add a question
        expect(self.page.get_by_role("button", name="Add Question")).to_be_visible()

        # Add a question
        self.page.get_by_role("button", name="Add Question").click()
        self.page.get_by_placeholder("Add an answer...").fill("This is a test question.")
        self.page.get_by_role("button", name="Post").click()

        # Add an answer
        self.page.get_by_role("button", name="Answers").click()
        self.page.get_by_role("button", name="Add Answer").click()
        self.page.get_by_placeholder("Add an answer...").fill("An example answer")
        self.page.get_by_role("button", name="Post").click()

        # Logout as admin
        self.page.get_by_text("admin").click()
        self.page.get_by_role("link", name="Logout").click()
        self.page.wait_for_url("http://localhost:3000/")

        # Sign in as regular user
        self.page.get_by_role("link", name="Sign in").click()
        self.page.get_by_label("Email address*").click()
        self.page.get_by_label("Email address*").fill("user@unibasement.local")
        self.page.get_by_label("Password*").click()
        self.page.get_by_label("Password*").fill("User_Password")
        self.page.get_by_role("button", name="Continue", exact=True).click()
        self.page.wait_for_url("http://localhost:3000/")

        # Check that the user is redirected to the home page which shows a greeting
        # <greeting>, user
        expect(self.page.locator("body")).to_contain_text(", user")

        # Go to courses & find the CSSE6400 course
        self.page.get_by_role("link", name="Courses").click()
        self.page.wait_for_url("http://localhost:3000/courses")
        expect(self.page.get_by_text("Add Course")).not_to_be_visible()
        expect(self.page.get_by_role("link", name="CSSE6400 Software Architecture")).to_be_visible()
        self.page.get_by_role("link", name="CSSE6400 Software Architecture").click()
        self.page.wait_for_url("http://localhost:3000/courses/CSSE6400")

        # Check rating the course
        self.page.get_by_role("button", name="Rate The Course").click()
        expect(self.page.locator("body")).to_contain_text("0 rating")
        self.page.locator("div").filter(
            has_text=re.compile(r"^DescriptionPast ExamsRate The CourseLeave your rating:$")).locator("path").nth(
            4).click()
        expect(self.page.locator("body")).to_contain_text("1 rating")

        # Go to exams
        self.page.get_by_role("button", name="Past Exams").click()
        expect(self.page.get_by_text("Add Exam")).not_to_be_visible()
        expect(self.page.get_by_role("link", name="final")).to_be_visible()

        # Go to the exam page
        self.page.get_by_role("link", name="final").click()
        self.page.wait_for_url("http://localhost:3000/courses/CSSE6400/exams/1")

        # Expect to see the question
        expect(self.page.get_by_text("This is a test question.")).to_be_visible()

        # Expect to see the answer
        self.page.get_by_role("button", name="Answers").click()
        expect(self.page.get_by_text("An example answer")).to_be_visible()

        # Check upvoting the answer
        expect(self.page.get_by_text("1", exact=True)).not_to_be_visible()
        self.page.locator("#accordion-collapse-body").get_by_role("button").nth(1).click()
        expect(self.page.get_by_text("1", exact=True)).to_be_visible()

        # Logout as regular user
        self.page.get_by_text("user").click()
        self.page.get_by_role("link", name="Logout").click()
        self.page.wait_for_url("http://localhost:3000/")
