module.exports = (sequelize, DataTypes) => {

    // Model configuration
	let ScoreLog = sequelize.define('scoreLog', {
        id: {
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            type: DataTypes.UUID
        },
        score: {
            allowNull: false,
            defautlValue: 0,
            type: DataTypes.INTEGER
        },
    });

	// Model association
	ScoreLog.associate = (models) => {
        ScoreLog.belongsTo(models.user, { as: 'user', onDelete: 'cascade' });
	};

	// Return model
	return ScoreLog;

}