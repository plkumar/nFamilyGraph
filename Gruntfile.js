var db = require('./models/user');

module.exports = function(grunt) {

  grunt.registerTask('dbseed', 'seed the database', function() {
    grunt.task.run('adduser:lakshman:peethani:admin:admin@example.com:secret:true');
    grunt.task.run('adduser:bob:wolmer:bob:bob@example.com:secret:false');
    grunt.task.run('adduser:lux:peethani:lakshman:lakshman@example.com:secret:false');
  });

  grunt.registerTask('adduser', 'add a user to the database', function(usr, firstname, lastname, emailaddress, pass, adm) {
    // convert adm string to bool
    adm = (adm === "true");

    var user = new db.userModel({ username: usr
                , firstname : firstname
                , lastname : lastname
				, email: emailaddress
				, password: pass
				, admin: adm });

    // save call is async, put grunt into async mode to work
    var done = this.async();

    user.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
        done(false);
      } else {
        console.log('saved user: ' + user.username);
        done();
      }
    });
  });

  grunt.registerTask('dbdrop', 'drop the database', function() {
    // async mode
    var done = this.async();

    db.mongoose.connection.on('open', function () {
      db.mongoose.connection.db.dropDatabase(function(err) {
        if(err) {
          console.log('Error: ' + err);
          done(false);
        } else {
          console.log('Successfully dropped db');
          done();
        }
      });
    });
  });

};
