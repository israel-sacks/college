const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const StudentSchema = new Schema({
    StudentName: { type: String, required: true },
    CourseId: { type: String, required: true },
    Marks: { type: Number, required: true },
});

module.exports = mongoose.model('Student', StudentSchema);