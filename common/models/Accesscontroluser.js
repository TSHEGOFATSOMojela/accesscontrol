'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Accesscontroluser) {
    // send verification email after registration
  Accesscontroluser.afterRemote('create', function(context, user, next) {
    var url = 'http://controlapi.herokuapp.com:46337/api/Accesscontrolusers/confirm?uid=' + user.uid;

    var html = 'Click <a href="' + url + '?access_token=' +
            user.verificationToken + '">here</a> to reset your password';

    var options = {
      type: 'email',
      to: user.email,
      from: 'support@greenlink.co.za',
      subject: 'Thanks for registering.',
      redirect: '/verified',
      user: Accesscontroluser,
      html: html,
    };

    user.verify(options, function(err, response) {
      if (err) {
        Accesscontroluser.deleteById(user.id);
        return next(err);
      }

      next();
    });
  });

    // Method to render
  Accesscontroluser.afterRemote('prototype.verify', function(context, user, next) {
    context.res.render('response', {
      title: 'A Link to reverify your identity has been sent ' +
                'to your email successfully',
      content: 'Please check your email and click on the verification link ' +
                'before logging in',
      redirectTo: '/',
      redirectToLinkText: 'Log in',
    });
  });

    // send password reset link when requested
  Accesscontroluser.on('resetPasswordRequest', function(info) {
        // var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var url = 'controlapi.herokuapp.com/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
            info.accessToken.id + '">here</a> to reset your password';

    Accesscontroluser.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html,
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

    // render UI page after password change
  Accesscontroluser.afterRemote('changePassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password changed successfully',
      content: 'Please login again with new password',
      redirectTo: '/',
      redirectToLinkText: 'Log in',
    });
  });

    // render UI page after password reset
  Accesscontroluser.afterRemote('setPassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password reset success',
      content: 'Your password has been reset successfully',
      redirectTo: '/',
      redirectToLinkText: 'Log in',
    });
  });

  Accesscontroluser.getAdminUserList = function(cb) {
    Accesscontroluser.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection('Accesscontroluser');

      collection.find({
        isDesktopUse: true,
      }, function(err, instance) {
        if (err)
          console.log(err);

        cb(null, instance);
      });
    });
  };

  Accesscontroluser.getAccesscontroluserList = function(cb) {
//        Accesscontroluser.getDataSource().connector.connect(function (err, db) {
//            var collection = db.collection('Accesscontroluser');
//
//            collection.find({fields:{payNumber: true, idNumber: true, username: true, fullname: true, address: true, company: true}}, function (err, instance) {
//
//                if (err)
//                    console.log(err);
//
//                cb(null, instance);
//            });
//        })

    Accesscontroluser.find({fields: {payNumber: true, idNumber: true, username: true, fullname: true, address: true, company: true}}, function(err, Accesscontrolusers) {
      cb(null, Accesscontrolusers);
    });
  };

  Accesscontroluser.resetAccesscontroluserPassword = function(email, cb) {
    Accesscontroluser.findOne({
      where: {
        username: email,
      },
    }, function(err, res) {
      if (err) return console.log(' error changing password' + err);

      console.log('username is ' + res.id);

      Accesscontroluser.setPassword(res.id, 'Tshwane123@!', function(err, instance) {
        if (err) return console.log(' error changing password' + err);

        var html = 'New Password is Tshwane123@!';

        Accesscontroluser.app.models.Email.send({
          to: email,
          from: 'support@pulego.co.za',
          subject: 'New Password',
          html: html,
        }, function(err) {
          if (err) return console.log('> error sending password reset email');
          console.log('> sending password reset email to:', email);
        });
      });

      cb(err, res);
    });
  };

  Accesscontroluser.remoteMethod('resetAccesscontroluserPassword', {
    accepts: {
      arg: 'email',
      type: 'string',
    },
    returns: {
      arg: 'user',
      type: 'string',
    },
    http: {
      path: '/resetAccesscontroluserPassword',
      verb: 'post',
    },
  });

  Accesscontroluser.remoteMethod(
        'getAdminUserList', {
          http: {
            path: '/getAdminUserList',
            verb: 'get',
          },
          returns: {
            arg: 'ListOfAdminUsers',
            type: 'object',
          },
        }
    );

  Accesscontroluser.remoteMethod(
        'getAccesscontroluserList', {
          http: {
            path: '/getAccesscontroluserList',
            verb: 'get',
          },
          returns: {
            arg: 'ListOfAccesscontrolusers',
            type: 'object',
          },
        }
    );
};
