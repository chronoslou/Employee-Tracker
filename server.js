const mysql = require("mysql");
const inquirer = require("inquirer")
const cTable = require("console.table")

const pass = require("./config")
const connection = mysql.createConnection({
  host: 'localhost',
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: 'root',
  // Your password
  password: pass,
  database: 'emp_manager_db',
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    initialize();
});
const initialize = () => {
    inquirer
        .prompt([
            {
                type: "list"
                , name: "init"
                , message: "What would you like to do?"
                , choices: [
                    "View All Employees"
                    , "View All Employees by Role"
                    , "View All Departments"
                    , "Add an Employee"
                    , "Add a new Department"
                    , "Update an Employee's Role"
                    , "Remove an Employee"
                    , "Exit"
                ]
            }
        ]).then((answer) => {
            switch (answer.init){
                case "View All Employees":
                    viewEmployees();
                break;
                case "View All Employees by Role":
                    viewRoles();
                break;
                case "View All Departments":
                    viewJustDepartments();
                break;
                case "Add an Employee":
                    addEmployee();
                break;
                case "Add a new Department":
                    addDepartment();
                break;
                case "Update an Employee's Role":
                    updateEmployee();
                break;
                case "Remove an Employee":
                    deleteEmployee();
                break;
                default:
                    connection.end();
            }
        });
}
const viewEmployees = () => {
    const query = "SELECT DISTINCT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;"
    connection.query(
        query
        , (err, res) => {
            if (err) throw err;
            console.table(res);
            initialize();
        });
};
const viewJustDepartments = () => {
    const query = "SELECT * FROM department;"
    connection.query(
        query
        , (err, res) => {
            if (err) throw err;
            console.table(res)
            initialize()
            });
}
const viewRoles = () => {
    const query = "SELECT * FROM role;"
    connection.query(
        query
        , (err, res) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name:"choice"
                        , type: "list"
                        , message: "Which Role would you like to view?"
                        , choices: () => {
                            var choiceArray = [];
                            for (const item of res) {
                                choiceArray.push(item.title)
                            }
                            return choiceArray;
                        }
                    }
                ]).then(data => {
                    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title , department.name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE ?;"
                    connection.query(
                        query
                        , [{
                            "role.title": data.choice
                        }]
                        , (err, res) => {
                            if (err) throw err;
                            console.table(res)
                            initialize();
                        });
                });
        });
}
const addDepartment = () => {
    inquirer
        .prompt([
            { 
                name: "departmentName"
                , type: "input"
                , message: "Which new department is being added?"
            }    
        ]).then ((data) => {
        const query = "INSERT INTO department SET ?;"
                connection.query(
                    query
                    , {
                        name: data.departmentName
                    }
                    , err => {
                        if (err)throw err;
                        console.log("Department Added!")
                        initialize();
                    });
            });
    };

    const addEmployee = () => {
        inquirer
            .prompt([
                {   
                    name: "firstName"
                    , type: "input"
                    , message: "What is the Employees First Name?"
                },
                {
                    name: "lastName"
                    , type: "input"
                    , message: "What is the Employees Last Name?"
                },
                {
                    name: "choice"
                    , type: "list"
                    , message: "What is this employee's title?"
                    , choices: [
                        "CEO"
                        , "COO"
                        , "CTO"
                        , "CFO"
                        , "Sales Team Lead"
                        , "Salesperson"
                        , "Controller"
                        , "Accountant"
                        , "Legal Team Lead"
                        , "Lawyer"
                        , "Engineer Team Lead"
                        , "Software Engineer"
                    ]
                }
            ]).then(data => {
                switch(data.choice) {
                    case "CEO":
                        var roleID = 1;
                    break;
                    case "COO":
                        var roleID = 2;
                    break;
                    case "CTO":
                        var roleID = 3;
                    break;
                    case "CFO":
                        var roleID = 4;
                    break;
                    case "Sales Team Lead":
                        var roleID = 5;
                    break;
                    case "Salesperson":
                        var roleID = 6;
                    break;
                    case "Controller":
                        var roleID = 7;
                    break;
                    case "Accountant":
                        var roleID = 8;
                    break;
                    case "Legal Team Lead":
                        var roleID = 9;
                    break;
                    case "Lawyer":
                        var roleID = 10;
                    break;
                    case "Engineer Team Lead":
                        var roleID = 11;
                    break;
                    case "Software Engineer":
                        var roleID = 12;
                    break;
                }
                const query = "INSERT INTO employee SET ?;"
                connection.query(
                    query
                    , {
                        first_name: data.firstName
                        , last_name: data.lastName
                        , role_id: roleID
                    }
                    , err => {
                        if (err)throw err;
                        console.log("Employee Added!")
                        initialize();
                    });
            });
    };
    const updateEmployee = () => {
        const query = "SELECT CONCAT(first_name, ' ', last_name) as name FROM employee;"
        connection.query(
            query
            , (err, res) => {
                if (err) throw err;
                inquirer
                    .prompt([
                        {
                            type: "list"
                            , message: "Which Employee would you like to update?"
                            , name: "selectedEmp"
                            , choices: () => {
                                var choiceArray = [];
                                for (const item of res) {
                                    choiceArray.push(item.name);
                                }
                                return choiceArray;
                            }
                        },
                        {
                            name: "choice"
                            , type: "list"
                            , message: "What is this employee's title?"
                            , choices: [
                                "CEO"
                                , "COO"
                                , "CTO"
                                , "CFO"
                                , "Sales Team Lead"
                                , "Salesperson"
                                , "Controller"
                                , "Accountant"
                                , "Legal Team Lead"
                                , "Lawyer"
                                , "Engineer Team Lead"
                                , "Software Engineer"
                            ]
                        }
                    ]).then(data => {
                        switch (data.choice) {
                            case "CEO":
                                var roleID = 1;
                                break;
                            case "COO":
                                var roleID = 2;
                                break;
                            case "CTO":
                                var roleID = 3;
                                break;
                            case "CFO":
                                var roleID = 4;
                                break;
                            case "Sales Team Lead":
                                var roleID = 5;
                                break;
                            case "Salesperson":
                                var roleID = 6;
                                break;
                            case "Controller":
                                var roleID = 7;
                                break;
                            case "Accountant":
                                var roleID = 8;
                                break;
                            case "Legal Team Lead":
                                var roleID = 9;
                                break;
                            case "Lawyer":
                                var roleID = 10;
                                break;
                            case "Engineer Team Lead":
                                var roleID = 11;
                                break;
                            case "Software Engineer":
                                var roleID = 12;
                                break;
                        }
                        const emp = data.selectedEmp.split(" ");
                        const query = "UPDATE employee SET ? WHERE ? AND ?";
                        connection.query(
                            query
                            , [
                                {
                                    role_id: roleID
                                },
                                {
                                    first_name: emp[0]
                                },
                                {
                                    last_name: emp[1]
                                }
                            ]
                            , err => {
                                if (err) throw err;
                                console.log("Employee Successfully Updated!");
                                initialize();
                            });
                    });
            });
    };
    const deleteEmployee = () => {
        const query = "SELECT CONCAT(first_name, ' ', last_name) as name FROM employee;"
        connection.query(
            query
            , (err, res) => {
                if (err) throw err;
                inquirer
                    .prompt(
                        {
                            type: "list"
                            , message: "Which Employee would you like to delete?"
                            , name: "selectedEmp"
                            , choices: () => {
                                var choiceArray = [];
                                for (const item of res) {
                                    choiceArray.push(item.name);
                                }
                                return choiceArray;
                            }
                        }
                    ).then( data => {
                        const emp = data.selectedEmp.split(" ");
                        const query = "DELETE FROM employee WHERE ? AND ?";
                        connection.query(
                            query
                            , [
                                {
                                    first_name: emp[0]
                                },
                                {
                                    last_name: emp[1]
                                }
                            ]
                            , err => {
                                if (err) throw err;
                                console.log("Employee Successfully deleted!");
                                initialize();
                            });
                    });
            });
    };