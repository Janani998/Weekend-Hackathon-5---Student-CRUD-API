const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Joi = require("joi");
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

const schema = Joi.object({
  name: Joi.string().required(),
  currentClass: Joi.number().required(),
  division: Joi.string().required()
});
app.post("/api/student", (req, res) => {
  const requestBody = req.body;
  const validateObj = schema.validate(requestBody, { convert: false });
  if (validateObj.error) {
    res.status(400).send("Data sent is incomplete");
    return;
  }
  const student = {
    id: arrayLength + 1,
    name: requestBody.name,
    currentClass: requestBody.currentClass,
    division: requestBody.division
  };
  arrayLength = student.id;
  students.push(student);
  res.send({ id: student.id });
});

app.put("/api/student/:id", (req, res) => {
  const id = req.params.id;
  const requestedStudentIndex = students.findIndex(
    (student) => student.id === parseInt(id)
  );
  if (requestedStudentIndex === -1) {
    res.status(404).send("Invalid id");
    return;
  }
  const requestBody = req.body;
  const requestedStudent = students[requestedStudentIndex];
  if (!requestedStudent.name || requestBody.name === "") {
    res.status(400).send("Data sent is incomplete");
    return;
  }
  requestedStudent.name = requestBody.name;
  res.send(requestedStudent);
});

app.delete("/api/student/:id", (req, res) => {
  const id = req.params.id;
  const requestedStudentIndex = students.findIndex(
    (student) => student.id === parseInt(id)
  );
  if (requestedStudentIndex === -1) {
    res.status(404).send("Invalid id");
    return;
  }
  const requestedStudent = students[requestedStudentIndex];
  students.splice(requestedStudentIndex, 1);
  res.send(requestedStudent);
});
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
