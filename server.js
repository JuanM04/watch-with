const path = require('path')
const next = require('next')
const routes = require('./utils/routes')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dir: '.', dev })
const nextHandler = routes.getRequestHandler(nextApp)

const PORT = process.env.PORT || 3000


io.on('connection', socket => {
  let room = socket.handshake.headers.referer.split('/')
  room = room[room.length - 1]

  socket.join(room)

  socket.on('emitStatus', data => socket.broadcast.to(room).emit('getStatus', data))
  socket.on('emitMedia', data => io.to(room).emit('getMedia', data))
})


nextApp.prepare().then(() => {
  app.get('/service-worker.js', (req, res) => {
    const filePath = path.join(__dirname, '.next', 'service-worker.js')

    nextApp.serveStatic(req, res, filePath)
  })

	app.get('*', (req, res) => {
		return nextHandler(req, res)
  })
  
	server.listen(PORT, err => {
		if (err) process.exit(0)
		console.log(`🚀 listening on port ${PORT}`)
	})
})