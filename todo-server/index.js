require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Set upload destination
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique file name
  }
});

const upload = multer({ storage: storage });

// MongoDB configuration
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.sktmpwb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("Database Connected Successfully✅");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

const TaskCollection = client.db("TodoTaskDB").collection("task");

app.get('/', (req, res) => {
  res.send('Lets ready for ToDo task!');
});

app.get('/task', async (req, res) => {
  const result = await TaskCollection.find().toArray();
  res.send(result);
});

// Endpoint to update a task and upload files
app.patch("/task/:id", upload.array('attachments'), async (req, res) => {
  const id = req.params.id;
  const { fileCount } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid task ID format" });
  }

  const filter = { _id: new ObjectId(id) };
  
  // Map through each uploaded file to store relevant metadata in attachments array
  const newAttachments = req.files.map(file => ({
    filename: file.originalname,
    path: file.path,
    mimetype: file.mimetype
  }));

  // Update document in MongoDB
  const updateDoc = {
    $set: { fileCount: parseInt(fileCount, 10) },
    $push: { attachments: { $each: newAttachments } } // Append to attachments array
  };

  try {
    const result = await TaskCollection.updateOne(filter, updateDoc);

    if (result.modifiedCount > 0) {
      res.status(200).send({ message: "Task updated successfully", attachments: newAttachments });
    } else {
      res.status(404).send({ message: "Task not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send({ message: "Internal server error", error });
  }
});

app.listen(port, () => {
  console.log(`Lets run the Task server site on port : ${port}`);
});
