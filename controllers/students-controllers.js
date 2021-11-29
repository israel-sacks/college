const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Student = require('../models/Student');

const getStudentByCategory = async (req, res, next) => {

  const courseId = req.params.cid;
 // console.log("get -> " + courseId  )
   if (courseId==="-1"){
    await Student.aggregate([
   
       { "$addFields": { "CourseId2": { "$toObjectId": "$CourseId" }}},
       { "$lookup": {
         "from": "courses",
         "localField": "CourseId2",
         "foreignField": "_id",
         "as": "output"
       }},
     {
           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$output", 0 ] }, "$$ROOT" ] } }
        },
        { $project: { output: 0 } }
     ]).exec((err,result)=>
     {
       if (err){
         console.log(err);
         const error = new HttpError(
           'Something went wrong, could not find a Students.',
           500
         );
         return next(error);
         }
       if(result)
       {
         res.json(result.map(student =>({
                 id: student._id,
                 CourseName: student.CourseName,
                 StudentName: student.StudentName,
                 Marks: student.Marks,})));
       }
     });
    }
   else{
      await Student.aggregate([
       {"$match":{"CourseId":courseId}},
         { "$addFields": { "CourseId2": { "$toObjectId": "$CourseId" }}},
         { "$lookup": {
           "from": "courses",
           "localField": "CourseId2",
           "foreignField": "_id",
           "as": "output"
         }},
       {
             $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$output", 0 ] }, "$$ROOT" ] } }
          },
          { $project: { output: 0 } }
       ]).exec((err,result)=>
       {
         if (err){
           console.log(err);
           const error = new HttpError(
             'Something went wrong, could not find a Students.',
             500
           );
           return next(error);
           }
         if(result)
         {
           res.json(result.map(student =>({
                   id: student._id,
                   CourseName: student.CourseName,
                   StudentName: student.StudentName,
                   Marks: student.Marks,})));
         }
       });}
};
const getStudent = async (req, res, next) => {

  const StudentId = req.params.sid;

  let student;
  try {
    student = await Student.findById(StudentId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Student.',
      500
    );
    return next(error);
  }

  if (!student) {
    const error = new HttpError(
      'Could not find a Student for the provided id.',
      404
    );
    return next(error);
  }

  res.json(student.toObject({ getters: true }) );
};

const createStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { StudentName, CourseId, Marks } = req.body;

  const createdStudent = new Student({
    StudentName,
    CourseId,
    Marks
  });
try{

    await createdStudent.save();
  } catch (err) {
    const error = new HttpError(
      'Creating Student failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json( createdStudent );
};

const updateStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {  StudentName, CourseId, Marks } = req.body;
  const StudentId = req.params.sid;

  let student;
  try {
    

      student = await Student.findById(StudentId);
  } catch (err) {
    console.log(err);
        const error = new HttpError(
      'Something went wrong, could not update Student.',
      500
    );
    return next(error);
  }

  student.StudentName = StudentName;
  student.CourseId = CourseId;
  student.Marks = Marks;

  try {
    await student.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update Student.',
      500
    );
    return next(error);
  }

  res.status(200).json( student.toObject({ getters: true }) );
};

const deleteStudent = async (req, res, next) => {

 
  const StudentId = req.params.sid;

  let student;
  try {
    student = await Student.findById(StudentId);
  
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete Student.',
      500
    );
    return next(error);
  }

  if (!student) {
    const error = new HttpError('Could not find Student for this id.', 404);
    return next(error);
  }

  try {
    await student.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete Student.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted Student.' });
};
exports.getStudentByCategory=getStudentByCategory;
//exports.getStudents = getStudents;
exports.getStudent = getStudent;
exports.createStudent = createStudent;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;
