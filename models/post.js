'use strict';
const {
  Model, Op
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
      const { User, Profile, Tag } = sequelize.models
      return Post.findByPk(id, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ['password']
            },
            include: Profile
          },
          Tag
        ]
      })
    }

    // dipakai beranda: pencarian (judul/caption), filter tag, dan urutan
    static async searchAndSort({ search, sort, tag } = {}) {
      const { User, Profile, Tag, PostTag } = sequelize.models
      const where = {}

      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { caption: { [Op.iLike]: `%${search}%` } }
        ]
      }

      const tagId = Number(tag)
      if (tag && Number.isInteger(tagId)) {
        const rows = await PostTag.findAll({ where: { TagId: tagId }, attributes: ['PostId'] })
        where.id = { [Op.in]: rows.map(r => r.PostId) }
      }

      let order = [['createdAt', 'DESC']]
      if (sort === 'oldest') order = [['createdAt', 'ASC']]
      if (sort === 'title') order = [['title', 'ASC']]

      return Post.findAll({
        where,
        order,
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] },
            include: Profile
          },
          Tag
        ]
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