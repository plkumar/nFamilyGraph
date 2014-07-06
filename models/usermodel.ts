/// <reference path=".\..\typings\server.d.ts" />

var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	SALT_WORK_FACTOR = 10;
exports.mongoose = mongoose;

// Database connect
var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/familygraph';

var mongoOptions = { db: { safe: true }};

mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) { 
    console.log ('ERROR connecting to : ' + uristring + '. ' + err);
    } else {
    console.log ('Successfully connected to : ' + uristring);
    }
});

//******* Database schema TODO add more validation
var Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

// User schema
var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    middlename: {type: String, required: false},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    facebookid : {type: String, unique: true },
    isactive : {type:Boolean, default:true},
    admin: { type: Boolean, required: true },
    accessToken : {type:String}
});


// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword: String, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

userSchema.methods.generateRandomToken = function () {
    var chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        token = new Date().getTime() + '_';
    for ( var x = 0; x < 16; x++ ) {
        var i = Math.floor( Math.random() * 62 );
        token += chars.charAt( i );
    }
    return token;
};

userSchema.statics.randomPassword = function(length:Number)
{
    if(!length)
        length = 15;

    var chars:String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$";
    var pass: String = "";
    var x: number = 0;
    var i: number = 0;
    for(x=0;x<length;x++)
    {
    i = Math.floor(Math.random() * 62);
    pass += chars.charAt(i);
    }
    return pass;
}

// Export user model
var userModel = mongoose.model('User', userSchema);
exports.userModel = userModel;
