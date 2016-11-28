var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
  email: {type: String, required: true, trim: true, unique: true},
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true},
  password: {type: String, required: true}
}, {
  timestamps: true
});

UserSchema.methods.validPassword = function(password) {
  // TODO: use hashed password using BCrypt or similar
  return password === this.password;
}

var User = mongoose.model('User', UserSchema);

module.exports = User;
