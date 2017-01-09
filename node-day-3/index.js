var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv').config();

app.use(bodyParser.json());

Employee = require('./models/employee');

//Connect to mongoose
mongoose.connect('mongodb://localhost/Employee');
var db = mongoose.connection;

app.get('/', function (req, res) {
  res.send('Employee Crud Operation');
});

app.get('/api/employees', function (req, res) {
  Employee.getEmployees(function (err, employees) {
    if (err) {
      throw err;
    }
    res.json(employees);
  });
});


app.post('/api/employees', function (req, res) {
  var employee = req.body;
  Employee.addEmployee(employee, function (err, employee) {
    if (err) {
      throw err;
    }
    res.json(employee);
  });
});

app.get('/api/employees/:_id', function (req, res) {
  Employee.getEmployeeById(req.params._id, function (err, employee) {
    if (err) {
      throw err;
    }
    res.json(employee);
  });
});


app.put('/api/employees/:_id', function (req, res) {

  var id = req.params._id;
  var employee = req.body;  

  Employee.updateEmployee(id, employee, {}, function (err, employee) {
    if (err) {
      throw err;
    }
    res.json(employee);
  });
});


app.delete('/api/employees/:_id', function (req, res) {
  var id = req.params._id;

  Employee.deleteEmployee(id, {}, function (err, employee) {
    if (err) {
      throw err;
    }
    var response = {
      message: "Todo successfully deleted",
      id: req.params._id
    };
    res.json(response);
  });
});

app.listen(process.env.APP_PORT);
console.log('Running on port ', process.env.APP_PORT);