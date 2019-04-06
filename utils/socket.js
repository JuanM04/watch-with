import openSocket from 'socket.io-client'
const socket = openSocket(process.env.SOCKET_ENDPOINT, { autoConnect: false })



export const connect = () => socket.open()
export const disconnect = () => socket.close()



export const emitStatus = data => socket.emit('emitStatus', data)
export const emitMedia = data => socket.emit('emitMedia', data)

export const getStatus = cb => socket.on('getStatus', cb)
export const getMedia = cb => socket.on('getMedia', cb)