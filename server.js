const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cTable = require('console.table');
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

function mainMenu() {
    inquirer.prompt([
        {   type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role"
            ]}
    ]).then(({ action }) => {
        console.log(action);
        switch (action) {
            case "view all departments":
                viewAllDepartments();
                break;
        }
    });
}

function viewAllDepartments() {
    connection.query(
        'SELECT * FROM department',
        function(err, results) {
          if(err) throw err;
          const tableList = cTable.getTable(results)
          console.log(tableList); // results contains rows returned by server
        }
      );
      connection.end()
}