'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: 'UserId' })
    }

    static getByUser(UserId) {
      const { User } = sequelize.models

      return Profile.findOne({
        where: {
          UserId: UserId
        },
        include: {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }
      })
    }
  }
  Profile.init({
    imageProfile: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image Profile required!"
        },
        notEmpty: {
          msg: "Image Profile required!"
        },
        isUrl: {
          msg: "Format URL gambar tidak valid"
        }
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Bio required!"
        },
        notEmpty: {
          msg: "Bio required!"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name required!"
        },
        notEmpty: {
          msg: "Name required1"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};