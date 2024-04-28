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




//////////////////////////////// Database //////////////////////////////////////
locals {
  database_username = "administrator"
  database_password = "verySecretPassword"
}

resource "aws_db_instance" "unibasement_database" {
  allocated_storage      = 20
  max_allocated_storage  = 1000
  engine                 = "postgres"
  engine_version         = "14"
  instance_class         = "db.t4g.medium"
  db_name                = "unibasement_database"
  username               = local.database_username
  password               = local.database_password
  parameter_group_name   = "default.postgres14"
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.unibasement_database.id]
  publicly_accessible    = true

  tags = {
    Name = "unibasement_database"
  }
}

resource "aws_security_group" "unibasement_database" {
  name        = "unibasement_database"
  description = "Allow inbound Postgresql traffic"

  ingress {
    from_port        = 5432
    to_port          = 5432
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "unibasement_database"
  }
}
//////////////////////////////// Database //////////////////////////////////////




//////////////////////////////// Frontend //////////////////////////////////////



//////////////////////////////// Frontend //////////////////////////////////////




//////////////////////////////// Backend ///////////////////////////////////////



//////////////////////////////// Backend ///////////////////////////////////////




////////////////////////////// Miscellaneous ///////////////////////////////////
data "aws_iam_role" "lab" {
    name = "LabRole"
}

data "aws_vpc" "default" {
    default = true
}

data "aws_subnets" "private" {
    filter {
        name   = "vpc-id"
        values = [data.aws_vpc.default.id]
    }
}
////////////////////////////// Miscellaneous ///////////////////////////////////