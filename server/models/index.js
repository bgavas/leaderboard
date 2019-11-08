const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = require('./../db/connectDb');

// Empty model object
let models = {};

// Get files
const files = fs
    // Get file names in this directory as an array
    .readdirSync(__dirname)
    // Filter files
    .filter(fileName => fileName !== 'index.js' && fileName.indexOf('.js') > -1)
    // Delete extensions
    .map(fileName => fileName.replace('.js', ''));

// Instantiate models
files.forEach(fileName => models[fileName] = require('./' + fileName)(sequelize, Sequelize));

// Associate models
Object.keys(models).forEach(model => models[model].associate(models));

// Add sequelize to models
models.sequelize = sequelize;
models.Op = Sequelize.Op;

// Export models
module.exports = models;