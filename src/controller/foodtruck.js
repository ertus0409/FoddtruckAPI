import mongoose from "mongoose";
import { Router } from "express";
import foodtruck from "../model/foodtruck";
import Review from "../model/review";

import { authenticate } from "../middleware/authMiddleware";

export default({ config, db}) => {
  let api = Router();

  //CRUD - Create Read Update Delete


  // "/v1/foodtruck/add" - Create
  api.post("/add", authenticate, (req, res) => {
    let newFoodTruck = new foodtruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates.lat = req.body.geometry.coordinates[0];
    newFoodTruck.geometry.coordinates.long = req.body.geometry.coordinates[1];
    newFoodTruck.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: "foodtruck saved successfully."});
    });
  });

  // "/v1/foodtruck" - Read
  api.get("/", (req, res) =>  {
    foodtruck.find({}, (err, foodtrucks) => {
      if (err){
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });
  // "/v1/foodtruck/:id" - Read 1
  api.get("/:id", (req, res) => {
    foodtruck.findById(req.params.id, (err, foodtruck) => {
      if (err){
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  //"/v1/foodtruck/:id" - Update
  api.put("/:id", authenticate, (req, res) => {
    foodtruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }

      if(req.body.name) {
        foodtruck.name = req.body.name;
        console.log("Name updated");
      }
      if (req.body.foodtype){
        foodtruck.foodtype = req.body.foodtype;
        console.log("Foodtype updated");
      }
      if (req.body.avgcost){
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

      foodtruck.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({message: "foodtruck info updated."});
      });
    });
  });

  //"/v1/foodtruck/:id" - Delete
  api.delete("/:id", authenticate, (req, res) => {
    foodtruck.findById(req.params.id, (err, foodtruck) => {
      if(err){
        res.status(500).send(err);
        return;
      }
      if(foodtruck === null) {
        res.status(404).send("FoodTruck not found!");
        return;
      }
      foodtruck.remove({
        _id: req.params.id
      }, (err, foodtruck) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        Review.remove({
          foodtruck: req.params.id
        }, (err, review) => {
          if(err){
            res.send(err);
          }
          res.json({message: "foodtruck DELTED!"});
        });
      });
    });
  });


  //add review for a specific foodtruck id
  //"/v1/foodtruck/reviews/add/:id"
  api.post("/reviews/add/:id", authenticate, (req, res) => {
    foodtruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        foodtruck.reviews.push(newReview._id);
        foodtruck.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: "Food truck review succesfully saved."});
        });
      });
    });
  });

  //get foodtrucks for a specific foodtype
  //"/v1/foodtruck/foodtype/:foodtype"
  api.get("/foodtype/:foodtype", (req, res) => {
    foodtruck.find({foodtype: req.params.foodtype}, (err, foodtruck) => {
      if (err){
        res.send(err);
      }
      res.json(foodtruck)
    });
  });

  //get reviews for a specific food truck
  //"/v1/foodtruck/reviews/:id"
  api.get("/reviews/:id", (req, res) => {
    Review.find({foodtruck: req.params.id}, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });


  return api;






}
