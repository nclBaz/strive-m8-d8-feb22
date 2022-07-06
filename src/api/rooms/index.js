import express from "express"
import createError from "http-errors"
import RoomsModel from "../../models/rooms.js"

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
    const room = await RoomsModel.findById(req.params.roomName)
    if (room) {
      res.send(room)
    } else {
      next(createError(404, `Room with id ${req.params.roomName} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default roomsRouter
