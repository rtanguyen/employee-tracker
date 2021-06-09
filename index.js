//TODO: BONUS - Update employee managers, View employees by manager, View employees by department., Delete departments, roles, and employees, View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const { title } = require('process');

const PORT = process.env.PORT || 3001;


const initializePrompts = () => {
    inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'Please select from the following options:',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
    },
]).then((start) => {
    switch (start.action) {
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployee();
            break;
        // case 'Quit':
        //     endApp();
        //     break;
        default:
            console.log("error");
        }
    });
};

//==================VIEW FUNCTIONS==================//
const viewDepartments = () => {
    const sql = `SELECT name AS department_name FROM department`;
    
    db.query(sql, (err, rows) => {
        if (err) throw err;
        return console.table(rows);
    });
    initializePrompts();
};

const viewRoles = () => {
    const sql = `SELECT role.id, role.title, role.salary, 
                department.name AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        return console.table(rows);
    });
    initializePrompts();
};

const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, 
                role.title, role.salary, department.name, employee.manager_id,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employee
                LEFT JOIN employee manager ON manager.id = employee.manager_id
                INNER JOIN role on employee.role_id = role.id
                INNER JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        return console.table(rows);
    });
    initializePrompts();
};

//==================ADD FUNCTIONS==================//
const addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'name',
            message: 'Input name of department to add to database:',
            validate: name => {
                if (name) {
                  return true;
                } else {
                  console.log('Please enter department name');
                  return false
                }
            }
        })
        .then((newDepartment) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = newDepartment.name;
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log('New department successfully added');
                initializePrompts();
            });
        });
};

const addRole = () => {
    //FIXME: dept array for choices
    let deptArr = [];
    const sql = `SELECT name AS department_name FROM department`;
    // db.query(sql, (err, rows) => {
    //     for(var i = 0; i < rows.length; i++) {
    //         deptArr.push(rows[i].department_name);
    //     }
    //     console.log(rows[0].department_name);
    //     // deptArr.push(rows);
    //     console.log(deptArr);
    // })
        inquirer.prompt(
            {
                type: 'input',
                name: 'title',
                message: 'Input name of position to add to database:',
                validate: title => {
                    if (title) {
                      return true;
                    } else {
                      console.log('Please enter position name');
                      return false
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Input salary for new position:',
                validate: salary => {
                    if (salary) {
                      return true;
                    } else {
                      console.log('Please enter salary');
                      return false
                    }
                }
            },
            {
                type: 'list',
                name: 'department',
                message: 'Select department for new position:',
                loop: //FIXME: dynamic array based on db
            })
    
            .then((newRole) => {
                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                const params = [newRole.title, newRole.salary, newRole.department];
                console.log(params);
                db.query(sql, params, (err, rows) => {
                    if (err) throw err;
                    console.log('New role successfully added');
                    initializePrompts();
                });
            });
        };

// initializePrompts();
addRole();