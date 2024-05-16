# /courses GET
### Description
Gets all courses from the database
### Path params:   
None   
### Query params:
| Name | Description |
|----|----|
| limit | Integer - Returns only this many results 0 < limit <= 1000. Default is 100. |
| offset | Integer - Skip this many results before returning 0 <= offset. Default is 0 |
### Responses
200 - List of all emails with filters applied.
```
[
  {
    courseCode: String (will always be 8 characters) - The code of the course i.e. CSSE6400
    courseName: String - The name of the course i.e. Software Architecture
    courseDescription: String - A description of the course i.e. The best course ever
  }
]
```

# /courses/:courseCode GET
### Description
Gets the course information for a course
### Path params:
| Name | Description |
|----|----|
| courseCode | String (should be 8 characters) REQUIRED |
### Query params:
None
### Responses
200 - List all exam information for one course as well as the course informatiom
```
{
  courseName: String - The name of the course i.e. Software Architecture
  courseDescription: String - A description of the course i.e. The best course ever
}

```

# /courses/:courseCode/exams GET
### Description
Returns all exams from a course code
### Path params:
| Name | Description |
|----|----|
| courseCode | String (should be 8 characters) REQUIRED |
### Query params:
None
### Responses
200 - List all exam information for one course as well as the course informatiom
```
[
  {
    examId: Integer - The id for the exam, used for database i.e. 1
    examYear: Integer - The year the exam took place i.e. 2023
    examSemester: Interger [1 - 3] - First = 1, Second = 2, Summer = 3 i.e. 2
    examType: String - The type of the exam i.e. Midterm
  }
]

```

# /exams/:examId GET
### Description
Gets the exam information from an exam id
### Path params:
| Name | Description |
|----|----|
| examId | Integer - The exam id REQUIRED |
### Query params:
None
### Responses
200 - List all exam information for one course as well as the course informatiom
```
{
  examId: Integer - The id for the exam, used for database i.e. 1
  examYear: Integer - The year the exam took place i.e. 2023
  examSemester: Interger [1 - 3] - First = 1, Second = 2, Summer = 3 i.e. 2
  examType: String - The type of the exam i.e. Midterm
}
```

# /exams/:examId/questions GET
### Description
Gets the questions from an exam id
### Path params:
| Name | Description |
|----|----|
| examId | Integer - The exam id REQUIRED |
### Query params:
None
### Responses
200 - List all exam information for one course as well as the course informatiom
```
[
  {
    questionId: Integer - The id for the question, used for database i.e. 1
    questionText: String - The year the exam took place i.e. What is 2 + 2 in Python3
    questionType: String - The type of the exam i.e. Multiple Choice
    questionPNG: String - A url to an image associated with the question
  }
]
```

# /questions/:questionid GET
### Path params:
| Name | Description |
|----|----|
| questionid | Integer - The question id REQUIRED |
### Query params:
None
### Responses
200 - List all exam information for one course as well as the course informatiom
```
{
  questionId: Integer - The id for the question, used for database i.e. 1
  questionText: String - The year the exam took place i.e. What is 2 + 2 in Python3
  questionType: String - The type of the exam i.e. Multiple Choice
  questionPNG: String - A url to an image associated with the question
}
```

# /questions/:questionid/comments?userId=\<userId\> GET
### Path params:
| Name       | Description |
|------------|----|
| questionId | Integer - The question id REQUIRED |
### Query params:
userId - the user id for which to check upvotes and downvotes for
### Responses
200 - List all exam information for one course as well as the course informatiom
```
[
  {
    commentId: Integer - The id for the comment, used for database i.e. 1
    parentCommentId - The id for the parent comment used for replies, null if no parent i.e. 1
    commentText: String - The year the exam took place i.e. What is 2 + 2 in Python3
    commentPNG: String - A url to an image associated with the comment
    isCorrect: boolean - Is the comment correct i.e. true
    isEndoresed: boolean - Is the comment endorsed i.e. false
    upvotes: Integer - How many upvotes does the comment have i.e. 3
    downvotes: Integer - How many downvotes does the comment have i.e. 2
    createdAt: timestamp - When the comment was made
    updatedAt: timestamp - When the comment was last edited or updated
    upvoted: Boolean - If the user has upvoted that comment
    downvoted: Boolean - If the user has downvoted that comment
  }
]
```

# /comments/:commentId GET
### Description

### Path params:
| Name | Description |
|----|----|
| commentId | Integer - The question id REQUIRED |
### Query params:
None
### Body params:
None
### Responses
200 - List all exam information for one course as well as the course informatiom
```
{
  commentId: Integer - The id for the comment, used for database i.e. 1
  parentCommentId - The id for the parent comment used for replies, null if no parent i.e. 1
  commentText: String - The year the exam took place i.e. What is 2 + 2 in Python3
  commentPNG: String - A url to an image associated with the comment
  isCorrect: boolean - Is the comment correct i.e. true
  isEndoresed: boolean - Is the comment endorsed i.e. false
  upvotes: Integer - How many upvotes does the comment have i.e. 3
  downvotes: Integer - How many downvotes does the comment have i.e. 2
  createdAt: timestamp - When the comment was made
  updatedAt: timestamp - When the comment was last edited or updated
}
```


# /comments/:commentId/edit PUT
### Description
Edits a comment
### Path params: 
| Name | Description |
|----|----|
| commentId | Integer - The comment's id REQUIRED |
### Query params:
None
### Multi-part form data:
| Name | Description                                 |
|----|---------------------------------------------|
| commentPNG | Binary - The comment's picture      |
| commentText | String - The comment's text         |
| userId | String - The user id to check auth REQUIRED |
### Responses
200

# /question/:questionId/edit PATCH
### Description
Edits a question
### Path params: 
| Name | Description |
|----|----|
| questionId | Integer - The question's id REQUIRED |
### Query params:
None
### Multi-part form data:
| Name | Description |
|----|----|
| questionPNG | Binary - The question's picture  |
| questionText | String - The question's text  |
| questionType | String - The type of question i.e. multiple choice  |
| userId | String - The user id to check auth REQUIRED |
### Responses
200

# /exam POST
### Description
Makes a new exam in the database
### Path params: 
None
### Query params:
None
### Body params:
| Name | Description |
|----|----|
| examYear | Integer - The year that the exam happened REQUIRED |
| examSemester | Integer - The semeester that the exam REQUIRED |
| examType | String - The type of exam i.e. midstem REQUIRED |
| courseCode | String - The course code of the course REQUIRED 8 characters max |
### Responses
201 - with the exam id

# /question POST
### Description
Makes a new question in the database
### Path params: 
None
### Query params:
None
### Multi-part form data:
| Name | Description                                                       |
|----|-------------------------------------------------------------------|
| questionPNG | Binary - The question's picture                           |
| questionText | String - The question's text                              |
| questionType | String - The type of question i.e. multiple choice REQUIRED       |
| examId | Integer - The course code of the course REQUIRED 8 characters max |
### Responses
201 - with the exam id
