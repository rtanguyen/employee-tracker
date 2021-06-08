//TODO: BONUS - Update employee managers, View employees by manager, View employees by department., Delete departments, roles, and employees, View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;


function initializePrompts() {
    inquirer.prompt([
    {
        type: 'checkbox',
        name: 'action',
        message: 'Please select from the following options:',
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
    },

]).then((startApp) => {
    switch (startApp.action) {
        case 'View all departments':
            this.viewDepartments();
            break;
        case 'View all roles':
            this.viewRoles();
            break;
        case 'View all employees':
            this.viewEmployees();
            break;
        case 'Add a department':
            this.addDepartment();
            break;
        case 'Add a role':
            this.addRole();
            break;
        case 'Add an employee':
            this.addEmployee();
            break;
        case 'Update an employee role':
            this.updateEmployee();
            break;
            
        }
    });
};

function viewDepartments() {
    const sql = `SELECT * FROM department`;
    
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
    })
    //TODO: add exit prompt?
}

function addDepartment() {
    inquirer.prompt(
        {
            type: 'input',
            name: 'deptName',
            message: 'Input name of department to add to database:',
            validate: deptName => {
                if (deptName) {
                  return true;
                } else {
                  console.log('Please enter department name');
                  return false
                }
            }
        });
};

initializePrompts();