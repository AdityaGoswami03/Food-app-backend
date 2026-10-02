import {
  createFoodItemService,
  getAllFoodItemsService,
  getFoodItemByIdService,
  updateFoodItemService,
  deleteFoodItemService,
  removeImageFile,
} from "../services/Food.service.js";

/**
 * Controller to Add a New Food Item (with Image Upload)
 */
export const addFoodItem = async (req, res) => {
  try {
    const { name, price, category, description, isVeg } = req.body;

    // Validate required fields
    if (!name || price === undefined || price === null || !category) {
      // If image was uploaded with an invalid request, clean it up
      if (req.file) {
        removeImageFile(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, price, and category",
      });
    }

    // Image filename from multer if uploaded
    const imageFilename = req.file ? req.file.filename : null;

    const newFood = await createFoodItemService({
      name,
      price,
      category,
      description,
      isVeg,
      image: imageFilename,
    });

    return res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: newFood,
    });
  } catch (error) {
    // Clean up uploaded file if an error occurs
    if (req.file) {
      removeImageFile(req.file.filename);
    }
    console.error("Error in addFoodItem controller:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Controller to Get All Food Items
 */
export const getAllFoodItems = async (req, res) => {
  try {
    const items = await getAllFoodItemsService(req.query);
    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Error in getAllFoodItems controller:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Controller to Get Food Item by ID
 */
export const getFoodItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getFoodItemByIdService(id);
    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error in getFoodItemById controller:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Controller to Update Food Item by ID
 */
export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const newImageFilename = req.file ? req.file.filename : null;

    const updatedItem = await updateFoodItemService(
      id,
      updateData,
      newImageFilename
    );

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    if (req.file) {
      removeImageFile(req.file.filename);
    }
    console.error("Error in updateFoodItem controller:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Controller to Delete Food Item by ID
 */
export const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await deleteFoodItemService(id);

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    console.error("Error in deleteFoodItem controller:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
