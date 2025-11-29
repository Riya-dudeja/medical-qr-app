import { Router } from "express";
import { sendSOSAlert } from "../controllers/sosController.js";

const router = Router();


router.post("/sos", sendSOSAlert);

export default router;
