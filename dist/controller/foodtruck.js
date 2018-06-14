"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require("express");

var _foodtruck = require("../model/foodtruck");

var _foodtruck2 = _interopRequireDefault(_foodtruck);

var _review = require("../model/review");

var _review2 = _interopRequireDefault(_review);

var _authMiddleware = require("../middleware/authMiddleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  //CRUD - Create Read Update Delete


  // "/v1/foodtruck/add" - Create
  api.post("/add", _authMiddleware.authenticate, function (req, res) {
    var newFoodTruck = new _foodtruck2.default();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    _foodtruck2.default.geometry.coordinates.long = req.body.geometry.coordinates.long;
    newFoodTruck.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "foodtruck saved successfully." });
    });
  });

  // "/v1/foodtruck" - Read
  api.get("/", function (req, res) {
    _foodtruck2.default.find({}, function (err, foodtrucks) {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });
  // "/v1/foodtruck/:id" - Read 1
  api.get("/:id", function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  //"/v1/foodtruck/:id" - Update
  api.put("/:id", _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }

      if (req.body.name) {
        foodtruck.name = req.body.name;
        console.log("Name updated");
      }
      if (req.body.foodtype) {
        foodtruck.foodtype = req.body.foodtype;
        console.log("Foodtype updated");
      }
      if (req.body.avgcost) {
        foodtruck.avgcost = req.body.avgcost;
        console.log("Avgcost updated");
      }
      if (req.body.geometry) {
        foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
        foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;
        console.log("Coordinates updated");
      }
      // if (req.body.geometry.coordinates){
      //   foodtruck.geometry.coordinates = req.body.geometry.coordinates;
      // }

      foodtruck.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "foodtruck info updated." });
      });
    });
  });

  //"/v1/foodtruck/:id" - Delete
  api.delete("/:id", _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (foodtruck === null) {
        res.status(404).send("FoodTruck not found!");
        return;
      }
      foodtruck.remove({
        _id: req.params.id
      }, function (err, foodtruck) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        _review2.default.remove({
          foodtruck: req.params.id
        }, function (err, review) {
          if (err) {
            res.send(err);
          }
          res.json({ message: "foodtruck DELTED!" });
        });
      });
    });
  });

  //add review for a specific foodtruck id
  //"/v1/foodtruck/reviews/add/:id"
  api.post("/reviews/add/:id", _authMiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      var newReview = new _review2.default();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save(function (err, review) {
        if (err) {
          res.send(err);
        }
        foodtruck.reviews.push(newReview._id);
        foodtruck.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: "Food truck review succesfully saved." });
        });
      });
    });
  });

  //get foodtrucks for a specific foodtype
  //"/v1/foodtruck/foodtype/:foodtype"
  api.get("/foodtype/:foodtype", function (req, res) {
    _foodtruck2.default.find({ foodtype: req.params.foodtype }, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  //get reviews for a specific food truck
  //"/v1/foodtruck/reviews/:id"
  api.get("/reviews/:id", function (req, res) {
    _review2.default.find({ foodtruck: req.params.id }, function (err, reviews) {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  return api;
};
//# sourceMappingURL=foodtruck.js.map