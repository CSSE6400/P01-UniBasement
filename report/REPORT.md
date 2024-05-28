# UniBasement

## Abstract

# TODO I think this is wrong, and more so summarises the spec for the report and not our report
The purpose of this report is to document the various design decision made throughout the completion of the project. To begin, changes made to the project from what was outlined in the project proposal will be described and justified. Secondly, the types of architectures that were considered for the implementation of the project will be outlined alongside their pros and cons followed by the MVP's chosen software architecture being described in detail. Thirdly, the trade-offs that were made when designing the architecture will be justified. Fourthly, there will be a critique of the architecture implementation and how well it delivers the project. Fifthly, the report will contain an evaluation that summarises the testing results and justifies how well the software achieves its quality attributes. Finally, there will be a reflection on the lessons learnt throughout the project and if were able to start from the beginning what we would do differently.
# New Abstract?
The purpose of this report is to discuss the changes made throughout the creation of UniBasement due to the need to adhere to quality attibutes and time constraints. Initially, the goal was to allow users to create and tailor the account to a specific university but we pivitoed to focusing on the University of Queensland due to time limitations. To deal with secuirt risks associated with user sign-ups, AUTH0 was used for login via external accounts like Gmail or GitHub which limited the ability to customise accounts. 

The report then highlights how the team came to the conclusion to revise the success criteria to make it more defined and testable. For example, the proposal specified that the uptime was to be 99% over a 1-day span under some load which was then clarified to mean that 100% of the backend functions should have the main usage tested, with more than 50% of sub-cases also tested. 

The report then includes the considerations made of different architectures to implement UniBasement, including microservices, monolithic and the chosen layered architecture. Comparing and contrasting the advantages, disadvantages and suitability for the project. Finally, the reports then evaluates the layered architecture and how well it achieves the quality attributes in the proposal. 

## Changes

Throughout the project there were required changes compared to what was outlined in the proposal due to limitations in time as well as to better adhere to the quality attributes we aimed to achieve. 

### Accounts

In the project proposal it was outlined that the users should be able to create an account and register their university affiliation. However, due to time constraints we were forced to cut out the university affiliation and centre the project around University of Queensland students.

The team had also realised that the allowing users to sign up would require us to handle the variety of security risks it would introduce such as storing user login data. Therefore, we decided to use AUTH0 to handle the login using external accounts such as Gmail or GitHub. This however, had the unintended affect that it removed our ability to allow users to update the account information or profile picture as that it was handled by AUTH0. The decision to use AUTH0 was made after careful consideration of its security practices and its effect on the project, and is detailed further in [ADR001](../model/adrs/ADR001_AUTHENTICATION.md).

### Succes criteria

All of the functional requirements outlined in the proposal were, in their current state, untestable and questionable in quality. For example, "Over 99% uptime over a measured period", so if we run it for a second and it doesn't die is it okay? "All core functionality tested", but what is described as 'core'? From this we changed some of the succes criteria to be better defined and easily testable.  

| Old | New |
|-------|---------|
| Over 99% uptime over a measured period | Over 99% uptime over a 1 day span under some load (link k6 code if done here) |
| All core functionality tested   | 100% of backend functions should have their main uses tested (i.e. 200/201 response) and most ( >50%) sub cases. On top of this general automated frontend testing should be done to ensure their is a connection  |
| sum about maintain   | idk this shit is so dumb |    

## Architecture Options

There were a few architectures that were considered when planning on how to tackle this project. The first architecture that we considered was a micro-services architecture, the allure of this architecture was the partitioning of services to achieve modularisation ensuring that each service is independent of each other. The partitioning of services would have also enabled our team to develop in our most comfortable languages. Each service could be written with a different coding language eliminating the need for a few developers to learn a new language / technology. The improved fault isolation would have also been a benefit as if there were to be an issue in one service it would not affect the other services. Finally, although scalability was not one of the primary quality attributes, the microservices architecture would have allowed us to scale each service independently as demand increased or decreased.

There were also some downsides that were discovered when evaluating if the microservices architecture was the right fit for our project. The overall complexity of our project would have increased as we would have needed to handle the communication between services and then would have to deal with the latency of our API calls increasing. Secondly, deploying our application to Amazon Web Services (AWS) would have increased as we would need to handle each service/ container deploying correctly. Thirdly, testing in a microservices architecture would require each dependent service to be confirmed working before having the tests run. Finally, taking into account the scale of our project and the scope that we are aiming to deliver, the microservices architecture felt like overkill and with time constraints not that feasible to implement.

The other architecture that was considered was a Monolithic Architecture. The simplicity of development in this architecture was its main intriguing aspect, as it would have enabled us to quickly develop the project which was very important in our short timeframe. The second drawing point was ease of deployment, as the monolithic app would of been contained in one container there deployment and maintaining of the app would have been easy. Finally, a monolith would have made system and integration testing easier as the end-to-end tests would have run a single application which also leads to easier debugging.

However, there were a few downsides of using the Monolithic architecture which led us to not use it. Primarily, the larger our application grew the more complex it would become to understand. Adding or upgrading functionality would be become difficult as it might cause unexpected side effects. The coupling of services into a monolith would have led to greater dependency between different services making identifying the cause of issues much higher. Finally, to scale our application it would require the application replicated on multiple servers which would have increased costs compared to other architectures. Due to all these reasons we came to the conclusion that the Monolithic Architecture would not be suitable for our project as it does not aid in trying to achieve the quality attributes we had set.

## Architecture

<!-- if we mention stuff like "application logic, business rules, and  objectives" we should probably expand on what that is exactly in our app -->

To enable UniBasement to meet the described architecturally significant requirements, a layered architecture comprised of four layers was implemented. The highest layer was the Presentation Layer, which was comprised of our front-end, built with Next.js using Tailwind. These technologies were chosen as they are industry standard which enables easier contribution. Components within the front-end were designed to be generic and extensible where possible whilst maintaining a maximum of 300 lines to minimise complexity. Unit tests were implemented through the integration tests to ensure that functionality was as expected. The business layer was implemented to handle the application logic, business rules, and  objectives; it handles the logic and enables the functionality of the application. This was implemented within Node.js and tested through Jest which are both industry standard. The Persistence Layer manages requests and interacts with the database (DB). Through the use of TypeORM, the developer experience is enhanced whilst adding a protective barrier for the DB. By abstracting the database interactions, the DB technology is interchangerable and it also streamlines development. The DB Layer was implemented via PostgreSQL as it’s an industry-standard relational database management system (RDBMS). PostgreSQL ensures data security and provides robust features for managing data. However, because of the use of an ORM in the Persistence Layer, the DB Layer can easily be changed to any other RDBMS if necessary with little impact on development or the product.

![UniBasement Layered Architecture Implementation](./Images/Architecture.png)

UniBasement has been implemented in a manner to ensure that the architecturally significant requirements are achieved. A key focus is placed on the maintainability of the application through the use of industry wide technologies. This is evident through the implementation of actions running our unit tests, and providing documentation to ease the developer into the project. Additionally, reliability has been ensured through the implemention of thorough integration testing, the use of an ORM to provide abstraction which enables higher-level control of the DB, and through scaling of the application. The availability of the application is ensured through the deployment methodology. <!-- scaling is mentioned here but might be worth expanding on how that helps reliability vs scalability which isn't one of our QAs  -->

This architecture additionally, affected the design decisions regarding the implementation of UniBasement. To implement the layered architecture correctly, it was necessary to implement the layer isolation principle. This requires that the layers should not depend on implementation details of another layer (WEEK 1 LECTURE). Our implementation of UniBasement used this concept as we used layers of abstraction within the frontend and backend. Our use of TypeORM abstracted any implementation details for the database and our implementation of the frontend through our custom react hooks and http routing removes any implementation details of the backend. Additionally, our structure of the layers ensured that UniBasement would only communicate across layers through the neighbouring layers which maintains the Neighbour Communication Principle (WEEK 1 LECTURE). UniBasement, also, has a higher layer depend on a lower layer, and the layers only communicate through general interfaces, callbacks and events, thus, maintianing the downward dependency principle and the upward notification principle (WEEK 1 LECTURE). Finally, a layered architecture requires UniBasement to maintain the Sidecar Spanning Principle, but as no sidecar layer was implemented this did not affect the implementation details. The layered architecture affected the implementation details of UniBasement and all layered architecture principles were maintained.

## Trade-Offs

Through the choice of the layered architecture, it detremintally affected the scalability and integration testing. As UniBasement's implementation of the layered architecture relied on a monolithic backend, it naturally raises concerns regarding the scalability. When designing UniBasement, one of the primary concerns was the viability for the minimum viable product (MVP). Given that the deadline for the task was the limiting factor, it was important for the architecture to be simple, this came at the cost of scalability. A micro-services archiecture could have scaled much more effective as opposed to the monolithic backend that UniBasement uses.This naturally will affect the scalability and the reliability of the application. Another aspect of UniBasement that was affected by the architecture choice was the integration testing. Due to the multiple layers of the architecture, it increased the complexity of the integration tests created. This added additional complexity and time required to complete the integration test. Whilst this was not a major concern, as one of the primary objectives was to deliver a product within a short period of time, this was a concern that was considered whilst determining the architecture UniBasement used. A layered architecture had two identified specific tradeoffs, scalability and affect to integration tests for UniBasement.

## Critique
<!-- 
To accurate critique the developed architecture for UniBasement,  -->

- layered architecture doesn't have the best maintainability because of the how layer being grouped together

## Evaluation

### Testing

The repo features 3 types of tests to verify functionality and achieve the reliability QA.

1. Basic unit testing
2. Integration testing - persistence & database layers
3. End to end (e2e) testing - all application layers

The basic unit testing only checks functionality of data transformation functions within the backend with no reliance on a database or the backend server being spun up. It ensures that these functions correctly transform their input into an expected output. 

The integration testing checks the backend routing functionality with a database connection. These tests are made in pytest and are designed to be fully maintainable and complete in terms of coverage, with support to extend with new tests in the future. Tests are divided into different files based on the route they are testing to ensure maintainability. The tests which cover base functionality (all tests excluding full suite) verify the database before executing the route. Then they send the request, verify the response and response code, and finally verify the changes made by directly communicating with the database through SQLAlchemy reflection. By integrating the tests with the database, we are able to verify the changes made by the application and ensure its success in achieving functionality.

The full suite tests are designed to test the persistence and database layers in more real world scenarios and ensures the backend is functioning as expected. Specifically, it ensures that executing typical user request scenarios one after the other will not break the data or its persistence. At every step in the scenario, the database state is verified to ensure expected functionality.

The e2e testing is written in playwright and is designed to cover all elements of the layered architecture, including any functionality provided by external dependencies such as Auth0. It requires the development application to be running (i.e. frontend, backend & database), and tests all the core functionality users would be interacting with. This includes logging in and out as both an admin or regular user role, adding courses or exams as an admin, viewing courses and exams, adding questions, and adding and interacting with comments. 

The tests are designed to be easily run by developers either locally or through automated workflows. They work by spinning up 3 containers (backend, database and the container running the tests). These containers are defined inside the "docker-compose.yml" file located inside the "integration_tests" directory. Currently, they are set to run in the GitHub Actions on every push or PR to the main branch. However, developers can manually run the action as well by selecting run workflow and selecting the branch they want tested. The tests in GitHub Actions are run in parallel to speed up the process. Another important note is that the database must be cleared to ensure that no persistent data is left over between test runs. This is automated as part of the `test.sh` script inside the integration test folder. When the tests are run, at the end it provides a short overview on how many tests passed and failed. 

The full e2e test currently can only be run locally due to its reliance on Auth0. Since we do not have access to repository secrets, there is no secure way of storing the necessary Auth0 credentials. They have therefore been excluded from the test Dockerfile and must be run manually using `pytest frontend/test_full_e2e.py` once a development application environement is running. Ideally, once Auth0 credentials can be placed in a GitHub secret and the e2e test added back to the Actions workflow, a PlayWright video artefact could also be saved on workflow run completion in order to view the outcomes of the e2e testing.

More detailed documentation on testing including how to extend the test suites can be found in [TESTS.md](../docs/TESTS.md).

### Quality Attributes

#### Availability

In order to enhance the availability of our software, we utilized tools from Amazon Web Services (AWS) and leveraged the benefits of a Layered Architecture. To manage website traffic, we implemented a load balancer to improve fault tolerance. This load balancer can automatically detect server issues and reroute traffic to operational servers. Furthermore, we used Terraform <!-- im not sure how terraform relates to availability here, might be better off talking about terraform in maintainability? and keeping the talk here about the actual aws setup relating to availability instead. idk --> to configure our application to dynamically scale resources based on load, effectively handling peak usage times. Using autoscaling groups we ensure that a minimum of 1 service is always running for both the frontend and backend. If an error were to occur and a service to go down, the autoscaling group can recover the service. The Layered Architecture plays a crucial role in fault isolation, allowing us to address and resolve issues in one layer without disrupting the others. 

To ensure the robustness of our website, we conducted rigorous testing. This approach ensures that any potential issues are identified and rectified promptly, thereby maintaining the website’s availability. Finally, we deployed the website over a 1 hour period and simulated a expected load and the website did not run into issues or downtime. To test the availability of our system we ran simulated tests were certain containers were killed. We tested the systems availability and ability to recover from this and still maintain functionality. From our tests that we conducted where we deliberately killed both the frontend and backend containers we found that the system was able to recover and maintain functionality. The test plan showing the steps taken and the result are documented and can be found in [MANUAL.md](../docs/MANUAL.md). 

Isolation of services - by using a layered architecture and load balancers between the user-> frontend and frontend -> backend we have fault containment. Each layer is only responsible for a specific aspect of the application, if an issue occurs at one layer it can be contained and recoverable from. For example an issue with the backend resulting in the service dying is recoverable, as the AWS autoscaling group will recover the service with a new one. By using a load balancer between the frontend -> backend the frontend can continue to forward traffic to the same load balancer. Although some requests will be lost while the backend is being spun up, the use of a LB allows us to not have to pass the frontend a new link to the backend. 

One critique of our implementation is our lack of database replication, this has resulted in our DB being a single point of failure. Unfortunately due to time constraints we were unable to implement this and a load balancer in front of the db. Another benefit of our architecture is the replaceability of components. Specific layers can be replaced or upgraded independently.

# TODO MIGHT NEED TO BE REARRANGE better
In terms of the outlined succes criteria from the proposal, and the ones we redfined in an [eariler section](#Changes) we passed the tests extremely well, we set up a [basic k6 testing script](https://github.com/JTrenerry/UniBasement-Avaliability-Tests) that would run every 5 minutes for a day, and all requests sent were recieved and processed successfully. Full logs can be seen [here](https://github.com/JTrenerry/UniBasement-Avaliability-Tests/blob/main/log.txt)

#### Reliability

There were numerous techniques employed to achieve the high level of reliability that we had set at project conception. In the project proposal it was outlined to achieve the necessary level of reliability, the project should have unit tests that thoroughly covers the core functionality of the system. These tests should ensure that the system maintains expected behaviour. We used test driven development to implement the unit and integration tests that cover the entire functionality of our application as previously mentioned in the testing section. These tests are then used in a GitHub workflow to ensure that every time the code changes, the core functionality works before the changes reach main. 

The availability of developer tools for deployment, teardown, redeployment and tests enhances the developer experience when verifying the reliability of our application. The workflow for tests can be run on any branch and they are also able to be run locally or through the GitHub Actions. More information on the testing and deployment setups is available in the documentation in [TESTS.md](../docs/TESTS.md) and [DEPLOY_TEARDOWN.md](../docs/DEPLOY_TEARDOWN.md). Actual results for the tests can be viewed in GitHub Actions by selecting the Test workflow. Here you can see both the unit and integration tests being run on and the results of these. The integration tests cover every route, every possible response, every possible response code, and validate the database for changes. The benefit of a layered architecture here allows us to connect the test container directly to the persistence and database layers and allows us to validate the state of the database after every call to the backend. Employing full e2e testing as well means typical user scenarios are fully covered. 

By deploying our application to Amazon Web Services, we remove the necessity to ensure the webservers running our application are working correctly. Through the shared responsibility model, AWS is responsible for the infrastructure such as the hardware, software and networking that run AWS Cloud services. We then use terraform to ensure the containers we deploy are reliable on AWS. 

Since we have tested all normal / base cases and a large majority of side cases, we successfully passed the outlined [success criteria](#Changes) in the sections above. This helps gurantee that all code will function under almost all circumstances.

#### Maintainability

Maintainability has been achieved primarily by the abstraction of code and layers. In the backend we have separated the functionality behind the endpoints in their own files and services to allow for easier maintainability. This also allows us to easily improve our architecture in the future by converting to a microservices architecture for better long-term maintainability. We also use docker and containerization to separate the frontend, backend and database into three independent containers that communicate with each other through highly documented API calls over HTTPS, as seen in the documentation in [API.md](../docs/API.md). This level of separation allows for ease of use and ease of access as each container has vastly different responsibilities.

We also made the effort to use the same programming language for both the frontend and backend. This acts as a redundancy that even if our documentation is unable to effectively communicate our decisions or is no longer update, the developer should be easily able to read the codebase and understand the importance and inner working of each component of the system. Using typescript as the chosen language also allows the sharing of types between the frontend and backend, which minimises errors in communication between the two layers.

<!-- todo: expand on these
- talk more about the documentation we have in docs folder
- using docker for dev environment setups + having a bunch of scripts? -->

#### Security

The software effectively achieves its desired quality attributes, particularly in terms of security, through the combined benefits of a layered architecture and strategic decisions made by the developers. The layered architecture inherently provides isolation, which means that if one layer is compromised, the other layers remain unaffected. This architecture also offers flexibility, allowing us to enforce separate security policies for each layer, thereby reducing the risk of unauthorized access that could compromise the system or data.

In addition to the aforementioned security measures, we have implemented an extra layer of protection specifically for requests related to the creation of courses and exams. This additional security layer restricts access exclusively to users with administrator roles, further bolstering the robustness of our system’s security.

## Reflection

Recognizing the complexity of this project, our team made a strategic decision to initiate the process as early as possible. We quickly grasped the magnitude of the task at hand, understanding that each component carried a different weight, with the report and video taking precedence. During the planning phase, we envisioned a more feature-rich product, but had to scale back due to the project’s demanding nature.

Our experience exposed us to various architectural frameworks, their impact on development, and the time investment they require. If given another opportunity, we would prioritize the use of software development methodologies such as Agile and User Stories. This approach would enhance our project management, potentially allowing for the inclusion of additional features.

Furthermore, we would consider implementing the project using a Microservices architecture. This would align more closely with the quality attributes we initially set, thereby improving the overall project outcome.

## References

https://cloudacademy.com/blog/microservices-architecture-challenge-advantage-drawback/
https://aws.amazon.com/what-is/load-balancing/#:~:text=Load%20balancers%20improve%20application%20performance,closer%20server%20to%20reduce%20latency
