var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       = require('../models/User');
// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      console.log('in serializeUser '+user)
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      console.log('in deserializeUser')
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
          //check email domain
          const email = profile.emails[0].value;
          const domain = email.substring(email.indexOf("@") + 1);
          if(domain!="brandeis.edu"){
            return done(null, false, { message: 'Please log in with a Brandeis account.' });
          }
          
           console.log("looking for userid")
            // try to find the user based on their google id
            User.findOne({ 'googleid' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    console.log(`the user was found ${user}`)
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    console.log(`we need to create a new user`)
                    console.dir(profile)
                    // if the user isnt in our database, create a new user
                    var newUser
                     = new User(
                         {googleid: profile.id,
                          googletoken: token,
                          googlename:profile.displayName,
                          googleemail:profile.emails[0].value,
                        });

                    // save the user
                    newUser.save(function(err) {
                      console.log("saving the new user")
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};
