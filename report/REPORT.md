<!--- 
Title Name of your software project.
Abstract Summarise the key points of your document.
Changes Describe and justify any changes made to the project from what was outlined in the proposal.
Architecture Options What architectural design patterns were considered and their pros and cons.
Architecture Describe the MVP’s software architecture in detail.
Trade-Offs Describe and justify the trade-offs made in designing the architecture.
Critique Describe how well the architecture supports delivering the complete system.
Evaluation Summarise testing results and justify how well the software achieves its quality attributes.
Reflection Lessons learnt and what you would do differently.

You do not need to have sections for each topic above, though your report needs to contain the content
summarised above. For example, the description of the architecture could include discussion of trade-
offs. Similarly, the critique and evaluation could be combined so that both are discussed in relation to an
architecturally significant requirement (ASR) [2].
When writing your report, you may assume that the reader is familiar with the project proposal. You will
need to describe any changes your team has made to the original proposal. A rationale should be provided
for each change. Small changes only need a brief summary of the reason for the change. Significant
changes to functionality of the MVP, or changes to important quality attributes, need a more detailed
justification for the change. You should provide a reference and link to the original proposal.
Compare and contrast different architectural design patterns that could be used to deliver the system.
Explain the pros and cons of each architectural design pattern in the context of the system’s functionality
and ASRs. Justify your choice of the architectural design pattern you used in your design.
Describe the full architecture of your MVP in enough detail to give the reader a complete understanding
of the architecture’s design. Use appropriate views, diagrams and commentary to describe the software
architecture. You should describe parts of the detailed design that demonstrate how the architecture sup-
ports delivering key quality attributes [2]. (e.g. If interoperability was a key quality attribute, you would
need to describe the parts of the detailed design that support this. For example, how you use the adapter
design pattern to communicate with external services.)
Describe any trade-offs made during the design of the architecture. Explain what were the competing
issues2 and explain why you made the decisions that resulted in your submitted design.
When describing the architecture and trade-offs, you should summarise and/or reference ADRs that
relate to important decisions that affected your architecture.
Your critique should discuss how well the architecture is suited to delivering the full system functionality
and quality attributes. Use test results to support your claims, where this can be shown through testing.
For quality attributes that cannot be easily tested (e.g. extensibility, interoperability, ...), you will need to
provide an argument, based on your architectural design, about how the design supports or enables the
attribute. Some quality attributes (e.g. scalability) may require both test results and argumentation to
demonstrate how well the attributed is delivered.
Summarise test plans and test results in the report. Provide links to any test plans, scripts or code in
your repository. Where feasible, tests should be automated. Describe how to run the tests. Ideally, you
should use GitHub Actions3 to run tests and potentially deploy artefacts.
Your report should end with a reflection that summarises what you have learnt from designing and
implementing this project. It should include descriptions of what you would do differently, after the expe-
rience of implementing the project. Describe potential benefits or improvements that may be delivered
by applying the lessons you have learnt during the project. You will not lose marks for identifying problems
with your architecture or software design.
--->

# UniBasement

## Abstract

The purpose of this report is to document the various design decision made throughout the completion of the project. To begin, changes made to the project from what was outlined in the project proposal will be described and justified. Secondly, the types of architectures that were considered for the implementation of the project will be outlined alongside their pros and cons followed by the MVP's chosen software architecture being described in detail. Thirdly, the trade-offs that were made when designing the architecture will be justified. Fourthly, there will be a critique of the architecture implementation and how well it delivers the project. Fifthly, the report will contain an evaluation that summarises the testing results and justifies how well the software achieves its quality attributes. Finally, there will be a reflection on the lessons learnt throughout the project and if were able to start from the beginning what we would do differently.

## Changes

Throughout the project there were required changes compared to what was outlined in the proposal due to limitations in time as well as to better adhere to the quality attributes we aimed to achieve. 

#### Accounts

In the project proposal it was outlined that the users should be able to create an account and register their university affiliation. However, due to time constraints we were forced to cut out the university affiliation and centre the project around University of Queensland students.

The team had also realised that the allowing users to sign up would require us to handle the variety of security risks it would introduce such as storing user login data. Therefore, we decided to use AUTH0 to handle the login using external accounts such as Gmail or GitHub. This however, had the unintended affect that it removed our ability to allow users to update the account information or profile picture as that it was handled by AUTH0. The decision to use AUTH0 was made after careful consideration of its security practices and its effect on the project.

#### Courses

The project proposal also outlined that users should be able to create new courses and update that information. Due to the time restrictions and complexity this functionality would have caused we very quickly decided to not include this feature in our MVP. This decision also led to us only adding a few courses to our website to demonstrate the rest of the project’s functionality. This cutting of the scope allowed us to refocus our efforts on enabling the user to filter/ search courses and pin their favourite courses. We also used the extra resources to expand the scope and allow users to rate a course.

#### Exams

We weren't able to fully implement the exam functionality. We were able have to implement functionality to allow users to add new questions to an exam. (TODO Maybe not the case anymore)

## Architecture Options

There were a few architectures that were considered when planning on how to tackle this project. The first architecture that we considered was a micro-services architecture, the allure of this architecture was the partitioning of services to achieve modularisation ensuring that each service is independent of each other. The partitioning of services would have also enabled our team to develop in our most comfortable languages. Each service could be written with a different coding language eliminating the need for a few developers to learn a new language / technology. The improved fault isolation would have also been a benefit as if there were to be an issue in one service it would not affect the other services. Finally, although scalability was not one of the primary quality attributes, the microservices architecture would have allowed us to scale each service independently as demand increased or decreased.

There were also some downsides that were discovered when evaluating if the microservices architecture was the right fit for our project. The overall complexity of our project would have increased as we would have needed to handle the communication between services and then would have to deal with the latency of our API calls increasing. Secondly, deploying our application to Amazon Web Services (AWS) would have increased as we would need to handle each service/ container deploying correctly. Finally, testing in a microservices architecture would require each dependent service to be confirmed working before having the tests run.

The other architecture that was considered was a Monolithic Architecture. The simplicity of development in this architecture was its main intriguing aspect, as it would have enabled us to quickly develop the project which was very important in our short timeframe. The second drawing point was ease of deployment, as the monolithic app would of been contained in one container there deployment and maintaining of the app would have been easy. Finally, a monolith would have made system and integration testing easier as the end-to-end tests would have run a single application which also leads to easier debugging.

However, there were a few downsides of using the Monolithic architecture which led us to not use it. Primarily, the larger our application grew the more complex it would become to understand. Adding or upgrading functionality would be become difficult as it might cause unexpected side effects. The coupling of services into a monolith would have led to greater dependency between different services making identifying the cause of issues much higher. Finally, to scale our application it would require the application replicated on multiple servers which would have increased costs compared to other architectures.

## Architecture

The architecture we decided on implementing for our project was the Layered Architecture. Our implementation of the Layered Architecture had codebase split into four layers, presentation, buisness, persistence and database layers. For our presentation layer we used a combination of next.js alongside tailwind for styling. We had chosen next.js due to its ease of development and deployment. Our business layer was implemented in node.js and used an ORM to enable easy database querying which is also our persistence layer. While our database layer was a Postrgres database, our use of an ORM enabled us to swap databases if neccessary later down the project.

## Trade-Offs

## Critique

- layered architecture doesn't have the best maintainability because of the how layer being grouped together

## Evaluation

### Testing

The repo features 3 types of tests.

1. Basic unit testing
2. Integration testing - backend
3. Integration testing - frontend

The basic unit testing only checks functionality with no database connection. The integration testing checks the backend and frontend functionality with a database connection. The integration tests also verify changes made by directly communicating with the database. The tests are run in the GitHub Actions on every push or PR to the main branch. The tests are run in parallel to speed up the process. They can also be manually run by clicking the workflow tests and selecting which branch to run the tests on. This will run both the integration and unit tests.

#### Basic Unit Testing

The repo has a set of very basic unit tests which realistically only tests the backend compiles. This is because the majority of the functions within the backend rely on a database connection and cannot be tested through basic unit testing. The unit tests test functions such as "nest" that do not need a backend. These tests can be found inside "/backend/__tests__" in a file named "backend.test.jest". Functions created which do not rely on a database connection should be tested inside this file.
These tests are made using Jest and can be run using the command `npm test` from inside the backend directory.
To add a new test, create a new test function inside the "backend.test.jest" file. Each function should only test one function. Ensure groups of tests are grouped together inside a describe block. This block represents the function being tested. Inside the describe block each test block is a test for the function. Try and keep tests simple and only test one thing at a time.

#### Integration Testing

The repo features fully functioning integration tests which is capable of testing both the frontend and the backend. These tests utilise Python Unittest and is designed to be fully maintainable and accurate. They can be found inside the integration_tests folder and are separated into frontend and backend folders. Each folder contains files prefixed with test_ which is followed by an identifier for the specific test type. The tests are designed to test the backend fully and covers every route and cases within the route. The tests are designed to be easily readable and extendable with new tests. Tests for the backend are divided into different files based on the route they are testing. The tests which cover base functionality (all tests excluding FullSuite) verify the Db before executing the route. Then it sends the request, verifies the response and response code and finally verifies the changes made in the database. By integrating the tests with the database, we are able to verify the changes and ensure it's success. The FullSuite tests are designed to test the backend in more real world scenarios and ensures the backend is functioning as expected. To do this we make multiple requests within a test and verify the responses and changes made in the database. he tests work by spinning up 3 containers (backend, database and the container running the tests). These containers are defined inside the "docker-compose.yml" file located inside the "integration_tests" directory. The tests can be run locally or in the GitHub Actions. Currently they are set to run in the GitHub Actions on every push or PR to the main branch. However, developers can manually run it as well by selecting run workflow and selecting the branch they want tested. Another important note is that the database must be cleared to ensure that no persistent data is left over. This is automated as part of the test.sh script. When the tests are run at the end it provides a short overview on how many tests passed and failed. To find more details about the test that failed scroll up until you find the test that failed and it will provide more information on why it failed. All tests (excluding the Full Suite testing) are designed to have a few asserts and to verify the function is working as expected. Each function currently has success tests which ensure normal functionality. As part of the integration tests a frontend test suite has also been made using playwright. These tests can be found inside integration_tests/frontend. These tests verify the frontend is working as expected. Although these are not comprehensive it does provide a good starting point for testing the frontend. The tests can be run by executing tests.sh inside integration_tests. To find more information specific to adding tests or maintaining the tests please refer to the docs/TESTS.md.

### Quality Attributes
#### Availability


#### Reliability
There were numerous techniques employed to achieve the high level of reliability that we had set at project conception. In the project proposal it was outlined to achieve the necessary level of reliability, the project should have unit tests that thoroughly covers the core functionality of the system. These tests should ensure that the system maintains expected behaviour. We used test driven development to implement the unit and integration tests that cover the entire functionality of our application and previously mentioned in the testing section. These tests are then used in a GitHub workflow to ensure that every time a code change is pushed to main the tests run to ensure the core functionality works before the code reaches main.  

Secondly, by deploying our application to Amazon Web Services, we remove the necessity to ensure the webservers running our application are working correctly. Through the shared responsibility model AWS is responsible for the infrastructure such as the hardware, software and networking that run AWS Cloud services. We then using terraform ensure the containers we deploy are reliable on AWS.

#### Maintainability
Maintainability has been achieved primarily by the abstraction of code and layers. In the backend we have separated the functionality behind the endpoints in their own files and services to allow for easier maintainability. This also allows us to easily improve our architecture in the future by converting to a microservices architecture for better maintainability. We also use docker and containerization to separate the frontend, backend and database into three independent containers that communicate with each other through highly [documented](../docs/HANDSHAKE.md) API calls over HTTPS. This level of separation allows for ease of use and ease of access as each container has vastly different responsibilities. 

We also made the effort to use the same programming language for both the front and backend. This acts as a redundancy that even if our documentation is unable to effectively communicate our decisions or is no longer update, the developer should be easily able to read the codebase and understand the importance and inner working of each component of the system.


## Reflection

## References

https://cloudacademy.com/blog/microservices-architecture-challenge-advantage-drawback/
