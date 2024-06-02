# Tests

## Unit Testing

### About Unit Tests

The repo has a set of very basic unit tests which realistically only tests the backend compiles and fairly simple functions. This is because the majority of the functions within the backend are wrappers around database accessors rather than any complex functionality or data manipulation itself. The unit tests only test functions such as "nest" that do actually transform data separate from the database. These tests can be found inside "/backend/__tests__" in a file named "backend.test.jest". Functions created which do not rely on a database connection should be tested inside this file.

### Running Unit Tests

These tests are made using Jest and can be run using the command `npm test` from inside the backend directory.

### Adding to Unit Tests

To add a new test, create a new test function inside the "backend.test.jest" file. Each function should only test one function. Ensure groups of tests are grouped together inside a describe block. This block represents the function being tested. Inside the describe block each test block is a test for the function. Try and keep tests simple and only test one thing at a time.

## Integration Testing

### About Integration Tests

The integrations tests comprise of a backend integration suite and an e2e testing suite. The backend integration tests focus on testing the integration between the persistence and database layers of the architecture, by spinning up the backend server, calling various routes, and evaluating whether changes are reflected in the database. The e2e tests focus on testing the entire layered architecture, by spinning up the frontend, backend, and database, and testing the key functionality as though a user is interacting with the system.

### Running Integration Tests

To run the integration tests, navigate to the "integration_tests" directory and run the command `./run_tests.sh`. This will run all the tests and output the results to the console.

The full e2e test is excluded from the test script dockerfile as it requires Auth0 credentials to be present, which cannot be accomplished securely in our github actions without having access to the repository settings. This test can only be run locally, and is recommended to be done separately to the above test script. To do so, make sure the backend, frontend and database are running locally, and then run the command `pytest integration_tests/frontend/test)full_e2e.py`. This will run the full e2e test and output the results to the console.

### Adding to Integration Tests

#### Adding to backend integration tests

The backend integration tests are created using pytest.

Ensure that basic testing of the success and errors are tested inside the appropriate ".py" file. Ensure tests are written to also test the error handling and returned HTTP code. After this try adding the test into one or more of the scenarios in the "test_full_suite.py" file. The added test should follow the format of the other tests in the file. Tests should have a meaningful name following the format of test_ROUTE_TYPE_MOREINFO. Where ROUTE = route to be tested, TYPE= get, post  etc and MOREINFO = meaningful information about what the test is doing. This will help developers understand what the test is doing and why it is there. Ensure that each tests asserts the returned http code and the returned data. Inside each test if something is unclear, add a comment to explain what is happening.

#### Adding to e2e tests

The e2e tests are created using PlayWright.

Ensure that any new functionality is added to the full e2e test. Smaller e2e tests can be created if necessary. The easiest way to add tests to the frontend is to use playwrights vscode record feature to record the tests. This will generate the tests for you. After this, you can modify the tests to make them more readable and understandable. The tests should be placed inside the "integration_tests/frontend" directory. Where the filename represents the page type (e.g. test_home_page). To use playwright record please visit [PlayWright](https://playwright.dev/docs/getting-started-vscode).

## GitHub Workflow Actions

### About GitHub Workflow Actions

Currently, the unit tests and integration tests are run in the GitHub Actions. This is done on every push or PR to the main branch. The tests are run in parallel to speed up the process. They can also be manually run by clicking the workflow tests and selecting which branch to run the tests on. This will run both the integration and unit tests.

Note the full e2e test is not run in the GitHub Actions as it requires Auth0 credentials to be present, which cannot be accomplished securely in our github actions without having access to the repository settings for secrets. This test can only be run locally as detailed in [Running Integration Tests](#Running-Integration-Tests).

### Running GitHub Workflow Actions

#### Manual Run

To manually run the workflow on your branch navigate to the GitHub Actions tab and select the tests workflow. Then select the branch you want to run the tests on. This will run the tests on the selected branch. This will run both the integration and unit tests.

#### Automatic Run

The tests are run automatically on every push or PR to the main branch. This will run both the integration and unit tests.

## Results of Tests

This section has been added for the marker. For proof and evidence of the tests please visit the GitHub Actions and select the test workflow. Here you will find both the basic unit tests and integration tests being run and their results.
