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
    examyear: Integer - The year the exam took place i.e. 2023
    examsemester: Interger [1 - 3] - First = 1, Second = 2, Summer = 3 i.e. 2
    examtype: String - The type of the exam i.e. Midterm
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
  examyear: Integer - The year the exam took place i.e. 2023
  examsemester: Interger [1 - 3] - First = 1, Second = 2, Summer = 3 i.e. 2
  examtype: String - The type of the exam i.e. Midterm
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
    questionid: Integer - The id for the question, used for database i.e. 1
    questiontext: String - The year the exam took place i.e. What is 2 + 2 in Python3
    questiontype: String - The type of the exam i.e. Multiple Choice
    questionpng: BYTEA - A picture of the exam question
  }
]
```

# /questions/:questionid
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
  questionid: Integer - The id for the question, used for database i.e. 1
  questiontext: String - The year the exam took place i.e. What is 2 + 2 in Python3
  questiontype: String - The type of the exam i.e. Multiple Choice
  questionpng: BYTEA - A picture of the exam question
}
```

# /questions/:questionid/comments
### Path params:
| Name | Description |
|----|----|
| questionid | Integer - The question id REQUIRED |
### Query params:
None
### Responses
200 - List all exam information for one course as well as the course informatiom
```
[
  {
    commentId: Integer - The id for the comment, used for database i.e. 1
    parentCommentId - The id for the parent comment used for replies, null if no parent i.e. 1
    commenttext: String - The year the exam took place i.e. What is 2 + 2 in Python3
    commentpng: BYTEA - A picture of the exam question
    iscorrect: boolean - Is the comment correct i.e. true
    isendoresed: boolean - Is the comment endorsed i.e. false
    upvotes: Integer - How many upvotes does the comment have i.e. 3
    downvotes: Integer - How many downvotes does the comment have i.e. 2
    createdAt: timestamp - When the comment was made
    updatedAt: timestamp - When the comment was last edited or updated
  }
]
```

# /comments/:commentId
### Description

### Path params:
| Name | Description |
|----|----|
| commentId | Integer - The question id REQUIRED |
### Query params:
None
### Responses
200 - List all exam information for one course as well as the course informatiom
```
{
  commentId: Integer - The id for the comment, used for database i.e. 1
  parentCommentId - The id for the parent comment used for replies, null if no parent i.e. 1
  commenttext: String - The year the exam took place i.e. What is 2 + 2 in Python3
  commentpng: BYTEA - A picture of the exam question
  iscorrect: boolean - Is the comment correct i.e. true
  isendoresed: boolean - Is the comment endorsed i.e. false
  upvotes: Integer - How many upvotes does the comment have i.e. 3
  downvotes: Integer - How many downvotes does the comment have i.e. 2
  createdAt: timestamp - When the comment was made
  updatedAt: timestamp - When the comment was last edited or updated
}
```
