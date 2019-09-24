module.exports = function(sequelize, Sequelize) {
    var User = sequelize.define('User', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        surname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            notEmpty: true,
            validate: {
                isUser: function ( value ) {
                  if ( !/[A-Za-z0-9]+/g.test(value) ) {
                    throw new Error('Username validation error!')
                  }
                },
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: '0'
        }
    });

    User.associate = function (models) {
        models.User.hasMany(models.Data1, {
          foreignKey: 'user_id',
          sourceKey: 'id'
        });
    };

    return User;
}