const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

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
        choices: ['View all departments', 'View all roles', 'View all employees', 'View employees by manager', 'View employees by department', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Update employee manager', 'Delete department', 'Delete role', 'Delete employee', 'Quit']
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
        case 'View employees by manager':
            viewEmpByMgr();
            break;
        case 'View employees by department':
            viewEmpByDept();
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
        case 'Update employee role':
            updateEmployeeRole();
            break;
        case 'Update employee manager':
            updateEmployeeMgr();
            break;
        case 'Delete department':
            deleteDepartment();
            break;
        case 'Delete role':
            deleteRole();
            break;
        case 'Delete employee':
            deleteEmployee();
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
                INNER JOIN department ON role.department_id = department.id
                ORDER BY employee.id ASC`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        endPrompt();
    });

};

const viewEmpByMgr = async () => {
    const mgrArr = await getManagers();
    inquirer.prompt([
        {
            type: "list",
            name: "manager",
            message: "Select manager:",
            choices: mgrArr,
        }
    ])
    .then((manager) => {
        const sql = `SELECT employee.id, 
                    CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name
                    FROM employee
                    WHERE manager_id = ?`;
        const params = [manager.manager];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.table(rows);
          endPrompt();
        });
      });
};

const viewEmpByDept = async () => {
    const deptArr = await getDepartments();
    inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "Select department:",
            choices: deptArr,
        }
    ]).then((department) => {
        const sql = `SELECT employee.id, 
                    CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name
                    FROM employee
                    INNER JOIN role on employee.role_id = role.id
                    INNER JOIN department ON role.department_id = department.id
                    WHERE role.department_id = ?`;
        const params = [department.department];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.table(rows);
          endPrompt();
        });
      });
}

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
                endPrompt();
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

const addEmployee = async () => {
    const roleArr = await getEmployeeRoles();
    const mgrArr = await getEmployees();
    mgrArr.push({ title: "NA", value: null });
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Input name of first name of new employee:",
          validate: (title) => {
            if (title) {
              return true;
            } else {
              console.log("Please enter name");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "last_name",
          message: "Input name of last name of new employee:",
          validate: (title) => {
            if (title) {
              return true;
            } else {
              console.log("Please enter name");
              return false;
            }
          },
        },
        {
          type: "list",
          name: "role",
          message: "Select position of new employee:",
          choices: roleArr,
        },
        {
          type: "list",
          name: "manager",
          message:
            "Select manager (if employee does not have a manager, select NA):",
          choices: mgrArr,
        },
      ])
      .then((newEmployee) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [
          newEmployee.first_name,
          newEmployee.last_name,
          newEmployee.role,
          newEmployee.manager,
        ];
        console.log(params);
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log("New employee successfully added");
          endPrompt();
        });
      });
  };

//==================UPDATE FUNCTIONS==================//
const updateEmployeeRole = async () => {
    const empArr = await getEmployees();
    const roleArr = await getEmployeeRoles();
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select employee to update:",
            choices: empArr,
        },
        {
            type: "list",
            name: "role",
            message: "Select new role:",
            choices: roleArr,
        },
    ])
    .then((newEmployee) => {
        const sql = `UPDATE employee SET role_id =?
                     WHERE id = ?`;
        const params = [newEmployee.role, newEmployee.employee];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log("Employee role updated");
          endPrompt();
        });
      });
};

const updateEmployeeMgr = async () => {
    const empArr = await getEmployees();
    const mgrArr = await getEmployees();
        mgrArr.push({ title: "NA", value: null });

    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select employee to update:",
            choices: empArr,
        },
        {
            type: "list",
            name: "manager",
            message: "Select new manager:",
            choices: mgrArr,
        },
    ])
    .then((newEmployee) => {
        const sql = `UPDATE employee SET manager_id =?
                     WHERE id = ?`;
        const params = [newEmployee.manager, newEmployee.employee];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          console.log("Employee manager updated");
          endPrompt();
        });
      });
};
  
//==================DELETE FUNCTIONS==================//
const deleteDepartment = async () => {
    const deptArr = await getDepartments();
    inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "Select department to delete:",
            choices: deptArr,
        }
    ])
    .then((department) => {
        // console.log(department);
        const sql = `DELETE FROM department WHERE id = ?`
        const params = [department.department];
        db.query(sql, params, (err, rows) => {
            if (err) throw err;
            console.log('Department deleted');
            endPrompt();
        });
    });
};

const deleteRole = async () => {    
    const roleArr = await getEmployeeRoles();
    inquirer.prompt([
        {
            type: "list",
            name: "title",
            message: "Select role to delete:",
            choices: roleArr,
        }
    ])
    .then((role) => {
        const sql = `DELETE FROM role WHERE id = ?`
        const params = [role.title];
        db.query(sql, params, (err, rows) => {
            if (err) throw err;
            console.log('Position deleted');
            endPrompt();
        });
    });
};

const deleteEmployee = async () => {
    const empArr = await getEmployees();
    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select employee to delete:",
            choices: empArr,
        }
    ])
    .then((employee) => {
        const sql = `DELETE FROM employee WHERE id = ?`
        const params = [employee.employee];
        db.query(sql, params, (err, rows) => {
            if (err) throw err;
            console.log('Employee deleted');
            endPrompt();
        });
    });
}


//==================QUERIES FOR CHOICES==================//
const getDepartments = () => {
    return new Promise((resolve, reject) => {
      let deptArrRes;
      let deptArr;
      const sql = `SELECT name, id AS value FROM department`;
      db.query(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        deptArrRes = JSON.parse(JSON.stringify(rows));
        deptArr = deptArrRes;
        resolve(deptArr);
      });
    });
  };

const getEmployeeRoles = () => {
    return new Promise((resolve, reject) => {
      let roleArrRes;
      let roleArr;
      const sql = `SELECT title name, id AS value FROM role`;
      db.query(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        roleArrRes = JSON.parse(JSON.stringify(rows));
        roleArr = roleArrRes;
        resolve(roleArr);
      });
    });
  };

  
  const getEmployees = () => {
    return new Promise((resolve, reject) => {
        let empArrRes;
        let empArr;
        const sql = `SELECT CONCAT(first_name, ' ', last_name) AS name, id AS value FROM employee`;
        db.query(sql, (err, rows) => {
        if (err) {
            reject(err);
          }
        empArrRes = JSON.parse(JSON.stringify(rows));
        empArr = empArrRes;
        // console.log(empArr);
        resolve(empArr);
        });
    });
  };

//includes managers only
  const getManagers = () => {
    return new Promise((resolve, reject) => {
    let mgrArrRes;
    let mgrArr;
    const sql = `SELECT employee.manager_id AS value, 
                CONCAT(manager.first_name, ' ', manager.last_name) AS name
                FROM employee
                LEFT JOIN employee manager ON manager.id = employee.manager_id
                WHERE employee.manager_id IS NOT NULL
                GROUP BY employee.manager_id`;
    db.query(sql, (err, rows) => {
        if (err) {
            reject(err);
          }
        mgrArrRes = JSON.parse(JSON.stringify(rows));
        mgrArr = mgrArrRes;
        // console.log(mgrArr);
        resolve(mgrArr);
        });
    });
  };

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

