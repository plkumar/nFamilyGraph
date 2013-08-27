/// <reference path="nodelib/node.js" />

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Person = require('./models/person').Person;

//mongoose.set('debug', true)
mongoose.connect('mongodb://localhost/familygraph');
//mongoose.connect('mongodb://familytree:Budugu123@ds051997.mongolab.com:51997/familytree');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    // yay!
});


var annapoorna = new Person({
    firstName: 'Annapoorna',
    gender: 'F',
    children: [],
    parents: []
});
var krishna = new Person({
    firstName: 'Krishna',
    gender: 'M',
    children: [],
    parents: []
});
var udaya = new Person({
    firstName: 'Udaya',
    gender: 'M',
    children: [],
    parents: []
});
var lakshman = new Person({
    firstName: 'Lakshman',
    gender: 'M',
    children: [],
    parents: []
});
var hasini = new Person({
    firstName: 'Hasini',
    gender: 'F',
    children: [],
    parents: []
});

annapoorna.save(function(err, annapoorna) {
    
    if(err){
        console.log(err);
        process.exit(1);
    }

    krishna.spouse.push({
        status: 'married',
        peopleid: annapoorna._id
    });

    krishna.save(function(err, krishna) {
        // TODO handle the error
        if (krishna) {
            annapoorna.spouse.push({
                status: 'married',
                peopleid: krishna._id
            });
            annapoorna.save();

            lakshman.save(function(err, lakshman) {
                
                hasini.parents.push(lakshman._id);
                hasini.save(function (err, hasini){
                    hasini.setParent(lakshman._id);
                });

                krishna.setChildren(lakshman._id);
                annapoorna.setChildren(lakshman._id);
            });

            lakshman.setParent(krishna._id);
            lakshman.setParent(annapoorna._id);
            
            udaya.save(function(err, udaya) {
                krishna.setChildren(udaya._id);
                annapoorna.setChildren(udaya._id);
            });
            
            udaya.setParent(krishna._id);
            udaya.setParent(annapoorna._id);
            
        }

    });
});


setTimeout(function() {

    var path =[];

    function personCallback(err, person){
        if(!err)
        {
            console.log(person.firstName);
            path.push(person.firstName);

            if(person.parents.length >0){
                Person.findOne({_id:person.parents.pop()}, personCallback);
            }else{
                console.log(path.join('/'));
            }
        }
    }

    Person.findOne({firstName:'Hasini'}, personCallback);

}, 3000);

// Person.findById('51713e7e2a2ccd901c000001',function(err,obj){
// console.log('\n\nTesting..............\n\n\n');
// console.log(obj);
// })
//Person.find({ firstName: /^fluff/ }, function(err, Persons){
// if(!err){
// console.log(Persons);
// }
//});