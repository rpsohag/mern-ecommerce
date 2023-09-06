import Color from "../models/Color.js";
import AsyncHandler from "express-async-handler";

export const createColor = AsyncHandler(async (req, res) => {
  try {
    const color = await Color.create(req.body);
    res.json(color);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateColor = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(color);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllColor = AsyncHandler(async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    throw new Error(error);
  }
});
export const getSingleColor = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findById(id);
    res.json(color);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteColor = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findByIdAndDelete(id);
    res.json(color);
  } catch (error) {
    throw new Error(error);
  }
});
