const userModel = require('../models/auth.model.js');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config()


const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields." })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email." })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." })
        }

        const userAlreadyExists = await userModel.findOne({
            $or:
                [{ username }, { email }]
        })

        if (userAlreadyExists) {
            return res.status(409).json({ message: "User already exists." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            message: "User registered successfully.",
            token: token,
            user: {
                id: user._id,
                name: user.username,
                email: user.email
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong." })

    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields." })
        }

        const user = await userModel.findOne(
            { email }
        )

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." })
        }

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.status(200).json({
            message: "Login successful.",
            token: token,
            user: {
                id: user._id,
                name: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong." })

    }
}

const logoutUser = async (req, res) => {
    try {

        res.status(200).json({message: "Logged out successfully."})

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Somthing went wrong."})
        
    }
}


module.exports = { registerUser, loginUser, logoutUser }