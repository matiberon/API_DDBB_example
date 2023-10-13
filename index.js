import { createRequire } from 'node:module'
import express from 'express'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')
const app = express()
const expossedPort = 1234
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li></ul>'

app.get('/', (req, res) => {
	res.status(200).send(html)
})

app.get('/usuarios', (req, res) => {
	const usuarios = datos.usuarios
	res.status(200).json(usuarios)
})

app.get ('/usuarios/telefono/:id', (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

		if(!usuarioEncontrado) {
			res.status(204).json({'message': 'Usuario no encontrado.'})
		}
		
		res.status(200).json({'Telefono': usuarioEncontrado.telefono})
	}
	catch(error) {
		res.status(204).json({message: error})
	}
})

app.get ('/usuarios/nombre/:id', (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

		if(!usuarioEncontrado) {
			res.status(204).json({'message': 'Usuario no encontrado.'})
		}
		
		res.status(200).json({'Nombre': usuarioEncontrado.nombre})
	}
	catch(error) {
		res.status(204).json({message: error})
	}
})

app.get('/usuarios/:id', (req,res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

		if(!usuarioEncontrado) {
			res.status(204).json({'message': 'Usuario no encontrado'})
		}

		res.status(200).json(usuarioEncontrado)
	} catch (error) {
		res.status(204).json({'message': error})
	}
})

app.post('/usuarios', (req,res) => {
	try {
		let bodyTemp = ''

		req.on('data', (chunk) => {
			bodyTemp += chunk.toString()
		})

		req.on('end', () => {
			const data = JSON.parse(bodyTemp)
			req.body = data
			datos.usuarios.push(req.body)
		})

		res.status(201).json({'message': 'success'})
	}
	catch (error) {
		res.status(204).json({'message': 'error'})
	}
})

app.patch('/usuarios/:id', (req,res) => {
	let idUsuarioAEditar = parseInt(req.params.id)
	let usuarioAActualizar = datos.usuarios.find((usuario) => usuario.id === idUsuarioAEditar)

	if (!usuarioAActualizar) {
		res.status(204).json({'message':'Usuario no encontrado'})
	}

	let bodyTemp = ''

	req.on('data', (chunk) => {
		bodyTemp += chunk.toString()
	})

	req.on('end', () => {
		const data = JSON.parse(bodyTemp)
		req.body = data

		if (data.nombre){
			usuarioAActualizar.nombre = data.nombre
		}

		if (data.edad){
			usuarioAActualizar.edad = data.edad
		}

		if (data.email){
			usuarioAActualizar.email = data.email
		}

		if (data.telefono){
			usuarioAActualizar.telefono = data.telefono
		}

		res.status(200).send('Usuario actualizado')
	})
})

app.delete ('/usuarios/:id', (req, res) => {
	let idUsuarioABorrar = parseInt(req.params.id)
	let usuarioABorrar = datos.usuarios.find((usuario) => usuario.id === idUsuarioABorrar)

	if (!usuarioABorrar){
		res.status(204).json({'message':'Usuario no encontrado'})
	}

	let indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar)
	try {
		datos.usuarios.splice(indiceUsuarioABorrar, 1)
		res.status(200).json({'message': 'success'})
	}

	catch (error) {
		res.status(204).json({'message': 'error'})
	}
})

app.get ('/productos/precio/:id', (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

		if(!productoEncontrado) {
			res.status(204).json({'message': 'Producto no encontrado'})
		}

		res.status(200).json({'Precio': productoEncontrado.precio})
	} catch (error) {
		res.status(204).json({'message': error})
	}
})

app.get ('/productos/nombre/:id', (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

		if(!productoEncontrado) {
			res.status(204).json({'message': 'Producto no encontrado'})
		}

		res.status(200).json({'Nombre': productoEncontrado.nombre})
	} catch (error) {
		res.status(204).json({'message': error})
	}
})

app.get ('/productos/total', (req, res) => {
	try {
		const totalStock = datos.productos.reduce((total, producto) => total + producto.precio, 0)
	
		res.status(200).json({ 'totalStock': totalStock })
	} catch (error) {
		res.status(500).json({ 'message': error })
	}
})

app.use((req, res) => {
	res.status(404).send('404')
})

app.listen(expossedPort, () => {
	console.log('Servidor escuchando en http://localhost:' + expossedPort)
})

