# UniBasement
## [Report](report/REPORT.md) | [Video](https://drive.google.com/file/d/1eASH7J1LxkCDNZz9AwSx5kaf98NkxLsV/view?usp=sharing) | [Proposal](https://csse6400.github.io/project-proposal-2024/s4702098/proposal.html) | [Architecture](model/ARCHITECTURE.md) | [API](docs/API.md) | [Database](docs/DATABASE.md) | [AI](AI.md) | [Tests](docs/TESTS.MD)

## Description

UniBasement is designed to empower students to understand the concepts more deeply, at the forefront of the platform is the desire to enable students to have a deeper understanding of the content they are taught and to work with their peers to develop their collective knowledge. Within the modern world, studying is more than ever stressful and makes students anxious, easy access to materials to enable students to study more effectively is essential and UniBasement intends to make studying for final exams an easier affair.  

## What Does UniBasement Do?

UniBasement transforms the way students prepare for exams. It allows students to post answers to past exam questions, fostering a community-driven learning environment. Other users can upvote or downvote these answers, ensuring the most accurate and helpful responses rise to the top. This interactive approach makes studying more efficient and promotes a deeper understanding of the subject matter. With UniBasement, exam preparation becomes a less daunting and more collaborative process.

## Authors

This project is brought to you by the Evan Hughes FanClub. Our team consists of:

### Frontend

- [Olivia Ronda](https://github.com/vilnor)
- [Pramith Kodalli](https://github.com/PramithKodali)
- [Tristan Duncombe](https://github.com/tristanduncombe)

### Backend

- [Jackson Trenerry](https://github.com/JTrenerry)
- [Olivia Ronda](https://github.com/vilnor)

### QA

- [Shanon Lakshan Chandrasekara](https://github.com/86LAK)

### DevOps

- [Shanon Lakshan Chandrasekara](https://github.com/86LAK)
- [Olivia Ronda](https://github.com/vilnor)

### QUT Guy Who Has Vanished!

- [Ibrahim Cassim](https://github.com/IbrahimCassim)

## Local Development

A local version of the application can be spun up using Docker, or alternatively by spinning up the database, backend and frontend separately as detailed in their respective READMEs.  

To use Docker, navigate to the root directory and run the following command:

```bash
./local.sh
```

The frontend application will then be available at `http://localhost:3000/` and the backend API at `http://localhost:8080/`.  

The docker-compose file also spins up [Adminer](https://www.adminer.org/) which allows interactions with the database. The Adminer GUI will be available at `http://localhost:8081/`. The mock data SQL script in `backend/src/db/mockData.sql` can be used to populate the database from Adminer.

To shut down the application, run the following command:

```bash
./kill.sh
```

Note: this will reset the database too (and any other dockers that may be running).

## Deployment / Teardown

Information on how to deploy and teardown the application can be found in detail [here](docs/DEPLOY_TEARDOWN.MD).
If all the requirements from the document are met, the deployment can be done by running the GitHub Actions workflow or ```terraform apply``` in the root directory.

## Tests

### Basic Unit Testing

The below unit testing covers basic functionality and these tests are also incorporated into the GitHub Actions and will run on commits.

1. To execute the backend tests, navigate to the `backend` directory
2. Execute ```npm test```.

### Integration Tests

The below integration testing is a more extensive suite of tests that tests various routes and functions. These tests are also incorporated into the GitHub Actions and will run on commits.
The tests can be run by executing tests.sh inside integration_tests.

1. Navigate to integration_tests
2. Run tests.sh
3. View the output of the integration_tests container to view the test output.

OR

1. Navigate to GitHub Actions
2. Select tests
3. Run  the tests by pressing RUN and selecting the branch

Please note if you run docker-compose up --build to run the tests you will need to clear the DB of existing data to get an accurate result. The easiest way is to run the script as it cleans up the environment appropriately.

### More detailed information about tests

[Tests](docs/TESTS.MD)
