'use strict';

var moment = require('moment');

module.exports = function(History) {
  History.observe('after save', function(ctx, next) {
    if (ctx.instance) {
      console.log('Saved %s#%s', ctx.Model.modelName, ctx.instance.refNumber);

      var app = ctx.Model.app;

      var Incidents = app.models.Incident;

      app.models.Incident.upsertWithWhere({refNumber: ctx.instance.refNumber}, {
          updatedOn: new Date(),
        }, function(err, res) {

          });
    } else {
      console.log('Updated %s matching %j',
                ctx.Model.pluralModelName,
                ctx.where);
    }
    next();
  });
};
