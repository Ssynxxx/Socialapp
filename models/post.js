'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'UserId' })
      Post.belongsToMany(models.Tag, { through: models.PostTag })
    }

    static getById(id) {
      const { User } = sequelize.models
      return Post.findByPk(id, {
        include: { 
          model: User, 
          attributes: { 
            exclude: ['password'] 
          } 
        }
      })
    }

    isUserBy(userId) {
      return this.UserId === userId
    }
  }
  Post.init({
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'ImageUrl required!'
        },
        notEmpty: {
          msg: 'ImageUrl required!'
        },
        isUrl: { 
          msg: 'Format URL gambar tidak valid' 
        }
      }
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Caption required!'
        },
        notEmpty: {
          msg: 'Caption required!'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { 
          msg: 'Title required!' 
        },
        notEmpty: { 
          msg: 'Title required!' 
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};