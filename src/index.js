const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const Joi = require('joi');
const port = 8080;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here
const students = require("./InitialData");
let arrayLength = students.length;
app.get("/api/student", (req, res) => {
  res.send(students);
});

app.get("/api/student/:id", (req, res) => {
  const id = req.params.id;
  const requestedStudentIndex = students.findIndex(
    (student) => student.id === parseInt(id)
  );
  if (requestedStudentIndex === -1) {
    res.status(404).send("Invalid id");
    return;
  }
  res.send(students[requestedStudentIndex]);
});

// const schema = Joi.object({
//    name : Joi.string().required(),
//    currentClass : Joi.number().required(),
//    division : Joi.string().required()
// })
app.post("/api/student", (req, res) => {
  const requestBody = req.body;
  // const validateObj = schema.validate(requestBody,{ convert: false });
  // if(validateObj.error){
  //     res.status(400).send();
  //     return;
  // }
  if (!requestBody.name || !requestBody.currentClass || !requestBody.division) {
    res.sendStatus(400);
  }
  const student = {
    id: arrayLength + 1,
    name: requestBody.name,
    currentClass: parseInt(requestBody.currentClass),
    division: requestBody.division
  };
  arrayLength++;
  students.push(student);
  //   const responseId = JSON.stringify({ id: student.id });
  //   res.send(responseId);
  res.send({ id: student.id });
});

app.put("/api/student/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.sendStatus(400);
    return;
  }
  const requestedStudentIndex = students.findIndex(
    (student) => student.id === id
  );
  if (requestedStudentIndex === -1) {
    res.sendStatus(400);
    return;
  }
  const requestBody = req.body;
  const requestedStudent = students[requestedStudentIndex];
  if (requestBody.name) {
    if (requestBody.name === "") {
      res.sendStatus(400);
      return;
    } else {
      requestedStudent.name = requestBody.name;
    }
  }
  if (requestBody.currentClass) {
    if (requestBody.currentClass === "") {
      res.sendStatus(400);
      return;
    } else {
      const updatedCurrentClass = requestBody.currentClass;
      requestedStudent.currentClass = parseInt(updatedCurrentClass);
    }
  }
  if (requestBody.division) {
    if (requestBody.division === "" || requestBody.division.length > 1) {
      res.sendStatus(400);
      return;
    } else {
      requestedStudent.division = requestBody.division;
    }
  }
  students.splice(requestedStudentIndex, 1, requestedStudent);
  // res.send(requestedStudent);
});

app.delete("/api/student/:id", (req, res) => {
  const id = req.params.id;
  const requestedStudentIndex = students.findIndex(
    (student) => student.id === parseInt(id)
  );
  if (requestedStudentIndex === -1) {
    res.sendStatus(404);
    return;
  }
  const requestedStudent = students[requestedStudentIndex];
  students.splice(requestedStudentIndex, 1);
  res.sendStatus(200);
});
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
