DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;

-- Create Department table
CREATE TABLE department (
    d_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (d_id)
);
--

-- Create Role Table
CREATE TABLE role (
    r_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (r_id),
    FOREIGN KEY (department_id) REFERENCES department(d_id) ON DELETE CASCADE
);
--

-- Create Employee Table
CREATE TABLE employee (
    e_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (e_id),
    FOREIGN KEY (role_id) REFERENCES role(r_id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(e_id) ON DELETE CASCADE
);
--