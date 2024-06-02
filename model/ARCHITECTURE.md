#Structurizr DLS
workspace {
    model {
        user = person "Student" "A user of my website"
        group "Unit Basement" {
            auth0SoftwareSystem = softwareSystem "Auth0" {
                description "Verify a user's identity before giving them access to the website"
                tags "Dependency"
            }   
            uniBasementSoftwareSystem = softwareSystem "Uni Basement" {
                description "The actual project"        
                webApp = container "Web Application" {
                    description "Delivers the static content and the JavaScript application"
                    technology  "TypeScript, HTML, TailwindCSS"
                }
                restApi = container "Application Backend" {
                    description "Provides backend logic for the website"
                    technology "TypeScript & TypeORM"
                }              
                database = container "Database" {
                    description "Stores course information, course ratings, exams & questions"
                    technology "PostgreSQL"
                    tags "Database"
                }
            }
        }     
        uniBasementSoftwareSystem -> auth0SoftwareSystem "Authenticate Users"      
        webApp -> restApi "Send Messages" "Https"      
        restApi -> database "Queries & Updates" "TypeORM"     
        user -> uniBasementSoftwareSystem "Search, Learn, Answer Questions"
    }

    views {
        systemContext uniBasementSoftwareSystem {
            description "Context diagram for the Mailman Suite."
            include *
            autoLayout 
        }

        container uniBasementSoftwareSystem {
            description "Container diagram for the Mailman Suite."
            include *
            autoLayout
        }

        component restAPI "restAPI_diagram" {
            include *
            autoLayout 
        }
        
        styles {
            element "Person" {
                shape Person
                background #bae1ff
                color #000000
            }
            element "Container" {
                shape RoundedBox
                background #baffc9
                color #000000
            }
            element "Dependency" {
                shape RoundedBox
                background #ffdfba
                color #000000
            }

            element "Database" {
                shape Cylinder
                background #B8D8FF
                color #000000
            }
            element browser {
				shape WebBrowser
				background #b3deff
				/* colour is text colour. */
				colour #000000
			}
        }
    }
}
# System Context Diagram 
![image](https://github.com/tristanduncombe/UniBasement/assets/105094182/80ab5877-186a-427b-ba01-9388ef963f6b)
# Container Diagram
