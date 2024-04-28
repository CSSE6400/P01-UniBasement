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
}

provider "docker" {
  registry_auth {
    address  = data.aws_ecr_authorization_token.ecr_token.proxy_endpoint
    username = data.aws_ecr_authorization_token.ecr_token.user_name
    password = data.aws_ecr_authorization_token.ecr_token.password
  }
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
resource "aws_security_group" "unibasement" {
    name = "unibasement"
    description = "unibasement Security Group"
  
    ingress {
      from_port = 8080
      to_port = 8080
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  
    ingress {
      from_port = 22
      to_port = 22
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  
    egress {
      from_port = 0
      to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
}



//////////////////////////////// Frontend //////////////////////////////////////




//////////////////////////////// Backend ///////////////////////////////////////
resource "docker_image" "unibasement_backend" {
  name         = "${aws_ecr_repository.unibasement_backend.repository_url}:latest"
  build {
    context = "backend"
    dockerfile = "Dockerfile"
  }
}

resource "docker_registry_image" "unibasement_backend" {
  name = docker_image.unibasement_backend.name
}


resource "aws_ecs_service" "unibasement_backend" {
  name            = "unibasement_backend"
  cluster         = aws_ecs_cluster.unibasement.id
  task_definition = aws_ecs_task_definition.unibasement_backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets             = data.aws_subnets.private.ids
    security_groups     = [aws_security_group.unibasement.id]
    assign_public_ip    = true
  }
}


resource "aws_ecs_task_definition" "unibasement_backend" {
  family                   = "unibasement_backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 4096
  memory                   = 12288
  execution_role_arn       = data.aws_iam_role.lab.arn

  container_definitions = <<DEFINITION
  [
    {
      "image": "${docker_registry_image.unibasement_backend.name}",
      "cpu": 4096,
      "memory": 12288,
      "name": "unibasement_backend",
      "networkMode": "awsvpc",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/uniBasement/unibasement_backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      },
      "environment": [
        {
          "name": "DB_USER",
          "value": "${local.database_username}"
        },
        {
          "name": "DB_HOST",
          "value": "${aws_db_instance.unibasement_database.address}"
        }, 
        {
          "name": "DB_DATABASE",
          "value": "${aws_db_instance.unibasement_database.db_name}"
        },
        {
          "name": "DB_PASSWORD",
          "value": "${local.database_password}"
        }, 
        {
          "name": "DB_PORT",
          "value": "5432"
        }
      ]
    }
  ]
  DEFINITION
}


resource "aws_ecr_repository" "unibasement_backend" {
  name = "unibasement_backend"
}


resource "aws_security_group" "unibasement_backend" {
    name = "unibasement"
    description = "unibasement Security Group"
  
    ingress {
      from_port = 8080
      to_port = 8080
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  
    ingress {
      from_port = 22
      to_port = 22
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  
    egress {
      from_port = 0
      to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
}

//////////////////////////////// Backend ///////////////////////////////////////




////////////////////////////// Miscellaneous ///////////////////////////////////
resource "aws_ecs_cluster" "unibasement" {
    name = "unibasement"
}


data "aws_ecr_authorization_token" "ecr_token" {}


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