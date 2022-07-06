import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cors from "cors"
import listEndpoints from "express-list-endpoints"

import connectionHandler from "./socket/index.js"

const server = express()
const port = process.env.PORT || 3001

const httpServer = createServer(server)

// **************************************** MIDDLEWARES **********************************

// ****************************************** ENDPOINTS **********************************

// *************************************** ERROR HANDLERS ********************************

const io = new Server(httpServer)

io.on("connection", connectionHandler)

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port ${port}`)
  })
})
