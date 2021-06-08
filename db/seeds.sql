INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Finance'),
    ('Purchasing'),
    ('Marketing'),
    ('Legal'),
    ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Salesperson', 70000.00, 1),
    ('Sales Lead', 97500.00, 1),
    ('Accountant', 75000.00, 2),
    ('Controller', 110000.00, 2),
    ('Purchasing Specialist', 72500.00, 3),
    ('Purchasing Lead', 100000.00, 3),
    ('Marketing Analyst', 71000.00, 4),
    ('Marketing Director', 110000.00, 4),
    ('Lawyer', 150000.00, 5),
    ('HR', 68000.00, 6),
    ('HR Administrator', 90000.00, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Sally', 'Sales', 1, 3),
    ('John', 'Doe', 1, 3),
    ('MLM', 'Mary', 1, NULL),
    ('Shaguna', 'Joshi', 2, 6),
    ('Grace', 'Gardner', 2, 6),
    ('Beth', 'Gardner', 2, NULL),
    ('Laura', 'Nauert', 3, 9),
    ('Nancy', 'Martinez', 3, 9),
    ('Sean', 'Salvino', 3, NULL),
    ('Jourdan', 'Lovelady', 4, 13),
    ('Laureen', 'Llanto', 4, 13),
    ('Alex', 'Huynh', 4, 13),
    ('Tiffany', 'Lieu', 4, NULL),
    ('Luke', 'Bohmfalk', 5, NULL),
    ('Michael', 'Matthys', 6, 16),
    ('Ellie', 'Nielsen', 6, NULL);
