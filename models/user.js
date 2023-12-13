const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
    let user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        if (isMatch) {
            // Passwords match
            const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY); // Sign the token with the user's _id and your secret key
            cb(null, isMatch, token); // Pass the token along with the isMatch flag
        } else {
            // Passwords don't match
            cb(null, isMatch);
        }
    });
};

let User = mongoose.model('User', UserSchema);

module.exports = User;
