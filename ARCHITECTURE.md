# HEHEHAHA todo
<!--- workspace {

    model {
        user = person "User"
        softwareSystem = softwareSystem "UniBasement" {
            ui = container "User Interface" {
                user -> this "Uses"
            }
            webapp = container "Web Api" {
                ui -> this "Uses"
            }
            container "Database" {
                webapp -> this "Reads from and writes to"
            }
        }
    }

    views {
        systemContext softwareSystem {
            include *
            autolayout lr
        }

        container softwareSystem {
            include *
            autolayout lr
        }

        theme default
    }

} --->
![image](https://github.com/tristanduncombe/UniBasement/assets/105094182/80ab5877-186a-427b-ba01-9388ef963f6b)
