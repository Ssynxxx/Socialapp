'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require("bcryptjs")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { foreignKey: 'UserId' })
      User.hasMany(models.Post, { foreignKey: 'UserId' })
    }
  }
  User.init({
  username: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Email sudah terdaftar" },
    validate: {
      notNull: { 
        msg: "Email wajib diisi" 
      },
      notEmpty: { 
        msg: "Email wajib diisi" 
      },
      isEmail: { 
        msg: "Format email tidak valid" 
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { 
        msg: "Password wajib diisi" 
      },
      notEmpty: { 
        msg: "Password wajib diisi" 
      },
      len: { 
        args: [8, 100], 
        msg: "Password minimal 8 karakter" 
      }
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "buyer",
    validate: {
      isIn: { 
        args: [["buyer", "seller"]], 
        msg: "Role harus buyer atau seller" 
      }
    }
  }
}, {
  sequelize,
  modelName: 'User',
});
  User.beforeCreate((user) => {
    const salt = bcrypt.genSaltSync(8);
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash
  })

  return User;
};