module.exports = function(sequelize, Sequelize) {
    let Data1 = sequelize.define('Data1', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        sequence: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        wildtype: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        position: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        mutation: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        ddg: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        temp: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        ph: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        approved: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    });

    Data1.associate = function (models) {
        models.Data1.belongsTo(models.User, {
          foreignKey:'user_id',
          targetKey: 'id'
        });
    };

    return Data1;
}