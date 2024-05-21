# Deploy / Teardown

## Requirements

1. AWS Credentials
2. Auth0 Credentials
3. DB Password

### AWS Credentials

Grab your AWS credentials from the UQ Token Machine (link on Blackboard)

### Auth0 Credentials

1. Visit [Auth0](https://auth0.com/).
2. Click create Application select "Machine to Machine Applications".
3. Select the "Auth0 Management API" and select ALL permissions.
4. Press Authorize
5. Now visit the settings page and note the Domain, Client ID and Client Secret.

### DB Password

Access to this is restricted to the team. Please contact the team for the password and why you need it.

## To Deploy / Teardown

### Workflow

1. After completing the requirements, go to the Github Actions and find the ```Manual AWS Deployment``` or ```Manual AWS Teardown``` workflow.
2. When prompted paste in the credentials into the credentials box
3. When prompted paste the Auth0 credentials and the database password into the box, in the format.
```export TF_VAR_auth0_domain=xxx \ export TF_VAR_auth0_client_id=xxx \ export TF_VAR_auth0_client_secret=xxx \ export TF_VAR_database_password=xxx```
4. The deployment will take a few minutes to complete.
5. Once the deployment is complete, you will be able to access the application at [Link](http://g6.g6.csse6400.xyz:3000/).

### Local

Alternatively you can run the deployment script manually

1. Run the following command ensuring you fill in xxx with the appropriate value ```export TF_VAR_auth0_domain=xxx```
2. Run the following command ensuring you fill in xxx with the appropriate value ```export TF_VAR_auth0_client_id=xxx```
3. Run the following command ensuring you fill in xxx with the appropriate value ```export TF_VAR_auth0_client_secret=xxx```
4. Run the following command ensuring you fill in xxx with the appropriate value ```export TF_VAR_database_password=xxx```
5. Paste the copied AWS credentials (from the token machine) directly into the terminal.
6. Run ```terraform init```
7. Run```terraform apply```
