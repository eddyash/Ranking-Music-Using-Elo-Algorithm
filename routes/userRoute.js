const express = require('express');
const user_router = express.Router();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const user_controller = require('../controllers/userController');

user_router.use(bodyParser.urlencoded({extended:true}));
user_router.use(express.static(path.resolve(__dirname,'public')));

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null, './public/uploads')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage:storage});

// Import Music Route
user_router.post('/import-user', upload.single('file'), user_controller.import_user);

// Display All Files
user_router.get('/display-user', user_controller.display_user);

// Display Music Poll Route
user_router.get('/display-poll', user_controller.display_poll);

// Music Vote Route
user_router.post('/vote/:id/:sub_id/:k1/:k2', user_controller.vote_user);

// Display Results Route
user_router.get('/display-results', user_controller.results);

module.exports = user_router;