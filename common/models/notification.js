'use strict';

var axios = require('axios');

module.exports = function(Notification) {
  Notification.sendNotification = function(to, title, body, dataObject, cb) {
        // Performing a GET request
    axios.post('https://exp.host/--/api/v2/push/send', {
      'to': to, // "ExponentPushToken[iz6yPFDxB5FGLP0DIxgoG1]",
      'title': title,
      'body': body,
      'data': dataObject,
    }).then(function(response) {
            // console.log(error);
      cb(null, response.data);
    }).catch(error => {
            // console.log(error);
      cb(null, error);
    });
  };

  Notification.remoteMethod(
        'sendNotification', {
          http: {
            path: '/sendNotification',
            verb: 'post',
          },
          accepts: [
            {
              arg: 'to',
              type: 'string',
            }, {
              arg: 'title',
              type: 'string',
            }, {
              arg: 'body',
              type: 'string',
            }, {
              arg: 'dataObject',
              type: 'any',
            }],
          returns: {
            arg: 'status',
            type: 'bool',
          },
        }
    );
};
