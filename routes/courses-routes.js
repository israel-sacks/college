const express = require('express');
const { check } = require('express-validator');

const CoursesControllers = require('../controllers/Courses-controllers');

const router = express.Router();


router.get('/', CoursesControllers.getCourses);


router.get('/:cid', CoursesControllers.getCourse);


router.post(
  '/',
  [
    check('CourseName')
      .not()
      .isEmpty()
  ],
  CoursesControllers.createCourse
);

router.put(
  '/:cid',
  [
    check('CourseName')
      .not()
      .isEmpty()
  ],
  CoursesControllers.updateCourse
);

router.delete('/:cid', CoursesControllers.deleteCourse);

module.exports = router;