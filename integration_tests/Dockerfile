# Dockerfile to run the python unit tests
FROM python:3.10

RUN apt-get update && apt-get install -y docker.io

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . tests

# Install any needed packages specified in requirements.txt
RUN pip install requests pytest pytest-reportlog rfc3339-validator pendulum python-lorem

# Run the unit tests
CMD bash -c "sleep 10 && python -m pytest -v --report-log report.log tests"