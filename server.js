var mysql = require("mysql2");
var inquirer = require("inquirer");

//setting up connection to mySQL
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,
  user: "root",
  password: "",
  database: "PositionControl_db"
});
//call the main menu function on load
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  mainMenu();
});
//function for the main menu 
function mainMenu() {

  //main menu choices
  inquirer.prompt([
    { type: "list", name: "mainChoices", message: "Please Select Action", choices: ["Add a new Department", "Add a New Role", "Add a new Employee", "View a listing of Departments", "View Employee Roles", "Update Employee Roles", "View Staff", "Exit"] }

  ])


    .then(response => {

      //switch statement that will call a function depending on which option a user selects
      switch (response.mainChoices) {
        case "View Employee Roles":
          viewRoles()
          break

        case "Add a new Department":
          newDept()
          break

        case "Add a New Role":
          newRole()
          break

        case "View a listing of Departments":
          deptList()
          break

        case "Update Employee Roles":
          updateRoles()
          break

        case "View Staff":
          viewStaff()
          break

        case "Add a new Employee":
          newEmployee()
          break

        //this is the ending option that will quit the application
        default: connection.end();

      }

    })
};

//function that will add a new department to the database. WORKS
function newDept() {
  inquirer.prompt([{ type: "input", name: "newDeptname", message: "Please enter name of Department you wish to create" },
  ])
    .then(response => {
//learned the SET query from tutor
      let query = "INSERT INTO department SET ?";
      connection.query(query, { name: response.newDeptname }, function (err, res) {
        if (err) throw err;
        console.log(response);
        console.log("New Department added to System");
        //executes query to show the updated list of departments
        deptList();
        connection.end();
        //executes function to show the main menu 
        mainMenu();
      });
    });
};

//function to pull a table listing all of the departments currently in database. WORKS
function deptList() {
  connection.query("SELECT name FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });

};

//function to update the role of an existing employee
function updateRoles() {


};
//function to see a table of all staff data. Will need to do an inner join
function viewStaff() {


};

function newEmployee() {


};

//function to create a new role in the database WORKS
function newRole() {
    connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.log(res);
    let departments = [];
    departments = res.map(dept => ({ id: dept.id, name: dept.name }));

    inquirer.prompt([{ type: "input", name: "newRolename", message: "Please enter name of employee role you wish to create" },
    { type: "input", name: "newRolesalary", message: "Please enter the new role's salary" },
    { type: "list", name: "newDepartment", message: "Please choose the department associated with the role", choices: departments.map(dept => ({ value: dept.id, name: dept.name })) }])

      .then(response => {

        let query = "INSERT INTO role SET ?";
        let newRole = { title: response.newRolename, salary: response.newRolesalary, department_id: response.newDepartment }
        connection.query(query, newRole, function (err, res) {
          if (err) throw err;
          console.log("New Role added to System");
          //executes query to show the updated list of roles
          viewRoles();
          //executes function to show the main menu 
          mainMenu();
        });
      });
  });
};
//function to show all roles currently in database. Uses a join to combine data from the department table so the item shown is the actual department and not the department ID. WORKS
function viewRoles() {
  connection.query("SELECT role.id, title as TITLE, salary as SALARY, department_id, name as DEPARTMENT_NAME FROM role LEFT JOIN department ON role.department_id = department.id", function (err, res) {
    if (err) throw err;
    console.table(res, ["TITLE", "SALARY", "DEPARTMENT_NAME"] );
    mainMenu();
    // connection.end()


  });

}



