import { Router } from "express";
import {  verifyJWT } from "../middlewares/auth.middleare.js";
import {
    loginUser,
    createAccountUser,
    logoutUser,
    refreshAccessToken

} from '../controllers/user.controller.js'
import {
    fetchCode, 
    saveCode,
    addTestCase,
    allProblems,
    getSingleProblem
} from "../controllers/code.controller.js";


const router = Router();

router.route("/create-account").post(createAccountUser);
router.route("/login").post(loginUser);

//create secured route
router.route("/logout").post(verifyJWT,logoutUser); 
router.route("/refresh-token").post(refreshAccessToken);


//code sace route
router.route("/save-code").post(saveCode)
router.route("/code").get(fetchCode)


//code admin route only
// router.post("/add-problem",  addProblem);
router.post("/add-testcases/:problemId",  addTestCase);


//fetch all problems
router.get("/all-problems", allProblems);
router.get("/getsingleproblem/:slug" , getSingleProblem);

export default router;  