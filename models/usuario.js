import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

const Usuario = db.define('Usuario', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
	nombre: { type: DataTypes.STRING},
	edad: {type: DataTypes.STRING},
	email: { type: DataTypes.STRING},
	telefono: { type: DataTypes.STRING},
},
{
	timestamps:false,
	tableName: 'usuarios'
})

export default Usuario