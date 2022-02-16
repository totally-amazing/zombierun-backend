const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const config = require('../config');

exports.connectDB = () => {
  mongoose.connect(config.db.host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

exports.useVirtualId = (schema) => {
  schema.virtual('id').get(function getId() {
    return this._id.toString();
  });
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
};

exports.validateUnique = (schema) => {
  schema.plugin(uniqueValidator);
};
