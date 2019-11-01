const express = require("express");
const app = express();
const router = require("express").Router();
const debug = require("./debug");
const env = require("./env");
const auth = require("./auth");
const services = require("./services");
const morgan = require("morgan");
const multer = require('multer');
const upload = multer();


router.post('/deposit', upload.single('contents'), async (req, res, next)=>{
     res.send(await services.deposit(req.body.originalname, req.file));
});
router.get('/retrieve', async (req, res, next)=>{
     let filename = req.query.filename
     console.log(filename);
     let ret = services.retrieve(filename,res);
});

module.exports = router
