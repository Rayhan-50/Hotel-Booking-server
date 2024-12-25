const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxvwb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


let roomsCollection, bookingsCollection, reviewsCollection;

async function run() {
  try {
    await client.connect();
    const database = client.db('hotelRooms'); 
    roomsCollection = database.collection('rooms');
    bookingsCollection = database.collection('myBookings');
    reviewsCollection = database.collection('reviews');


    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run();


app.get('/rooms', async (req, res) => {
  try {
    const cursor = roomsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const cursor = reviewsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});


app.get('/rooms/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await roomsCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Failed to fetch room" });
  }
});


app.post("/myBookings", async (req, res) => {
  try {
    const room = req.body; 
    const result = await bookingsCollection.insertOne(room);

    if (result.acknowledged) {
      res.status(201).json({ message: "Room added to collection successfully!" });
    } else {
      res.status(500).json({ message: "Failed to add room to collection." });
    }
  } catch (error) {
    console.error("Error adding room to collection:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});


app.get('/myBookings', async (req, res) => {
  try {
    const { email } = req.query; 
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const userBookings = await bookingsCollection.find({ user_email: email }).toArray();
    res.status(200).json(userBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/myBookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingDate } = req.body; 
    const query = { _id: new ObjectId(id) };

 
    const updateDoc = {
      $set: { bookingDate: new Date(bookingDate) },
    };

    const result = await bookingsCollection.updateOne(query, updateDoc);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Booking date updated successfully!" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error updating booking date:", error);
    res.status(500).json({ message: "Failed to update booking date" });
  }
});


app.delete('/myBookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };

    const result = await bookingsCollection.deleteOne(query);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Booking deleted successfully!" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
});


// reviews 
app.post("/reviews", async (req, res) => {
  try {
    const reviews = req.body; 
    const result = await reviewsCollection.insertOne(reviews);

    if (result.acknowledged) {
      res.status(201).json({ message: "Review added to collection successfully!" });
    } else {
      res.status(500).json({ message: "Failed to add review to collection." });
    }
  } catch (error) {
    console.error("Error adding review to collection:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});





app.get('/', (req, res) => {
  res.send('Modern Hotel Booking Platform');
});

app.listen(port, () => {
  console.log(`Hotel booking is waiting at: ${port}`);
});
