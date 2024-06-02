# UniBasement Backend

The backend is powered by Express and uses TypeORM for database connections and the AWS SDK to interact with S3 buckets.

## Setting Up the Development Server
The backend requires environment variables to be setup for AWS and a separately running database instance.  
Make sure the following environment variables are set:
```
S3_BUCKET_NAME
S3_BUCKET_URL
AWS_REGION
DB_TYPE
DB_USER
DB_PASSWORD
DB_DATABASE
DB_PORT
DB_HOST
```
For more info on setting up an S3 bucket, see the [AWS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html).


Make sure all the below commands are run from the `backend` directory.  


First install the npm dependencies:
```bash
npm install
```

Next, run the development server:
```bash
npm run start
```

The backend API will be accessible on `http://localhost:8080`.
