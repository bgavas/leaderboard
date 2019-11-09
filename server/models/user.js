module.exports = (sequelize, DataTypes) => {

    // Model configuration
	let User = sequelize.define('user', {
        id: {
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            type: DataTypes.UUID
        },
        displayName: {
            allowNull: false,
            notEmpty: true,
            type: DataTypes.STRING
        },
        country: {
            allowNull: false,
            notEmpty: true,
            type: DataTypes.STRING
        },
        score: {
            allowNull: false,
            defaultValue: 0,
            type: DataTypes.INTEGER
        },
    }, {
        paranoid: true,
        indexes: [
            {
              unique: true,
              fields: ['displayName']
            }
        ]
    });

	// Model association
	User.associate = (models) => {
        User.hasMany(models.scoreLog, { as: 'scoreLogs', onDelete: 'cascade' });
	};

	// Return model
	return User;

}