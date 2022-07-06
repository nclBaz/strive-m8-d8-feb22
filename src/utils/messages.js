import MessagesModel from "../models/messages.js"
import RoomsModel from "../models/rooms.js"

export const saveMessage = async (message, roomName) => {
  try {
    const room = await RoomsModel.findOne({ name: roomName })
    // save message in messages collection
    const newMessage = new MessagesModel({ text: message.text, sender: message.sender, room: room._id })
    const savedMessage = await newMessage.save()
    return savedMessage
  } catch (error) {
    console.log(error)
  }
}
