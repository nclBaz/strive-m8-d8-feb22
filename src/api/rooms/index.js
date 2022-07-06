import express from "express"
import createError from "http-errors"
import RoomsModel from "../../models/rooms.js"
import MessagesModel from "../../models/messages.js"

const roomsRouter = express.Router()

roomsRouter.post("/", async (req, res, next) => {
  try {
    const newRoom = new RoomsModel(req.body)
    const { _id } = await newRoom.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

roomsRouter.get("/:roomName/messages", async (req, res, next) => {
  try {
    const room = await RoomsModel.findOne({ name: req.params.roomName })
    if (room) {
      const messages = await MessagesModel.find({ room: room._id })
      res.send(messages)
    } else {
      next(createError(404, `Room with id ${req.params.roomName} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default roomsRouter
