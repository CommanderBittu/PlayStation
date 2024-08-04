const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const pasth = require('path');
const collection = require('./config');
const stripeGateway = stripe('sk_test_51PU71kJWwX7zHEUSByNTCXpqX6hLZBentIqyB7JaQtYA9Cdnk49uMc8pTkrOs7nzxP04N7N1fa49vSx9BXRYoKQy00PycfuAuu');
dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());



app.use(express.urlencoded({ extended: false }));

// Initialize Stripe with your secret key



// Serve static files like CSS, JS, images from the 'public' directory
app.use(express.static("public"));

// Set view engine (if using EJS or other templating engine)
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("amazonn");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/store", (req, res) => {
    res.render("store");
});
app.get("/mw3", (req, res) => {
    res.render("mw3");
});
app.get("/spider", (req, res) => {
    res.render("spider");
});
app.get("/wwe", (req, res) => {
    res.render("wwe");
});
app.get("/shock", (req, res) => {
    res.render("shock");
});
app.get("/gow", (req, res) => {
    res.render("gow");
});
app.get("/ac", (req, res) => {
    res.render("ac");
});
app.get("/star", (req, res) => {
    res.render("star");
});
app.get("/accessories", (req, res) => {
    res.render("accessories");
});
app.get("/station", (req, res) => {
    res.render("station");
});
app.get("/controller", (req, res) => {
    res.render("controller");
});
app.get("/audio", (req, res) => {
    res.render("audio");
});
app.get("/remote", (req, res) => {
    res.render("remote");
});
app.get("/storage", (req, res) => {
    res.render("storage");
});
app.get("/specialControllers", (req, res) => {
    res.render("specialControllers");
});
app.get("/cover", (req, res) => {
    res.render("cover");
});
app.get("/cable", (req, res) => {
    res.render("cable");
});
app.get("/checkout", (req, res) => {
    res.render("checkout");
});
app.get("/cancel", (req, res) => {
    res.render("cancel");
});
app.get("/success", (req, res) => {
    res.render("success");
});
//stripe
app.post('/stripe-checkout', async (req, res) => {
    const items = req.body.items;

    // Prepare line items for the checkout session
    const lineItems = items.map((item) => {
        const unitAmount = parseInt(parseFloat(item.price.replace('Rs ', '').replace(/,/g, '')) * 100);
        return {
            price_data: {
                currency: 'INR',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: unitAmount,
            },
            quantity: 1,
        };
    });

    try {
        // Create a new Stripe checkout session
        const session = await stripeGateway.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: 'http://localhost:5000/success',
            cancel_url: 'http://localhost:5000/cancel',
            billing_address_collection: 'required',
            line_items: lineItems,
        });

        // Return the URL of the Stripe checkout session to the client
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).json({ error: 'Failed to create Stripe checkout session' });
    }
});


app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

   
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
       
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.render("login");
    }
});


app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name not found");
        } else {
           
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (!isPasswordMatch) {
                res.send("Wrong Password");
            } else {
                res.render("amazonn", { username: check.name });
            }
        }
    } catch {
        res.send("Wrong Details");
    }
});


const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});