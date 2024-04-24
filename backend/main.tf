terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 5.0"
      }
      docker = {
        source  = "kreuzwerker/docker"
        version = "3.0.2"
      }
  }
}

provider "aws" {
    region = "us-east-1"
    shared_credentials_files = ["./credentials"]
}
