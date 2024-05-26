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
      auth0 = {
        source = "auth0/auth0"
        version = "1.2.0"
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

provider "auth0" {
  domain = var.auth0_domain
  client_id = var.auth0_client_id
  client_secret = var.auth0_client_secret
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
}

variable "database_password" {
  description = "Password for the database"
}


data "aws_db_instance" "unibasement_database" {
  tags = {
    Name = "unibasement_database"
  }
}

data "aws_s3_bucket" "unibasement_images" {
  bucket = "unibasement-images"
}




//////////////////////////////// Database //////////////////////////////////////


//////////////////////////////// Frontend //////////////////////////////////////
resource "docker_image" "unibasement_frontend" {
  name         = "${aws_ecr_repository.unibasement.repository_url}:frontend_latest"
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


# Autoscaling for frontend
resource "aws_appautoscaling_target" "unibasement_frontend" {
  max_capacity       = 8#6 
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.unibasement.name}/${aws_ecs_service.unibasement_frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "unibasement_frontend" {
  name               = "unibasement_frontend"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.unibasement_frontend.resource_id
  scalable_dimension = aws_appautoscaling_target.unibasement_frontend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.unibasement_frontend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 50.0
  }
}




variable "auth0_domain" {
  description = "Auth0 Domain"
}

variable "auth0_client_id" {
  description = "Auth0 Client ID"
}

variable "auth0_client_secret" {
  description = "Auth0 Client Secret"
}

resource "auth0_client" "unibasement" {
  name = "unibasement"
  app_type = "regular_web"
  callbacks = ["http://${aws_route53_record.unibasement.name}.${data.aws_route53_zone.unibasement.name}/api/auth/callback"]
  web_origins = ["http://${aws_route53_record.unibasement.name}.${data.aws_route53_zone.unibasement.name}/"]
  allowed_origins = ["http://${aws_route53_record.unibasement.name}.${data.aws_route53_zone.unibasement.name}/"]
  allowed_logout_urls = ["http://${aws_route53_record.unibasement.name}.${data.aws_route53_zone.unibasement.name}"]
  oidc_conformant = true
}

resource "auth0_client_credentials" "unibasement" {
  client_id = auth0_client.unibasement.id

  # for MVP only
  authentication_method = "none"
}

data "auth0_client" "unibasement" {
  name = auth0_client.unibasement.name
}


data "auth0_tenant" "unibasement" {}
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
          "name": "NEXT_PUBLIC_API_URL",
          "value": "http://${aws_lb.unibasement_backend.dns_name}:8080"
        },
        {
          "name": "NEXT_PUBLIC_ROOT_DOMAIN",
          "value": "${aws_route53_record.unibasement.name}.${data.aws_route53_zone.unibasement.name}"
        },
        {
          "name": "AUTH0_CLIENT_DOMAIN",
          "value": "${var.auth0_domain}"
        },
        {
          "name": "AUTH0_CLIENT_ID",
          "value": "${auth0_client.unibasement.client_id}"
        },
        {
          "name": "AUTH0_CLIENT_SECRET",
          "value": "${data.auth0_client.unibasement.client_secret}"
        },
        {
        "name": "AUTH0_SECRET",
        "value": "${random_string.auth0_secret.result}"
        },
        {
          "name": "AUTH0_BASE_URL",
          "value": "http://${aws_route53_record.unibasement.name}.${data.aws_route53_zone.unibasement.name}/"
        },
        {
          "name": "AUTH0_ISSUER_BASE_URL",
          "value": "https://${data.auth0_tenant.unibasement.domain}/"
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


# Generate a random string for the secret
resource "random_string" "auth0_secret" {
  length  = 64
  special = true
}

#TODO need scalability stuff for front, back db ?

resource "aws_security_group" "unibasement_frontend" {
    name = "unibasement_frontend"
    description = "unibasement Security Group"
  
    ingress {
      from_port = 80
      to_port = 80
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  
    ingress {
      from_port = 3000
      to_port = 3000
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
  name         = "${aws_ecr_repository.unibasement.repository_url}:backend_latest"
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
  enable_ecs_managed_tags = true
  wait_for_steady_state = true

  network_configuration {
    subnets             = data.aws_subnets.private.ids
    security_groups     = [aws_security_group.unibasement_backend.id]
    assign_public_ip    = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.unibasement_backend.arn
    container_name   = "unibasement_backend"
    container_port   = 8080
  }
}

resource "aws_ecs_task_definition" "unibasement_backend" {
  family                   = "unibasement_backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 4096
  memory                   = 12288
  execution_role_arn       = data.aws_iam_role.lab.arn
  task_role_arn            = data.aws_iam_role.lab.arn

  container_definitions = <<DEFINITION
  [
    {
      "image": "${docker_registry_image.unibasement_backend.name}",
      "cpu": 4096,
      "memory": 12288,
      "name": "unibasement_backend",
      "networkMode": "awsvpc",
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080
        }
      ],
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
          "name": "DB_TYPE",
          "value": "postgres"
        },
        {
          "name": "DB_USER",
          "value": "${local.database_username}"
        },
        {
          "name": "DB_HOST",
          "value": "${data.aws_db_instance.unibasement_database.address}"
        }, 
        {
          "name": "DB_DATABASE",
          "value": "${data.aws_db_instance.unibasement_database.db_name}"
        },
        {
          "name": "DB_PASSWORD",
          "value": "${var.database_password}"
        }, 
        {
          "name": "DB_PORT",
          "value": "5432"
        },
        {
          "name": "S3_BUCKET_NAME",
          "value": "${data.aws_s3_bucket.unibasement_images.bucket}"
        },
        {
          "name": "S3_BUCKET_URL",
          "value": "${data.aws_s3_bucket.unibasement_images.bucket_regional_domain_name}"
        },
        {
          "name": "AWS_REGION",
          "value": "us-east-1"
        }
      ]
    }
  ]
  DEFINITION
}


# Autoscaling for backend
resource "aws_appautoscaling_target" "unibasement_backend" {
  max_capacity       = 8#6
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.unibasement.name}/${aws_ecs_service.unibasement_backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "unibasement_backend" {
  name               = "unibasement_backend"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.unibasement_backend.resource_id
  scalable_dimension = aws_appautoscaling_target.unibasement_backend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.unibasement_backend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 50.0
  }
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
  port          = 3000
  protocol      = "HTTP"
  vpc_id        = aws_security_group.unibasement_frontend.vpc_id
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
  security_groups    = [aws_security_group.unibasement_frontend.id]
}

resource "aws_lb" "unibasement_backend" {
  name               = "unibasementBackend"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.private.ids
  security_groups    = [aws_security_group.unibasement_backend.id]
}

resource "aws_lb_target_group" "unibasement_backend" {
  name          = "unibasementBackend"
  port          = 8080
  protocol      = "HTTP"
  vpc_id        = aws_security_group.unibasement_backend.vpc_id
  target_type   = "ip"

  health_check {
    path                = "/api/health"
    protocol            = "HTTP"
    port                = "8080"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "unibasement_backend" {
  load_balancer_arn   = aws_lb.unibasement_backend.arn
  port                = "8080"
  protocol            = "HTTP"

  default_action {
    type              = "forward"
    target_group_arn  = aws_lb_target_group.unibasement_backend.arn
  }
}

resource "aws_lb_listener" "unibasement" {
  load_balancer_arn   = aws_lb.unibasement.arn
  port                = "80"
  protocol            = "HTTP"

  default_action {
    type              = "forward"
    target_group_arn  = aws_lb_target_group.unibasement.arn
  }
}

data "aws_route53_zone" "unibasement" {
  name = "g6.csse6400.xyz"
  private_zone = false
}

resource "aws_route53_record" "unibasement" {
  zone_id = data.aws_route53_zone.unibasement.zone_id
  name    = "unibasement"
  type    = "A"
  alias {
    name                   = aws_lb.unibasement.dns_name
    zone_id                = aws_lb.unibasement.zone_id
    evaluate_target_health = true
  }
}

////////////////////////////// Miscellaneous ///////////////////////////////////






