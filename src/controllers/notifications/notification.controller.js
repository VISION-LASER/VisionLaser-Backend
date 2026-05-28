const buildController = require('../crud.controller');
const notificationModel = require('../../models/notification.models');

module.exports = buildController(notificationModel, 'notification');
