import express from "express"
import * as dotenv from 'dotenv'
import { dbConnection } from "./databases/dbConnection.js"
import { Server } from 'socket.io'
import { orderSocket } from "./src/modules/order/order.socket.js"
import { init } from "./src/modules/index.route.js"

dotenv.config({ quiet: true })
const app = express()

app.set('query parser', 'extended')
app.use(express.json())
app.use(express.static('uploads'))

init(app)
dbConnection()

const server = app.listen(5000, () => console.log('server is running...'))
const io = new Server(server, { cors: { origin: '*' } })
app.set('io', io)
orderSocket(io)


// app.listen(5000, () => {
//     console.log('server is running.....')
// })

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
})
