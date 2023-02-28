const express = require("express");
const mongoose = require("mongoose");
const db = require('./config/keys').MongoURI;
const app = express();

mongoose.set("strictQuery", true);
mongoose.connect(db, {useNewUrlParser: true}).then(() => console.log("MongoDB Connected Successfully!!")).catch((err) => console.log(err));

// Linking views folder and enable render engine
app.set('views', './views');
app.set('view engine', 'ejs');

// routes
const user_route = require('./routes/userRoute');

app.use('/', user_route);

const PORT = 5000;

app.listen(PORT, function(){
    console.log(`App running at PORT: ${PORT}`);
})
