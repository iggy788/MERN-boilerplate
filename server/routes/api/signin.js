const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
  // app.get('/api/counters', (req, res, next) => {
  // 	Counter.find()
  // 		.exec()
  // 		.then((counter) => res.json(counter))
  // 		.catch((err) => next(err));
  // });

  // app.post('/api/counters', function (req, res, next) {
  // 	const counter = new Counter();

  // 	counter.save()
  // 		.then(() => res.json(counter))
  // 		.catch((err) => next(err));
  // });

  /*
   * Sign Up Route
   */
  app.post('/api/account/signup', function (req, res, next) {
    const {
      body
    } = req;

    const {
      firstName,
      lastName,
      password
    } = body;

    let {
      email
    } = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error: First Name Cannot be Blank!'
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: 'Error: Last Name Cannot be Blank!'
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email Cannot be Blank!'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password Cannot be Blank!'
      });
    }
    email = email.toLowerCase();

    // Steps:
    // 1. Verify Email Doesn't Exist
    // 2. Save
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Account Already Exists!'
        });
      }

      // Save New User
      const newUser = new User();

      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server Error'
          });
        }
        return res.send({
          success: true,
          message: 'Signed Up!'
        });
      });
    });
  });
  /*
   * Sign Up Route
   */

  /*
   * Sign In Route
   */
  app.post('/api/account/signin', function (req, res, next) {

    const {
      body
    } = req;

    const {
      password
    } = body;

    let {
      email
    } = body;

	  if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email Cannot be Blank!'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password Cannot be Blank!'
      });
    }

    email = email.toLowerCase();

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid Password!'
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid Password!'
        });
      }

      // Otherwise Correct Password Entered Associated to User
      const userSession = new UserSession();
      userSession.userID = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server Error'
          });
        }

        return res.send({
          success: true,
          message: 'Valid Sign In',
          token: doc._id
        });
      });
      /*
       * End Sign In Route
       */
    });
  });
};
