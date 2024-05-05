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
  backend "s3" {
    bucket = "unibasementtfstate"
    key    = "terraform.tfstate"
    region = "us-east-1"
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
      from_port = 3000
      to_port = 3000
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
resource "docker_image" "unibasement_frontend" {
  name         = "${aws_ecr_repository.unibasement.repository_url}:latest"
  build {
    context = "frontend"
    dockerfile = "Dockerfile"
  }
}

resource "docker_registry_image" "unibasement_frontend" {
  name = docker_image.unibasement_frontend.name
}

resource "aws_ecs_service" "unibasement_frontend" {
    name            = "unibasement_frontend"
    cluster         = aws_ecs_cluster.unibasement.id
    task_definition = aws_ecs_task_definition.unibasement_frontend.arn
    desired_count   = 1
    launch_type     = "FARGATE"
  
    network_configuration {
      subnets             = data.aws_subnets.private.ids
      security_groups     = [aws_security_group.unibasement_frontend.id]
      assign_public_ip    = true
    }
    load_balancer {
      target_group_arn = aws_lb_target_group.unibasement.arn
      container_name   = "unibasement_frontend"
      container_port   = 3000
  }
}

resource "aws_ecs_task_definition" "unibasement_frontend" {
    family                   = "unibasement_frontend"
    network_mode             = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu                      = 4096
    memory                   = 8192
    execution_role_arn       = data.aws_iam_role.lab.arn
  
    container_definitions = <<DEFINITION
  [
    {
      "image": "${docker_registry_image.unibasement_frontend.name}",
      "cpu": 4096,
      "memory": 8192,
      "name": "unibasement_frontend",
      "networkMode": "awsvpc",
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000
        }
      ],
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
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/unibasement/unibasement_frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      }
    }
  ]
  DEFINITION
}



resource "aws_security_group" "unibasement_frontend" {
    name = "unibasement_frontend"
    description = "unibasement Security Group"
  
    ingress {
      from_port = 3000
      to_port = 3000
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
resource "docker_image" "unibasement_backend" {
  name         = "${aws_ecr_repository.unibasement.repository_url}:latest"
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
          "awslogs-group": "/unibasement/unibasement_backend",
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

resource "aws_security_group" "unibasement_backend" {
    name = "unibasement_backend"
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

resource "aws_ecr_repository" "unibasement" {
  name = "unibasement"
}


resource "aws_lb_target_group" "unibasement" {
  name          = "unibasement"
  port          = 8080
  protocol      = "HTTP"
  vpc_id        = aws_security_group.unibasement.vpc_id
  target_type   = "ip"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    port                = "3000"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}


resource "aws_lb" "unibasement" {
  name               = "unibasement"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.private.ids
  security_groups    = [aws_security_group.unibasement.id]
}


resource "aws_lb_listener" "unibasement" {
  load_balancer_arn   = aws_lb.unibasement.arn
  port                = "3000"
  protocol            = "HTTP"

  default_action {
    type              = "forward"
    target_group_arn  = aws_lb_target_group.unibasement.arn
  }
}

resource "local_file" "url" {
    content = "http://${aws_lb.unibasement.dns_name}:3000/" # TODO figure out
    filename = "./unibasement.txt"
}


#TODO some sort of auth0 setup at somepoint in the future lmao need to get from the workflow env variables.
# variable "AUTH0_SECRET" {
#   type = string
# }

# variable "AUTH0_BASE_URL" {
#   type = string
# }

# variable "AUTH0_ISSUER_BASE_URL" {
#   type = string
# }

# variable "AUTH0_CLIENT_ID" {
#   type = string
# }

# variable "AUTH0_CLIENT_SECRET" {
#   type = string
# }



////////////////////////////// Miscellaneous ///////////////////////////////////