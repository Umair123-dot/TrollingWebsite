const rootSchema = require('./root');
const userSchema = require('./user');
const adminSchema = require('./admin');
const websiteSchema = require('./website');
module.exports = [rootSchema, userSchema, adminSchema, websiteSchema];
