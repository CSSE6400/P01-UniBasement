# TODO

# Courses
| Name | Type | Description | other |
|----|----|----|----|
| courseCode | VARCHAR(8) | The Course Code for a course i.e. CSSE6400 | key |
| courseName | meow | The name of the course i.e. Software Architecture | None |
| courseDescription | meow | A description for the course | None |

# Exams
| Name | Type | Description | other |
|----|----|----|----|
| coursecode | VARCHAR(8) | The Course Code for a course i.e. CSSE6400 | reference to courses table |
| examId | Serial | Just the id for the database | key |

# Questions
| Name | Type | Description | other |
|----|----|----|----|
| examId | Serial | Just the id for the exams database | reference to the exams table |
| questionId | Serial | Just the id for the database | key |

# Comments
| Name | Type | Description | other |
|----|----|----|----|
| questionId | Serial | Just the id for the questions database | reference to the questions table |
| commentId | Serial | Just the id for the database | key |
