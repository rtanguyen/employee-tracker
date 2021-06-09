//TODO: BONUS - Update employee managers, View employees by manager, View employees by department., Delete departments, roles, and employees, View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const { title } = require('process');

const PORT = process.env.PORT || 3001;

let deptArr = [];
let roleArr = [];
let mgrArr = [];

const initializePrompts = () => {
    inquirer.prompt([
    {
        type: 'list',
        pageSize: 12,
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
        case 'Quit':
            endApp();
            break;
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
        console.table(rows);
        endPrompt();
    });

};

const viewRoles = () => {
    const sql = `SELECT role.id, role.title, role.salary, 
                department.name AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        endPrompt();
    });
};

const viewEmployees = () => {
    const sql = `
                SELECT employee.id, employee.first_name, employee.last_name, 
                role.title, role.salary, department.name AS department_name, 
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employee
                LEFT JOIN employee manager ON manager.id = employee.manager_id
                INNER JOIN role on employee.role_id = role.id
                INNER JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        endPrompt();
    });

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
    let result;
    //set role id as value to update role table
    const sql = `SELECT name, id as value FROM department`
    db.query(sql, (err, rows) => {
        result = (JSON.parse(JSON.stringify(rows)));
        deptArr = result;
        // console.log('deptArr:', deptArr);
        inquirer.prompt([
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
            choices: deptArr
        }])
        .then((newRole) => {
            console.log(newRole.department);
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [newRole.title, newRole.salary, newRole.department];
            console.log(params);
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log('New role successfully added');
                endPrompt();
            });
        })
    })
};

//query to get employee roles
const addEmployee = () => {
    let roleArrRes;
    const sql = `SELECT title name, id AS value FROM role`
    db.query(sql, (err, rows) => {
        roleArrRes = (JSON.parse(JSON.stringify(rows)));
        roleArr = roleArrRes;
    //add if statement for updating/adding?
        managerQuery(roleArr);
        return roleArr;
    })
};

//query to get managers
const managerQuery = (roleArr) => {
    let mgrArrRes;
    const sql = `SELECT CONCAT(first_name, ' ', last_name) AS name, id as value FROM employee`
    db.query(sql, (err, rows) => {
        mgrArrRes = (JSON.parse(JSON.stringify(rows)));
        mgrArr = mgrArrRes;
        mgrArr.push({title: 'NA', value: null});
        addEmployeePrompts(roleArr, mgrArr)
    })
    return mgrArr
};

//run employee prompts with arrays from addEmployee and managerQuery
const addEmployeePrompts = (newEmployeeRole, newEmployeeMgr) => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Input name of first name of new employee:',
            validate: title => {
                if (title) {
                return true;
                } else {
                console.log('Please enter name');
                return false
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Input name of last name of new employee:',
            validate: title => {
                if (title) {
                return true;
                } else {
                console.log('Please enter name');
                return false
                }
            }
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select position of new employee:',
            choices: roleArr
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select manager (if employee does not have a manager, select NA):',
            choices: mgrArr
        }
    ])
        .then((newEmployee) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            const params = [newEmployee.first_name, newEmployee.last_name, newEmployee.role, newEmployee.manager];
            console.log('params:', params);
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log('New employee successfully added');
                endPrompt();
            });
        });
    }

//==================UPDATE FUNCTIONS==================//



const endPrompt = () => {
    inquirer.prompt([
    {
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to do perform another search?'
    }
]).then(response => {
    if(response.continue === true) {
        initializePrompts();
    } else {
        endApp();
    }
})
}

const endApp = () => {
    console.log('byeeeee');
    process.exit();
}

initializePrompts();

