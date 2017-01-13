var mongoose = require('mongoose');

//Employee Schema
var employeeSchema = mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        index: true
    },
    LastName: {
        type: String,
        required: true
    },
    Age: {
        type: Number
    },
});

var Employee = module.exports = mongoose.model('Employee', employeeSchema);


//Get Employees 
module.exports.getEmployees = function (callback, limit) {
    Employee.find(callback).limit(limit);
}


//Get Employee by Id 
module.exports.getEmployeeById = function (id, callback) {
    Employee.findById(id, callback);
}

//Add Employee 
module.exports.addEmployee = function (employee, callback) {
    Employee.create(employee, callback);
}

//Update Employee
module.exports.updateEmployee = function (id, employee, options, callback) {
    var query = { _id: id };
    var update = {
        FirstName: employee.FirstName,
        LastName: employee.LastName,
        Age: employee.Age
    }
    Employee.findOneAndUpdate(query, update, options, callback);
}


//Delete Employee 
module.exports.deleteEmployee = function (id, options, callback) {
    var query = { _id: id };
    Employee.findByIdAndRemove(query, options, callback);
}