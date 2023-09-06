import Contact from "../models/Contact.js";
import AsyncHandler from "express-async-handler";

export const createContact = AsyncHandler(async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.json(contact);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllContact = AsyncHandler(async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    throw new Error(error);
  }
});
export const getSingleContact = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    res.json(contact);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteContact = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findByIdAndDelete(id);
    res.json(contact);
  } catch (error) {
    throw new Error(error);
  }
});
