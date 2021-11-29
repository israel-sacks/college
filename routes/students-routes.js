const express = require('express');
const { check } = require('express-validator');



const StudentsControllers = require('../controllers/Students-controllers');

const router = express.Router();


router.get('/:cid', StudentsControllers.getStudentByCategory);

router.get('/edit/:sid', StudentsControllers.getStudent);

router.post(
  '/',
  [
    check('StudentName')
      .not()
      .isEmpty(),
    check('CourseId')
      .not()
      .isEmpty(),
    check('Marks')
      .not()
      .isEmpty()
  ],
  StudentsControllers.createStudent
);

router.put(
  '/:sid',
  [
    check('StudentName')
      .not()
      .isEmpty(),
    check('CourseId')
      .not()
      .isEmpty(),
    check('Marks')
      .not()
      .isEmpty()
  ],
  StudentsControllers.updateStudent
);

router.delete('/:sid', StudentsControllers.deleteStudent);

module.exports = router;