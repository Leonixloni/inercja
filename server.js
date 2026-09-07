const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./login/register.html/models/User");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Użytkownik o takiej nazwie lub emailu już istnieje."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Rejestracja zakończona sukcesem!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Wystąpił błąd serwera."
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na porcie ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Połączono z MongoDB!"))
    .catch((err) => console.error("❌ Błąd połączenia z MongoDB:", err.message));
