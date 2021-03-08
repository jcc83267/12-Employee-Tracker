const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cTable = require('console.table');

let departmentArr = [];
let employeeArr = [];
let roleArr = [];

//function to count index placement
function indexFinder(matchName, arrayName) {
    let index = -1;
    for (let i = 0; i < arrayName.length; i++) {
        if (arrayName[i] === matchName) {
            index = i + 1;
        }
    }
    return index;
}

//connetion setup
const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_DB'
});

//start connection with main menu
connection.connect(err => {
    if (err) throw err;
    console.log("EMPLOYEE TRACKER \nWelcome! \nconnected as id"  + connection.threadId + "\n");
    mainMenu();
});
//

// main menu prompt list of action
function mainMenu() {
    makeDepartmentArr();
    makeRoleArr();
    makeEmployeeArr();
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "end session"
            ]
        }
    ]).then(({ action }) => {
        switch (action) {
            case "view all departments":
                viewAllDepartments();
                break;
            case "view all roles":
                viewAllRoles();
                break;
            case "view all employees":
                viewAllEmployees();
                break;
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
            case "update an employee role":
                updateEmployee();
                break;
            case "end session":
                connection.end();
                break;
        }
    });
}

// menu to go back or end
function backMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
                "go back to main menu",
                "end session"
            ]
        }
    ]).then(({ action }) => {
        switch (action) {
            case "go back to main menu":
                mainMenu();
                break;
            case "end session":
                connection.end();
                break;
        }
    });
}

//functions to make array based on the tables
function makeDepartmentArr() {
    departmentArr = [];
    connection.query(
        'SELECT * FROM department ORDER BY d_id ASC',
        function (err, results) {
            if (err) throw err;
            results.forEach(element => {
                departmentArr.push(element.name);
            });
            return;
        }
    );
}

function makeEmployeeArr() {
    employeeArr = [];
    connection.query(
        'SELECT * FROM employee ORDER BY e_id ASC',
        function (err, results) {
            if (err) throw err;
            results.forEach(element => {
                let name = element.first_name + " " + element.last_name;
                employeeArr.push(name);
            });
            return;
        }
    );
}

function makeRoleArr() {
    roleArr = [];
    connection.query(
        'SELECT * FROM role ORDER BY r_id ASC' ,
        function (err, results) {
            if (err) throw err;
            results.forEach(element => {
                roleArr.push(element.title);
            });
            return;
        }
    );
}
//function to make array end;

//view all departmennts
function viewAllDepartments() {
    connection.query(
        'SELECT d_id AS id, name AS department_name FROM department ORDER BY d_id ASC;',
        function (err, results) {
            if (err) throw err;
            console.table(results);
            backMenu();
        }
    );
}

//view all roles
function viewAllRoles() {
    connection.query(
        `SELECT r_id AS id, title AS job_title, name AS department_name, salary 
        FROM role
        INNER JOIN department
        ON role.department_id = department.d_id
        ORDER BY r_id ASC;
        `,
        function (err, results) {
            if (err) throw err;
            console.table(results);
            backMenu();
        }
    );
}

//view all roles
function viewAllEmployees() {
    connection.query(
        `SELECT e_id AS id, first_name, last_name, title AS job_title, name AS department_name, salary, manager_id
        FROM employee
        INNER JOIN role
        ON employee.role_id = role.r_id
        INNER JOIN department
        ON role.department_id = department.d_id
        ORDER BY e_id ASC;
        `,
        function (err, results) {
            if (err) throw err;
            console.table(results);
            backMenu();
        }
    );
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department',
            name: 'departmentName'
        }
    ]).then(({ departmentName }) => {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: departmentName
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Department inserted!\n');
                departmentArr = [];
                backMenu();
            }
        );
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the role',
            name: 'roleName'
        },
        {
            type: 'number',
            message: 'What is the salary',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Under which department is this role?',
            name: 'department',
            choices: departmentArr
        }
    ]).then(({ roleName, salary, department }) => {
        let index = indexFinder(department, departmentArr);
        connection.query(
            'INSERT INTO role SET ?',
            {
                title: roleName,
                salary: salary,
                department_id: index
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Role added!\n');
                backMenu();
            }
        );
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: "What is the employee's first name?",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastName'
        },
        {
            type: 'list',
            message: "What is the employee's title?",
            name: 'title',
            choices: roleArr
        },
        {
            type: 'list',
            message: "Who is the employee's manager?",
            name: 'manager',
            choices: employeeArr
        }
    ]).then(({ firstName, lastName, title, manager }) => {
        let index = indexFinder(title, roleArr);
        let index2 = indexFinder(manager, employeeArr);
        connection.query(
            'INSERT INTO employee SET ?',
            {
                first_name: firstName,
                last_name: lastName,
                role_id: index,
                manager_id: index2
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Employee has been added!\n');
                backMenu();
            }
        );
    });
}

function updateEmployee() {
    inquirer.prompt([
        {
            type: 'list',
            message: "Which Employee would you like to edit?",
            name: 'employee',
            choices: employeeArr
        },
        {
            type: 'list',
            message: "What is the employee's new title?",
            name: 'title',
            choices: roleArr
        }
    ]).then(({ employee, title }) => {
        let index = indexFinder(employee, employeeArr);
        let index2 = indexFinder(title, roleArr);
        connection.query(
            'UPDATE employee SET ? WHERE ?',
            [{
                role_id: index2
            },
            {
                e_id: index
            }],
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Role updated!\n');
                backMenu();
            }
        );
    });
}