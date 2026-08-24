import { orderModel } from "../../../databases/models/order.model.js"

export const orderSocket = (io) => {

    io.on('connection', (socket) => {
        console.log(`user connected ${socket.id}`)

        // Customer joins his Order Room
        socket.on('joinOrder', (orderId) => {
            socket.join(`order:${orderId}`)
            console.log(`${socket.id} joined order:${orderId}`)
        })

        // Staff joins Staff Room
        socket.on('joinStaff', () => {
            socket.join('staff')
            console.log(`${socket.id} joined staff room`)
        })

        // Customer requests cancellation
        socket.on('cancelOrderRequest', async (data) => {
            const { orderId, reason } = data
            const order = await orderModel.findById(orderId)
            if (!order) return

            if (!['pending', 'accepted'].includes(order.status)) {
                return socket.emit('cancellationRejected', { orderId, reason: 'Order cannot be cancelled at this stage' })
            }
            io.to('staff').emit('cancelOrderRequest', { orderId, reason })
        })
        
        // Disconnect
        socket.on('disconnect', () => {
            console.log(`user disconnected ${socket.id}`)
        })

    })
}



// // CUSTOMER SOCKET
// const socket = io('http://localhost:5000')

// // Join Order Room
// socket.emit('joinOrder', orderId)

// // Receive Order Status
// socket.on('orderStatusUpdated', (data) => {
//     console.log('Order Status:', data.status)
//     console.log('Order Number:', data.orderNumber)
// })

// // Customer Request Cancellation
// Send this when customer clicks "Cancel Order"
// socket.emit('cancelOrderRequest', { orderId, reason: 'I want to cancel my order' })

// Cancellation Rejected
// socket.on('cancellationRejected', (data) => { console.log('Cancellation Rejected:', data.reason) })

// // STAFF SOCKET
// const socket = io('http://localhost:5000')

// // Join Staff Room
// socket.emit('joinStaff')

// // Receive Customer Cancellation Request
// socket.on('cancelOrderRequest', (data) => {
//     console.log('Customer wants to cancel:', data)
// })



// Customer → Backend:
// joinOrder
// cancelOrderRequest

// Staff → Backend:
// joinStaff`

// Backend → Customer:
// orderStatusUpdated
// cancellationRejected

// Backend → Staff:
// cancelOrderRequest

