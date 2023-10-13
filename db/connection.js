import { Sequelize } from 'sequelize'

const db = new Sequelize(
	'eqrppxxa',
	'eqrppxxa',
	'qJkeHUnI21NdnSs-8LEtXWq3g-sG-LUa',
	{
		host: 'silly.db.elephantsql.com',
		dialect: 'postgres',
		logging: true
	})

export default db