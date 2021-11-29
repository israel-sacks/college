const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Course = require('../models/Course');

const getCourses = async (req, res, next) => {

  let CoursesColection;
  try {
    CoursesColection = await Course.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Courses.',
      500
    );
    return next(error);
  }

  if (!CoursesColection || CoursesColection.length === 0) {
    const error = new HttpError(
      'Could not find a Courses.',
      404
    );
    return next(error);
  }

  res.json(
      CoursesColection.map(Course =>
      Course.toObject({ getters: true })
    )
  );
};

const getCourse = async (req, res, next) => {

  const CourseId = req.params.cid;

  let course;
  try {
    course = await Course.findById(CourseId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not find a Course.',
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError(
      'Could not find a Course for the provided id.',
      404
    );
    return next(error);
  }

  res.json( course.toObject({ getters: true }) );
};

const createCourse = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { CourseName } = req.body;

  const createdCourse = new Course({
    CourseName
  });

  try {
    await createdCourse.save();
  } catch (err) {
    const error = new HttpError(
      'Creating Course failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json(  createdCourse );
};

const updateCourse = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {  CourseName } = req.body;
  const CourseId = req.params.cid;

  let course;
  try {
    course = await Course.findById(CourseId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update Course.',
      500
    );
    return next(error);
  }

  course.CourseName = CourseName;


  try {
    await course.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update Course.',
      500
    );
    return next(error);
  }

  res.status(200).json(  course.toObject({ getters: true }) );
};

const deleteCourse = async (req, res, next) => {

  const CourseId = req.params.cid;

  let course;
  try {
    course = await Course.findById(CourseId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete Course.',
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError('Could not find Course for this id.', 404);
    return next(error);
  }

  try {
    await course.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete Course.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted Course.' });
};

exports.getCourses = getCourses;
exports.getCourse = getCourse;
exports.createCourse = createCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
