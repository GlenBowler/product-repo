'use strict'
module.exports = function (sequelize: any, DataTypes: any) {
    const product = sequelize.define(
        'product', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {

    }
    )
    product.associate = function (models: any) {
        product.belongsTo(models.user, { as: 'createdBy' , foreignKey: 'createdById' })
        product.belongsTo(models.user, { as: 'updatedBy' , foreignKey: 'updatedById' })

    }
    return product
}
