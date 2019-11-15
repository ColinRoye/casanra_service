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
const shortid = require('shortid');

router.post('/addmedia', upload.single('content'), async (req, res, next)=>{
    // res.send(req.body.originalname)
    let id = shortid.generate();
    let ret = await services.deposit(id, req.file,res, req.body.used);
});
router.get('/media/:id', async (req, res, next)=>{
     let filename = req.params.id
     console.log(filename);
     let ret = services.retrieve(filename,res);
});
router.delete('/media/:id', async (req, res, next)=>{
     let filename = req.params.id
     console.log(filename);
     let ret = services.delete(filename,res);
});
router.get('/used/:id', async (req, res, next)=>{
     let filename = req.params.id
     console.log(filename);
     let ret = services.getUsed(filename,res);
});
router.post('/used/:id', async (req, res, next)=>{
     let filename = req.params.id
     console.log(filename);
     let ret = services.setUsed(filename,res);
});

module.exports = router
