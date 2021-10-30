import { Socket } from 'socket.io'

export const chatController = (socket: Socket, io) => {
    const createOrder = (payload) => {
        console.log('payload: ', payload)
    }

    const readOrder = (orderId) => {
        console.log('orderId: ', orderId)
    }

    socket.on('order:create', createOrder)
    socket.on('order:read', readOrder)
}
