const express = require("express");
const client = require("./connectDb");
const { ObjectId } = require("mongodb");
const admin = require("./firebaseAdmin");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json("server is running");
});

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const verifyUser = async (req, res, next) => {
  const decodedEmail = req.user.email;
  const currentUserEmail = req.query.email;

  if (decodedEmail !== currentUserEmail) {
    return res.status(401).json({ message: "You Are Unauthorized" });
  }
  next();
};

router.get("/foods", async (req, res) => {
  try {
    const foodBird = client.db("foodbird");
    const foodCollection = foodBird.collection("foods");

    const result = await foodCollection
      .aggregate([
        {
          $addFields: {
            quantityAsNumber: { $toInt: "$quantity" },
          },
        },
        {
          $sort: { quantityAsNumber: -1 },
        },
        {
          $limit: 6,
        },
      ])
      .toArray();

    res.status(200).json(result);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

router.post("/add_food", verifyFirebaseToken, verifyUser, (req, res) => {
  const [name, photoURL, email] = req.body.donor.split(",");
  const createdAt = Date.now();
  const newFood = req.body;
  const doc = { ...newFood, donor: { name, photoURL, email }, createdAt };
  const foodBird = client.db("foodbird");
  const foodCollection = foodBird.collection("foods");

  foodCollection
    .insertOne(doc)
    .then((result) => {
      if (result.insertedId) {
        return res.status(201).json(result);
      }
    })
    .catch((err) => {
      return res.status(err.code).json(err.message);
    });
});

router.get("/available_foods/:sort", async (req, res) => {
  const foodBird = client.db("foodbird");
  const foodCollection = foodBird.collection("foods");
  foodCollection
    .find({ foodStatus: "available" })
    .sort({ expiredDate: 1 })
    .toArray()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(404).json(err.message);
    });
});

router.get("/available_foods", async (req, res) => {
  const foodBird = client.db("foodbird");
  const foodCollection = foodBird.collection("foods");
  foodCollection
    .find({ foodStatus: "available" })
    .sort({ expiredDate: -1 })
    .toArray()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(404).json(err.message);
    });
});

router.get("/food_detail/:id", async (req, res) => {
  const foodBird = client.db("foodbird");
  const foodCollection = foodBird.collection("foods");
  const id = req.params.id;

  foodCollection
    .findOne({ _id: new ObjectId(id) })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(404).json(err.message);
    });
});

router.put("/request_food", (req, res) => {
  const { foodId, requestedBy } = req.body;
  const requestedDate = new Date();
  const foodBird = client.db("foodbird");
  const foodCollection = foodBird.collection("foods");

  const query = { _id: new ObjectId(foodId) };
  const update = {
    $set: { foodStatus: "requested", requestedBy, requestedDate },
  };
  const options = {};

  foodCollection
    .updateOne(query, update, options)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(404).json(err.message);
    });
});

router.get(
  "/my_foods/:email",
  verifyFirebaseToken,
  verifyUser,
  async (req, res) => {
    const email = req.params.email;
    const foodBird = client.db("foodbird");
    const foodCollection = foodBird.collection("foods");
    foodCollection
      .find({
        "donor.email": email,
      })
      .toArray()
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(404).json(err.message);
      });
  }
);

router.get(
  "/my_foods_request/:email",
  verifyFirebaseToken,
  verifyUser,
  async (req, res) => {
    const email = req.params.email;
    const foodBird = client.db("foodbird");
    const foodCollection = foodBird.collection("foods");
    foodCollection
      .find({
        requestedBy: email,
      })
      .toArray()
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(404).json(err.message);
      });
  }
);

router.put("/update_food/:id", (req, res) => {
  const { id } = req.params;
  const [donorName, donorPhotoURL, donorEmail] = req.body.donor.split(",");
  const {
    name,
    imageUrl,
    quantity,
    location,
    expiredDate,
    additionNotes,
    foodStatus,
  } = req.body;

  const doc = {
    name,
    imageUrl,
    quantity,
    location,
    expiredDate,
    additionNotes,
    foodStatus,
    donor: {
      name: donorName,
      photoURL: donorPhotoURL,
      email: donorEmail,
    },
  };

  const foodBird = client.db("foodbird");
  const foodCollection = foodBird.collection("foods");

  foodCollection
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...doc } }, {})
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch(() => {
      return res.status(404).json(err);
    });
});

router.delete("/delete_food/:id", async (req, res) => {
  const id = req.params.id;
  const foodBird = client.db("foodbird");
  const foodCollection = foodBird.collection("foods");
  foodCollection
    .deleteOne({ _id: new ObjectId(id) })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

module.exports = router;
