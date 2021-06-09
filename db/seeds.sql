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
    ('Paralegal', 75000.00, 5),
    ('Lawyer', 150000.00, 5),
    ('HR', 68000.00, 6),
    ('HR Administrator', 90000.00, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Sally', 'Sales', 1, 3),
    ('John', 'Doe', 1, 3),
    ('MLM', 'Mary', 2, NULL),
    ('Shaguna', 'Joshi', 3, 6),
    ('Grace', 'Gardner', 3, 6),
    ('Beth', 'Gardner', 4, NULL),
    ('Laura', 'Nauert', 5, 9),
    ('Nancy', 'Martinez', 5, 9),
    ('Sean', 'Salvino', 6, NULL),
    ('Jourdan', 'Lovelady', 7, 13),
    ('Laureen', 'Llanto', 7, 13),
    ('Alex', 'Huynh', 7, 13),
    ('Tiffany', 'Lieu', 8, NULL),
    ('Ted', 'Daniels', 9, 15),
    ('Luke', 'Bohmfalk', 10, NULL),
    ('Michael', 'Matthys', 11, 17),
    ('Ellie', 'Nielsen', 12, NULL);
