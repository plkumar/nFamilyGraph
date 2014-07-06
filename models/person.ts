/// <reference path="..\typings\server.d.ts" />

import mongoose = require('mongoose');

var Schema = mongoose.Schema;

var personSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    middleName : String,
    dob: Date,
    age: Number,
    gender: String,
    children: [{
        "type": "ObjectId",
        "ref": "Person",
        "index": true,
        "required": true
    }],
    parents: [{
        "type": "ObjectId",
        "ref": "Person",
        "index": true,
        "required": true
    }],
    spouse: [{
        peopleid: Schema.Types.ObjectId,
        status: String
    }]
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()

personSchema.methods.findChildren = function(callback) {
    return this.db.model('Person').findById(this.children, callback);
};

personSchema.statics.findByfirstName = function(firstName, callback) {
    return this.find({
        firstName: firstName
    }, callback);
};

personSchema.methods.setParent= function(parentId, callback)
{
    this.parents.push(parentId);
    callback?this.save(callback):this.save();
};

personSchema.methods.setChildren = function (childId, callback)
{
    this.children.push(childId);
    (callback)?this.save(callback):this.save();
};

var Person = mongoose.model('Person', personSchema);

module.exports = {
  Person: Person
};