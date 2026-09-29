import { Router } from "express";
import { User } from "../schema/User.schema.js";

const router = Router();

router.post("/create-user", async (req, res) => {
  try {
    await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });
    console.log("We have created");
    res.json({ success: true });
  } catch (error) {
    console.log("error", error);
    res.json({ success: false });
  }
});
export default router;
