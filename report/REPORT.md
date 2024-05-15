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
The purpose of this report is to document the various design decision made throughout the completion of the project. To begin, changes made to the project from what was outlined in the project proposal will be described and justified. Secondly, the types of architectures that were considered for the implementation of the project will be outlined alongside their pros and cons followed by the MVP's chosen software architecture being described in detail. Thirdly, the trade-offs that were made when designing the architecture will be justified. Fourthly, there will be a critique of the architecutres implementation and how well it delivers the project. Fithly, the report will contain a evaluation that summarises the testing results and justifies how well the software achieves its quality attributes. Finally, there will be a reflection on the lessons learnt throughout the project and if were able to start from the begining what we would do differenlty. 

## Changes
Throughout the project there were required changes compared to what was outlined in the proposal due to limitations in time as well as to better adhere to the quality attributes we aimed to achieve. 

#### Accounts 
In the project proposal it was outlined that the users should be able to create an account and register there university affiliation. However, due to time constraints we were forced to cut out university affiliation and centre the project around University of Queensland students.

The team had also realised that the allowing users to sign up would require us to handle the variety of security risks it would introduce such as storing user login data. Therefore, we decided to use AUTH0 to handle the login using external accounts such as gmail or github. This however, had the unintended affect that it removed our ability to allow users to update the account information or profile picture as that is decided by AUTH0. 



Initially, we wanted users to sign up for their account. However, this would require us to take into account the various secuirty risks that comes with storing user data, especially user passwords. Instead of having to implement a hashing system to safely secure the users passwords we decided to use AUTH0 as this would allow them to log in with their external accounts such as gmail or github and would make us not liable to the security risks. We didn't just use AUTH0 blindly, beleiving it to be the miracle solution to our problem but did a deep dive analysis into AUTH0 to ensure that it handled the data security properly and helped us achieve the quality attributes we set. 

Using AUTH0 however, removed our ability to update the users profile information as that was passed onto whatever account the user used to login. 


#### Courses 



## Changes to propsal
NEEDS TO BE WRITTERN PROPERLY (dot points probs ok but should be expanded upon)
#### Account
- Users do not make accounts nor do they register with an institution, they instead use AUTH0 to sign in with a different login (taking security risks off of us to an extent),
- They also then do not really have the ability to update information or profile pictures without changing their original account
#### Courses
- Users should not be able to edit courses information due to changes of correct information to incorrect or malicious information being a key factor in designing the software
#### Exams
- Users should not be able to edit exams information due to changes of correct information to incorrect or malicious information being a key factor in designing the software
#### Scope
- No real changes to scope, we do add alot more than 'some units' though
#### Maintability
- Was expanded to be more than just having documentation and github actions, from things like listed ADRs (so people can understand why we did what we did) to decisions that were purely made for readability and maintainability reasons.
## Architecture Options

## Architecture
The architecture we decided upon was a 3-Layered Architecture, as it nicely seperates the code into three blocks, presentation, business and persistence. 

## Trade-Offs

## Critique

## Evaluation
### Testing

### Quality Attributes
#### Availability

#### Reliability

#### Maintainability
The core functionality of UniBasement and the way it has been designed, allows for future use with minimal maintenance needed.  
  
For example, adding new courses and/or exams is not something done with code, and as such can be done by someone with no techincal understanding of the underlying system. This abstracts the course/exam mantenance off the deveolpers and to the students/admins leaving just new features and bug fixing to deveolpers.  
  
The containerazation of UniBasement allows for two different code bases / containers, that communicate to each other with highly [documented](../docs/HANDSHAKE.md) API calls. This not only allows for ease of use, but a way to understand what is expected on either end without having to search through the entire code base. Another key factor to consider is that both the front-end and the back-end is writtern in the same language, which if the documentation fails (not able to communicate effectively) or is no longer up to date, the developer should be able to understand each component of the system.


## Reflection
