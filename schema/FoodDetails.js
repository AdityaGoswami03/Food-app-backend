import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const foodDetailedSchema = new Schema({
  name: { type: String },
  price: { type: Number, required: true },
});

export const Item = models.Item || model("Item", foodDetailedSchema, "Items");
