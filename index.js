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

// Create collections for later use
let roomsCollection, bookingsCollection;

async function run() {
  try {
    await client.connect();
    const database = client.db('hotelRooms'); // Replace with your database name
    roomsCollection = database.collection('rooms');
    bookingsCollection = database.collection('myBookings');

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run();

// Get all rooms
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

// Get a specific room by ID
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

// Post a new booking
app.post("/myBookings", async (req, res) => {
  try {
    const room = req.body; // Data from the frontend
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

// Get all bookings for a specific user by email
app.get('/myBookings', async (req, res) => {
  try {
    const { email } = req.query; // Extract email from query parameters
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

// Modify booking date (PUT method)
app.put('/myBookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingDate } = req.body; // New date to update
    const query = { _id: new ObjectId(id) };

    // Update the booking date
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

// Delete a booking (DELETE method)
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

// Default route
app.get('/', (req, res) => {
  res.send('Modern Hotel Booking Platform');
});

app.listen(port, () => {
  console.log(`Hotel booking is waiting at: ${port}`);
});
