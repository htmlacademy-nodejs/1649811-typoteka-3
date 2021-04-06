'use strict';

const {Model, DataTypes} = require(`sequelize`);

class RefreshToken extends Model {}

const define = (sequelize) => {
  RefreshToken.init({
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: `RefreshToken`,
    tableName: `tokens`,
    timestamps: false,
  });

  return RefreshToken;
};

module.exports = define;
