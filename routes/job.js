const router = require("express").Router();
const jobController = require("../controllers/jobController");
const {verifyAndAuthorization, verifyToken, verifyAndAdmin}= require("../middleware/verifyToken");

// Post job
router.post("/",verifyAndAdmin, jobController.createJob);

// Update job
router.put("/:id",verifyAndAdmin, jobController.updateJob);

// Delete job
router.delete("/:id",verifyAndAdmin, jobController.deleteJob);

// Get job
router.get("/:id", jobController.getJob);

// Get jobs
router.get("/", jobController.getAllJobs);

// Search jobs
router.get("/search/:key", jobController.searchJobs);



module.exports = router