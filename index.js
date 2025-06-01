import express from "express";
import cors from "cors";

const app = express();

// Middleware should be defined before routes
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

const users = [];

app.get("/", (req, res) => {
  return res.json({ 
    message: "Server is running", 
    users: users.length,
    timestamp: new Date().toISOString()
  });
});

app.post("/register", (req, res) => {
  try {
    const { name, email, pass } = req.body;
    
    console.log("Registration attempt:", { name, email }); // Don't log password
    
    // Validate input
    if (!name || !email || !pass) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    
    // Add user to array
    const newUser = { name, email, pass };
    users.push(newUser);
    
    console.log("User registered successfully:", { name, email });
    console.log("Total users:", users.length);
    
    return res.status(201).json({ 
      message: "User registered successfully",
      user: { name, email } // Don't return password
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", (req, res) => {
  try {
    const { email, pass } = req.body;
    
    console.log("Login attempt for:", email);
    
    // Validate input
    if (!email || !pass) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const found = users.find(
      (user) => user.email === email && user.pass === pass
    );
    
    if (!found) {
      console.log("Login failed - user not found or wrong password");
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    console.log("Login successful for:", found.name);
    
    // Return user data and token in the format expected by frontend
    return res.status(200).json({
      user: {
        name: found.name,
        email: found.email,
        token: "123"
      },
      token: "123"
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Debug route to see all users
app.get("/users", (req, res) => {
  return res.json({
    count: users.length,
    users: users.map(user => ({ name: user.name, email: user.email })) // Don't expose passwords
  });
});

// Debug route to see all users with passwords (for development only)
app.get("/debug/users", (req, res) => {
  return res.json({
    count: users.length,
    users: users // Shows everything including passwords - ONLY for development
  });
});

// Check if a specific user exists
app.get("/user/:email", (req, res) => {
  const email = req.params.email;
  const user = users.find(u => u.email === email);
  
  if (user) {
    return res.json({
      found: true,
      user: { name: user.name, email: user.email }
    });
  } else {
    return res.json({
      found: false,
      message: "User not found"
    });
  }
});

app.listen(8080, () => {
  console.log("Server Started on port 8080");
  console.log("Available endpoints:");
  console.log("- GET  /              - Server status");
  console.log("- GET  /users         - List all users (safe)");
  console.log("- GET  /debug/users   - List all users (with passwords)");
  console.log("- GET  /user/:email   - Check specific user");
  console.log("- POST /register      - Register new user");
  console.log("- POST /login         - Login user");
});