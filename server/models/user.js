module.exports = (sequelize, DataTypes) => {

    // Model configuration
	let User = sequelize.define('user', {
        id: {
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            type: DataTypes.UUID
        },
        display_name: {
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
            defautlValue: 0,
            type: DataTypes.INTEGER
        },
    }, {
        paranoid: true,
        indexes: [
            {
              unique: true,
              fields: ['display_name']
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