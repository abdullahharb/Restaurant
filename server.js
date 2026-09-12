import express from "express"
import * as dotenv from 'dotenv'
import { dbConnection } from "./databases/dbConnection.js"
import { Server } from 'socket.io'
import { orderSocket } from "./src/modules/order/order.socket.js"
import { init } from "./src/modules/index.route.js"
import cors from 'cors'


dotenv.config({ quiet: true })
const app = express()

app.set('query parser', 'extended')
app.use(express.json())
app.use(express.static('uploads'))
app.use(cors())


init(app)
dbConnection()

const server = app.listen(process.env.PORT || 5000, () => console.log('server is running...'))

const io = new Server(server, { cors: { origin: '*' } })
app.set('io', io)
orderSocket(io)

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err);
})
