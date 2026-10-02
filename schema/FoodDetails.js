import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const foodDetailedSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    image: { type: String }, // Stores image filename/path stored in local uploads folder
    description: { type: String, trim: true },
    isVeg: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Item = models.Item || model("Item", foodDetailedSchema, "Items");
