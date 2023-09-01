import Brand from "../models/Brand.js";
import AsyncHandler from "express-async-handler";

export const createBrand = AsyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateBrand = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllBrand = AsyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    throw new Error(error);
  }
});
export const getSingleBrand = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findById(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteBrand = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndDelete(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});
