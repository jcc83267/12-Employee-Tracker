-- department seeds
INSERT INTO department (d_id, name)
VALUES (1, "Sales");

INSERT INTO department (d_id, name)
VALUES (2, "Legal");

INSERT INTO department (d_id, name)
VALUES (3, "Engineering");

INSERT INTO department (d_id, name)
VALUES (4, "Finance");

-- role seeds
INSERT INTO role (r_id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 1);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (2, "Salesperson", 80000, 1);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (3, "Legal Team Lead", 250000, 2);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (4, "Lawyer", 190000, 2);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (5, "Lead Engineer", 150000, 3);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (6, "Software Egineer", 120000, 3);

INSERT INTO role (r_id, title, salary, department_id)
VALUES (7, "Accountant", 125000, 4);

-- employee seeds
INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (1, "John", "Doe", 1);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (2, "Mike", "Chan", 2);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (3, "Ashley", "Rodriguez", 5);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (4, "Kevin", "Lopez", 6);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (5, "Julius", "Ochoa", 6);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (6, "Malia", "Brown", 7);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (7, "Sarah", "Lourd", 3);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (8, "Tom", "Allen", 4);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (9, "Zak", "Mendoza", 7);

INSERT INTO employee (e_id, first_name, last_name, role_id)
VALUES (10, "Tammer", "Galal", 6);

-- give some employees there managers
UPDATE employee SET 
manager_id = 3
WHERE e_id = 1;

UPDATE employee SET 
manager_id = 1
WHERE e_id = 2;

UPDATE employee SET 
manager_id = 3
WHERE e_id = 4;

UPDATE employee SET 
manager_id = 3
WHERE e_id = 5;

UPDATE employee SET 
manager_id = 7
WHERE e_id = 8;

UPDATE employee SET 
manager_id = 8
WHERE e_id = 9;

UPDATE employee SET 
manager_id = 3
WHERE e_id = 10;