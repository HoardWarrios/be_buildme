import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";

//CREATE CONVERSATION
export const createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
     // If seller reqest userId + body : else body + userId (Rule to view/read conversation first)
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,// If seller responce first
    readByBuyer: !req.isSeller,// If buyer responce first
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
};

//UPDATE CONVERSATION
export const updateConversation = async (req, res, next) => {
  try {
    // Updated conversation/ New message function
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readBySeller: true,
          // readByBuyer: true,
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }// Return only new conversation
    );

    res.status(200).send(updatedConversation);//Send update conversation
  } catch (err) {
    next(err);
  }
};

//GET SINGLE CONVERSATION
export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });//get id from parameters
    if (!conversation) return next(createError(404, "Not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

//GET CONVERSATIONS
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId } //if seller get seller id : else get user id
    ).sort({ updatedAt: -1 });
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};

export const deleteAll = async (req, res) => {
  try {
    const conversations = await Conversation.deleteMany({});

      res.status(200).send("All conversationss deleted successfully");
    

  } catch (err) {
    next(err);
  }
};
