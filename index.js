import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

import express from 'express'
import jwt from 'jsonwebtoken'

import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li></ul>'

const app = express()

const expossedPort = 1234

function autenticacionDeToken(req, res, next){
	const headerAuthorization = req.headers['authorization']

	const tokenRecibido = headerAuthorization.split(' ')[1]

	if (tokenRecibido == null){
		return res.status(401).json({message: 'Token invalido.'})
	}

	let payload = null 

	try {
		payload = jwt.verify(tokenRecibido, process.env.SECRET_KEY)
	} catch (error) {
		return res.status(401).json({message: 'Token invalido.'})
	}

	if (Date.now() > payload.exp){
		return res.status(401).json({message: 'Token caducado.'})
	}

	req.user = payload.sub

	next()
}

app.use((req, res, next) =>{
	if ((req.method !== 'POST') && (req.method !== 'PATCH')) { return next()}

	if (req.headers['content-type'] !== 'application/json') { return next()}

	let bodyTemporal = ''

	req.on('data', (chunk) => {
		bodyTemporal += chunk.toString()
	})

	req.on('end', () => {
		req.body = JSON.parse(bodyTemporal)

		next()
	})})


app.get('/', (req, res) => {
	res.status(200).send(html)
})

app.post('/auth', async (req,res) => {

	const usuarioABuscar = req.body.usuario
	const passwordRecibido = req.body.password

	let usuarioEncontrado = ''

	try {
		usuarioEncontrado = await Usuario.findAll({where:{usuario:usuarioABuscar}})

		if (usuarioEncontrado == ''){
			return res.status(400).json({message: 'Usuario no encontrado.'})  
		}
	} catch(error){
		return res.status(400).json({message: 'Usuario no encontrado.'})
	}

	if (usuarioEncontrado[0].password !== passwordRecibido) {
		return res.status(400).json({message: 'Contraseña incorrecta.'})
	}

	const sub = usuarioEncontrado[0].id
	const usuario = usuarioEncontrado[0].usuario
	const nivel = usuarioEncontrado[0].nivel

	const token = jwt.sign({
		sub,
		usuario,
		nivel,
		exp: Date.now() + (60 * 1000)
	}, process.env.SECRET_KEY)

	res.status(200).json({accessToken: token })
})

app.get('/', (req, res) => {
	res.status(200).send(html)
})

app.get('/usuarios', async (req, res) => {
	try {
		const usuarios = await Usuario.findAll()

		res.status(200).json(usuarios)
	} catch(error) {
		res.status(204).json({'message': error})
	}
})
	
app.get ('/usuarios/telefono/:id', async (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = await Usuario.findByPk(usuarioId)

		if(!usuarioEncontrado) {
			res.status(204).json({'message': 'Usuario no encontrado.'})
		}
		
		res.status(200).json({'Telefono': usuarioEncontrado.telefono})
	}
	catch(error) {
		res.status(204).json({message: error})
	}
})

app.get ('/usuarios/nombre/:id', async (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = await Usuario.findByPk(usuarioId)

		if(!usuarioEncontrado) {
			res.status(204).json({'message': 'Usuario no encontrado.'})
		}
		
		res.status(200).json({'Nombre': usuarioEncontrado.nombre})
	}
	catch(error) {
		res.status(204).json({message: error})
	}
})

app.get('/usuarios/:id', async (req,res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = await Usuario.findByPk(usuarioId)

		if(!usuarioEncontrado) {
			res.status(204).json({'message': 'Usuario no encontrado'})
		}

		res.status(200).json(usuarioEncontrado)
	} catch (error) {
		res.status(204).json({'message': error})
	}
})

app.post('/usuarios', autenticacionDeToken, async (req,res) => {
	try {
		const usuarioAGuardar = new Usuario (req.body)
		await usuarioAGuardar.save()

		res.status(201).json({'message': 'success'})
	}
	catch (error) {
		res.status(204).json({'message': 'error'})
	}
})

app.patch('/usuarios/:id', autenticacionDeToken, async (req,res) => {
	let idUsuarioAEditar = parseInt(req.params.id)

	try{
		let usuarioAActualizar = await Usuario.findByPk(idUsuarioAEditar)

		if (!usuarioAActualizar) {
			res.status(204).json({'message':'Usuario no encontrado'})
		}
		await usuarioAActualizar.update(req.body)

		res.status(200).send('Usuario actualizado.')

	} catch (error){
		res.status(204).json({'message':'Usuario no encontrado.'})
	}
})

app.delete ('/usuarios/:id', autenticacionDeToken, async (req, res) => {
	let idUsuarioABorrar = parseInt(req.params.id)
	try {
		let usuarioABorrar = await Usuario.findByPk(idUsuarioABorrar)
		if(!usuarioABorrar){
			return res.status(204).json({'message':'Usuario no encontrado.'})
		}

		await usuarioABorrar.destroy()
		res.status(200).json({'message':'Usuario borrado.'})
	} catch (error) {
		res.status(204).json({'message':'error'})
	}
})

app.get ('/productos/precio/:id', async (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = await Producto.findByPk(productoId)

		if(!productoEncontrado) {
			res.status(204).json({'message': 'Producto no encontrado'})
		}

		res.status(200).json({'Precio': productoEncontrado.precio})
	} catch (error) {
		res.status(204).json({'message': error})
	}
})

app.get ('/productos/nombre/:id', async (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = await Producto.findByPk(productoId)

		if(!productoEncontrado) {
			res.status(204).json({'message': 'Producto no encontrado'})
		}

		res.status(200).json({'Nombre': productoEncontrado.nombre})
	} catch (error) {
		res.status(204).json({'message': error})
	}
})

app.get ('/productos/total', async (req, res) => {
	try {
		const totalStock = await Producto.sum('precio')
	
		res.status(200).json({ 'totalStock': totalStock })
	} catch (error) {
		res.status(500).json({ 'message': error })
	}
})

app.use((req, res) => {
	res.status(404).send('404')
})

try {
	await db.authenticate()
	console.log ('Conexion con la DDBB establecida.')
} catch (error) {
	console.log ('Error de conexion DDBB.')
}

app.listen(expossedPort, () => {
	console.log('Servidor escuchando en http://localhost:' + expossedPort)
})