import  express  from "express";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Connection Error:", err));

const app = express();
app.use(express.json());
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        email: { type: String, required: true},
        age: Number,
    },
);

const User = mongoose.model("User", UserSchema, "Thom.TTH225410");

//Create user
app.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: "Name & Email are required" });

    const newUser = await User.create({ name, email, age });
    res.status(201).json({ message: "User created", data: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//Get one user
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ data: user });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID", error: err.message });
  }
});

// Get all users
app.get("/users", async (req, res)=>{
  try{
    const users = await User.find();
    res.json({data: users});
  }catch(err){
    res.status(500).json({message: "Server error", error: err.message});
  }
})

// Update user
app.put("/users/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", data: updated });
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID", error: err.message });
  }
});

app.listen(3001);
//Kiểm tra CI/CD