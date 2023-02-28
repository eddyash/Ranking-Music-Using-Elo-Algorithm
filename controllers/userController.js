const user_model = require("../models/userModel");
const csv = require("csvtojson");
const { response } = require("express");
const song_rating = require("../services/elo_algorithm");

// CSV TO JSON CONTROLLER
const import_user = async (req, res) => {
  try {
    var userData = [];

    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        // console.log(response);
        for (let i = 0; i < response.length; i++) {
          userData.push({
            name: response[i].Track,
            author: response[i].Artist,
            streams: response[i].Streams,
          });
        }
        await user_model.insertMany(userData);
      });

    res.send({ status: 200, success: true, msg: "CSV Imported" });
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

// Display All Users Controller
const display_user = async (req, res) => {
  user_model.find((err, data) => {
    if (err) throw err;
    // Render EJS template and pass data to view
    res.render("index", { data });
  });
};

// Display Polling Controller
const display_poll = async (req, res) => {
  try {
    const songs = await user_model.aggregate([
      // // const songs = await Songs.aggregate([
      {
        $match: {
          _id: {
            $not: {
              $in: req.query.exclude ? req.query.exclude.split(",") : [],
            },
          },
        },
      },
      {
        $sample: {
          size: 2,
        },
      },
      {
        $project: {
          rating: 0,
          __v: 0,
        },
      },
    ]);

    return res.render("poll", { data: songs });
    // console.log(typeof songs);
  } catch (error) {
    return error;
  }
};


// Rating Calculator Controller
const vote_user = async (req, res) => {
  try {
    const id1 = req.params.id;
    const id2 = req.params.sub_id;
    const k_1 = req.params.k1;
    const k_2 = req.params.k2;
    // console.log(id1, id2);

    const song1 = await user_model.findOne({ _id: id1 });
    const song2 = await user_model.findOne({ _id: id2 });

    // await console.log(song1,song2);

    const expected_result_1 = song_rating(song1.rating, song2.rating);
    const expected_result_2 = song_rating(song2.rating, song1.rating);

    song1.rating = Math.floor(
      song1.rating + 20 * (k_1 - expected_result_1)
    );

    song2.rating = Math.floor(
      song2.rating + 20 * (k_2 - expected_result_2)
    );

     await song1.save();
     await song2.save();

    // return res.sendStatus(200);
    res.redirect('/display-poll');
  } catch (error) {
    return (error);
  }
};

// Results Controller
const results = async (req, res) => {
  const results = await user_model.find().sort({rating: -1}).limit(200);
  res.render('results', { data:results });
};

module.exports = { import_user, display_user, display_poll, vote_user, results };
