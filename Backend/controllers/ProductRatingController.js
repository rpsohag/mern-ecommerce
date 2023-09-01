import AsyncHandler from "express-async-handler";
import Product from "../models/Product.js";

export const productRating = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  const { star, comment, prodId } = req.body;
  const product = await Product.findById(prodId);
  let alreadyRated = product.ratings.find(
    (userId) => userId.postedby.toString() === _id.toString()
  );
  try {
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star },
        },
        {
          new: true,
        }
      );
      res.json({
        message: "already rated",
        data: updateRating,
      });
    } else {
      const ratedProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
    }

    const getAllRatings = await Product.findById(prodId);
    let totalRatings = getAllRatings.ratings.length;
    let ratingsum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, current) => prev + current, 0);
    let actualRating = Math.round(ratingsum / totalRatings);
    let Fproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );

    res.json({
      message: "product rated successfully!",
      data: Fproduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});
