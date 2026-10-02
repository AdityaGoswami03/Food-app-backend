import fs from "fs";
import path from "path";
import { Item } from "../schema/FoodDetails.js";

/**
 * Service to create a new Food item
 */
export const createFoodItemService = async ({
  name,
  price,
  category,
  description,
  isVeg,
  image,
}) => {
  const newItem = await Item.create({
    name,
    price: Number(price),
    category,
    description,
    isVeg: typeof isVeg === "string" ? isVeg === "true" : Boolean(isVeg),
    image,
  });

  return newItem;
};

/**
 * Service to get all Food items with optional filtering
 */
export const getAllFoodItemsService = async (query = {}) => {
  const filter = {};

  if (query.category) {
    filter.category = { $regex: new RegExp(query.category, "i") };
  }

  if (query.isVeg !== undefined) {
    filter.isVeg = query.isVeg === "true" || query.isVeg === true;
  }

  if (query.search) {
    filter.name = { $regex: new RegExp(query.search, "i") };
  }

  const items = await Item.find(filter).sort({ createdAt: -1 });
  return items;
};

/**
 * Service to get a single Food item by ID
 */
export const getFoodItemByIdService = async (id) => {
  const item = await Item.findById(id);
  if (!item) {
    const error = new Error("Food item not found");
    error.statusCode = 404;
    throw error;
  }
  return item;
};

/**
 * Service to update a Food item by ID
 */
export const updateFoodItemService = async (id, updateData, newImageFilename) => {
  const existingItem = await Item.findById(id);
  if (!existingItem) {
    // If a new image was uploaded but food item not found, cleanup uploaded file
    if (newImageFilename) {
      removeImageFile(newImageFilename);
    }
    const error = new Error("Food item not found");
    error.statusCode = 404;
    throw error;
  }

  // If a new image is provided, delete the old image file from disk
  if (newImageFilename) {
    if (existingItem.image) {
      removeImageFile(existingItem.image);
    }
    updateData.image = newImageFilename;
  }

  if (updateData.price !== undefined) {
    updateData.price = Number(updateData.price);
  }

  if (updateData.isVeg !== undefined) {
    updateData.isVeg =
      typeof updateData.isVeg === "string"
        ? updateData.isVeg === "true"
        : Boolean(updateData.isVeg);
  }

  const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedItem;
};

/**
 * Service to delete a Food item by ID
 */
export const deleteFoodItemService = async (id) => {
  const item = await Item.findByIdAndDelete(id);
  if (!item) {
    const error = new Error("Food item not found");
    error.statusCode = 404;
    throw error;
  }

  // Delete image file from local uploads folder if it exists
  if (item.image) {
    removeImageFile(item.image);
  }

  return item;
};

/**
 * Helper to remove an image file from the uploads directory
 */
export const removeImageFile = (filename) => {
  try {
    if (!filename) return;
    const filePath = path.join("uploads", path.basename(filename));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Error deleting image file:", err.message);
  }
};
