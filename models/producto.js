import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

const Producto = db.define('Producto', 
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
		nombre:{ type: DataTypes.STRING},
		tipo:{ type: DataTypes.STRING},
		precio:{ type: DataTypes.DOUBLE}
	},
	{
		tableName:'productos',
		timestamps: false
	}
)

export default Producto