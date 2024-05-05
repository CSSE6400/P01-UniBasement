# Tests

## Unit Testing

### About Unit Tests

The repo has a set of very basic unit tests which realistically only tests the backend compiles. This is because the majority of the functions within the backend rely on a database connection and cannot be tested through basic unit testing. The unit tests test functions such as "nest" that do not need a backend. These tests can be found inside "/backend/__tests__" in a file named "backend.test.jest". Functions created which do not rely on a database connection should be tested inside this file.

### Running Unit Tests

These tests are made using Jest and can be run using the command `npm test` from inside the backend directory. The tests

### Adding to Unit Tests

To add a new test, create a new test function inside the "backend.test.jest" file. Each function should only test one function. Ensure groups of tests are grouped together inside a describe block. This block represents the function being tested. Inside the describe block each test block is a test for the function. Try and keep tests simple and only test one thing at a time.

## Integration Testing

### About Integration Tests

The repo features fully functional and amazing integration tests which cover the majority of the backend. These tests utilise Python Unittest and is designed to be fully maintainable and accurate. The tests are located inside "integration_tests" in various ".py" files. Each file represents a different route in the backend. The exclusion to this is the "full_suite.py" file which features tests which are designed to be more in depth and go through various scenarios. These scenarios are designed to test the backend in a more real world scenario and ensure the backend is functioning as expected. The tests work by spinning up 3 containers (backend, database and the container running the tests). These containers are defined inside the "docker-compose.yml" file located inside the "integration_tests" directory. The tests can be run locally or in the GitHub Actions. Currently they are set to run in the GitHub Actions on every push or PR to the main branch. However, developers can manually run it as well by selecting run workflow and selecting the branch they want tested. Another important note is that the database must be cleared to ensure that no persistent data is left over. This is automated as part of the test.sh script. If you think the containers are not resetting properly please run ```docker-compose down --rmi all -v --remove-orphans``` to remove all containers and volumes. When the tests are run at the end it provides a short overview on how many tests passed and failed. To find more details about the test that failed scroll up until you find the test that failed and it will provide more information on why it failed. All tests (excluding the Full Suite testing) are designed to have a few asserts and to verify the function is working as expected. Each function currently has success tests which ensure normal functionality. And other functions nearby which handle ensuring the function fails when it should and returns the correct error message and code. The Full Suite testing is designed to test the backend in more real world scenarios and ensure the backend is functioning as expected.

### Running Integration Tests

To run the integration tests, navigate to the "integration_tests" directory and run the command `./run_tests.sh`. This will run all the tests and output the results to the console.

### Adding to Integration Tests

When adding new tests for routes. Ensure that basic testing of the success and errors are tested inside the appropriate ".py" file. Ensure tests are written to also test the error handling and returned HTTP code. After this try adding the test into one or more of the scenarios in the "test_full_suite.py" file. The added test should follow the format of the other tests in the file. Tests should have a meaningful name following the format of test_ROUTE_TYPE_MOREINFO. Where ROUTE = route to be tested, TYPE= get, post  etc and MOREINFO = meaningful information about what the test is doing. This will help developers understand what the test is doing and why it is there. Ensure that each tests asserts the returned http code and the returned data. Inside each test if something is unclear, add a comment to explain what is happening.

## GitHub Workflow Actions

### About GitHub Workflow Actions

Currently the unit tests and integration tests are run in the GitHub Actions. This is done on every push or PR to the main branch. The tests are run in parallel to speed up the process. They can also be manually run by clicking the workflow tests and selecting which branch to run the tests on. This will run both the integration and unit tests.

### Running GitHub Workflow Actions

#### Manual Run

To manually run the workflow on your branch navigate to the GitHub Actions tab and select the tests workflow. Then select the branch you want to run the tests on. This will run the tests on the selected branch. This will run both the integration and unit tests.

#### Automatic Run

The tests are run automatically on every push or PR to the main branch. This will run both the integration and unit tests.
