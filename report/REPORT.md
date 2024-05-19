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

## Evaluation
### Testing

### Quality Attributes
#### Availability

#### Reliability

#### Maintainability
The core functionality of UniBasement and the way it has been designed, allows for future use with minimal maintenance needed.  
  
For example, adding new courses and/or exams is not something done with code, and as such can be done by someone with no technical understanding of the underlying system. This abstracts the course/exam maintenance off the developers and to the students/admins leaving just new features and bug fixing to developers.  
  
The containerization of UniBasement allows for two different code bases / containers, that communicate to each other with highly [documented](../docs/HANDSHAKE.md) API calls. This not only allows for ease of use, but a way to understand what is expected on either end without having to search through the entire code base. Another key factor to consider is that both the front-end and the back-end is written in the same language, which if the documentation fails (not able to communicate effectively) or is no longer up to date, the developer should be able to understand each component of the system.


## Reflection

## References
https://cloudacademy.com/blog/microservices-architecture-challenge-advantage-drawback/
