'use strict';

var moment = require('moment');

var axios = require('axios');

var app = require('../../server/server');

module.exports = function(Visitor) {
  var context;

  Visitor.getSummaryOfVisitors = function(cb) {
    Visitor.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection('Visitor');
      var status = Visitor.getDataSource().ObjectID(status);
      collection.aggregate([
        {
          $match: {
            status: status,
          },
        },
        {
          $group: {
            _id: status,
            total: {
              $sum: 1,
            },
          },
        },
      ], function(err, instance) {
        if (err)
          console.log(err);

        console.log(instance);
        cb(null, instance);
      });
    });
  };

  Visitor.getVisitorsByvisitorStatusType = function(cb) {
    Visitor.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection('Visitor');

      collection.aggregate({
        $group: {
          _id: {
            $month: '$datecheckedin',
          },
          count: {
            $sum: '$visitorStatusId',
          },
        },
      }, function(err, instance) {
        if (err)
          console.log(err);

        console.log(instance);
        cb(null, instance);
      });
    });
  };

  Visitor.getSummaryOfVisitorsByStatus = function(cb) {
    Visitor.getDataSource().connector.connect(function(err, db) {
      var collection = db.collection('Visitor');

      collection.aggregate({
        $group: {
          _id: {
            $month: '$datecheckedin',
          },
          count: {
            $sum: '$statusId',
          },
        },
      }, function(err, instance) {
        if (err)
          console.log(err);

        console.log(instance);
        cb(null, instance);
      });
    });
  };

  Visitor.sendNotification = function(to, title, body, dataObject, cb) {
        // Performing a GET request
    axios.post('https://exp.host/--/api/v2/push/send', {
      'to': to, // "ExponentPushToken[iz6yPFDxB5FGLP0DIxgoG1]",
      'title': title,
      'sound': 'default',
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

  Visitor.remoteMethod(
        'getVisitorsByStatusId', {
          http: {
            path: '/getVisitorsByStatusId',
            verb: 'get',
          },
          accepts: {
            arg: 'id',
            type: 'string',
            http: {
              source: 'query',
            },
          },
          returns: {
            arg: 'VisitorsByStatus',
            type: 'string',
          },
        }
    );

  Visitor.remoteMethod(
        'getSummaryOfVisitors', {
          http: {
            path: '/getSummaryOfVisitors',
            verb: 'get',
          },
          returns: {
            arg: 'SummaryOfVisitors',
            type: 'string',
          },
        }
    );

  Visitor.remoteMethod(
        'getVisitorsByvisitorStatusType', {
          http: {
            path: '/getVisitorsByvisitorStatusType',
            verb: 'get',
          },
          returns: {
            arg: 'VisitorsByvisitorStatusType',
            type: 'string',
          },
        }
    );

  Visitor.remoteMethod(
        'getSummaryOfVisitorsByStatus', {
          http: {
            path: '/getSummaryOfVisitorsByStatus',
            verb: 'get',
          },
          returns: {
            arg: 'SummaryOfVisitorsByStatus',
            type: 'string',
          },
        }
    );

  Visitor.remoteMethod(
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
              type: 'string',
            }],
          returns: {
            arg: 'status',
            type: 'bool',
          },
        }
    );

    // Visitor.saveIndident = function (imageString, refNumber, cb) {
  Visitor.saveVisitor = function(visitor, cb) {
    var VisitorImages = app.models.VisitorImages;

    VisitorImages.create({
      'imageString': visitor.imageString,
    }, function(err, createdVisitor) {
      console.log(createdVisitor.id);

      Visitor.create({
        'fullname': visitor.fullname,
        'visitorstatus': visitor.visitorstatus,
        'company': visitor.company,
        'visitortype': visitor.visitortype,
        'host': visitor.host,
        'idnumber':visitor.idnumber,
        'datecheckedin': visitor.datecheckedin,
        'reportedBy': visitor.reportedBy,
        'idtype': visitor.idtype,
        'datesignedin': visitor.datesignedin,
        'datesignedout': visitor.datesignedout,
        'laptopserialnumber': visitor.laptopserialnumber,
        'carreg': visitor.carreg,
        'carcolor': visitor.carcolor,
        'carvin': visitor.carvin,
        'carmake': visitor.carmake,
        'carmodel': visitor.carmodel,
        'expirydate': visitor.expirydate,
        'driverexpirydate': visitor.driverexpirydate,
        'floorid': visitor.floorid,
        'deviceid': visitor.deviceid,
        'mobileno': visitor.mobileno,
        'image': visitor.image,
        'AccesscontroluserId': visitor.AccesscontroluserId,
      }, function(err, visitor) {
        if (err)
          console.log(err);

        cb(null, visitor);
      });
    });
  };

  Visitor.remoteMethod(
        'saveVisitor', {
            /* accepts: [
                {
                    arg: 'category',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'visitorStatus',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'company',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'description',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'reportedBy',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'capturedBy',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'status',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'channel',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'deviceId',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'location',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'lat',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'lot',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'mobileno',
                    type: 'string',
                    required: true
                     },
                {
                    arg: 'images',
                    type: 'string',
                    required: true
                     }], */
          accepts: {arg: 'visitor', type: 'Object', required: true},
          http: {path: '/saveVisitor', verb: 'post'},
          returns: {arg: 'visitor', type: 'Object'},
        });
};
