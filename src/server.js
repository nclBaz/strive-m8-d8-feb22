import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cors from "cors"
import listEndpoints from "express-list-endpoints"

const server = express()
const port = process.env.PORT || 3001

const httpServer = createServer(server)

// **************************************** MIDDLEWARES **********************************

// ****************************************** ENDPOINTS **********************************

// *************************************** ERROR HANDLERS ********************************

const io = new Server(httpServer)

let onlineUsers = []

io.on("connection", socket => {
  // We have established a connection with a client
  socket.emit("welcome", { message: `Hello ${socket.id}!` })

  // FE is emitting setUsername event --> BE should listen for that

  socket.on("setUsername", payload => {
    // When a new client connects to the chat and sets a username, BE should keep track of that socketId & username
    onlineUsers.push({ username: payload.username, socketId: socket.id })
    console.log("ONLINE USERS: ", onlineUsers)

    // FE is waiting for an event called loggedin, we gonna emit that and send the list of online users
    socket.emit("loggedin", onlineUsers)
    // Also the other connected users should receive the list of current online users
    socket.broadcast.emit("newConnection", onlineUsers) // We want to emit this event to every connected socket but not the current one
  })

  socket.on("sendmessage", message => {
    // we should broadcast that message to everybody but not to the sender of the message (otherwise he would see a duplicated message on the chat)
    socket.broadcast.emit("message", message)
  })

  socket.on("disconnect", () => {
    // event automatically emitted by the FE when user closes the browser/tab
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
    socket.broadcast.emit("newConnection", onlineUsers)
  })
})

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port ${port}`)
  })
})
