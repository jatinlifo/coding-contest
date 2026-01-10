import {createContest,
        generateLink,
        getExistingLink,
         verifyRoom,
         joinRoom,
         waitingRoom,
        } from "../controllers/contest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

//create contest
router.route("/create-contest").post(verifyJWT, createContest)

//generate link
router.route("/generate-link").post(verifyJWT, generateLink);

//return existing link
router.route("/existing-link").get(verifyJWT, getExistingLink);

//verify the roomcode
router.route("/verify-room/:roomCode").get(verifyRoom);

//join room
router.route("/join/:roomCode").post(verifyJWT, joinRoom);

//waiting room 
router.route("/waiting-room/:roomCode").get(verifyJWT, waitingRoom);

export default router;
 