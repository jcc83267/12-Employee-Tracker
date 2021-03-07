const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cTable = require('console.table');

let departmentArr = [];
let index = -1;

//connetion setup
const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_DB'
});

connection.connect(err => {
    if (err) throw err;
    console.log("Welcome!")
    console.log('connected as id ' + connection.threadId + '\n');
    mainMenu();
});
//

// main menu prompt list of action
function mainMenu() {
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
        console.log(action);
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
                makeDepartmentArr();
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
        console.log(action);
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

//view all departmennts
function viewAllDepartments() {
    connection.query(
        'SELECT * FROM department',
        function (err, results) {
            if (err) throw err;
            console.table(results);
            backMenu()
        }
    );

}

//view all roles
function viewAllRoles() {
    connection.query(
        `SELECT r_id AS role_id, title AS job_title, name AS department_name, salary 
        FROM role
        INNER JOIN department
        ON role.department_id = department.d_id;
        `,
        function (err, results) {
            if (err) throw err;
            console.table(results);
            backMenu()
        }
    );
}

//view all roles
function viewAllEmployees() {
    connection.query(
        `SELECT 
        e_id, first_name, last_name,
        title, name, salary, manager_id,  CONCAT(first_name, ' ',last_name) AS Manager
        FROM employee
        INNER JOIN role
        ON employee.role_id = role.r_id
        INNER JOIN department
        ON role.department_id = department.d_id
        ORDER BY e_id ASC;
        `,
        // `SELECT * FROM employee;`,
        function (err, results) {
            if (err) throw err;
            console.table(results);
            backMenu()
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
    })
}

function makeDepartmentArr() {
    connection.query(
        'SELECT * FROM department',
        function (err, results) {
            if (err) throw err;
            results.forEach(element => {
                departmentArr.push(element.name);
            });
            addRole();
        }
    )
}

function indexFinder(departmentName) {
    console.log(departmentArr)
    console.log(departmentArr.length)
    for (let i = 0; i < departmentArr.length; i++) {
        console.log("index = " + i)
        if (departmentArr[i] === departmentName) {
            index = i;
            console.log(index)
        }
    }
     return index + 1;
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
        index = indexFinder(department)
        console.log(roleName, salary, department, index)
        connection.query(
            'INSERT INTO role SET ?',
            {
                title: roleName,
                salary: salary,
                department_id: index
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' Role inserted!\n');
                backMenu();
            }
        );
    })
}


