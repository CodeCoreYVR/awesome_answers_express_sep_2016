var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  title: {type: String, trim: true, require: true},
  description: {type: String, trim: true, require: true}
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema);
