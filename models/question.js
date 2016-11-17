var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  description: {type: String}
});

var QuestionSchema = new Schema({
  title: {type: String, trim: true, require: true},
  description: {type: String, trim: true, require: true},
  answers: [AnswerSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema);
