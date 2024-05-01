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

## Changes to propsal

## Architecture Options

## Architecture

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
