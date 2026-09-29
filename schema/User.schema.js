import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

export const User = models.User || model("User", UserSchema);
