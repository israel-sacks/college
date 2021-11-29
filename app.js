const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');


const CoursesRoutes = require('./routes/Courses-routes');
const StudentsRoutes = require('./routes/Students-routes');
const HttpError = require('./models/http-error');

const app = express();
const https = require('http');



var server = https.createServer(app);
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, PublicKey'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');

  next();
});

app.use('/Courses', CoursesRoutes);
app.use('/Students', StudentsRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect('mongodb://israel:sara1000@localhost:27017/college?retryWrites=true',{useNewUrlParser: true,useUnifiedTopology:true})
  .then(() => {
 
    app.listen(6501);
  })
  .catch(err => {
    console.log(err);
  });