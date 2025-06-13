const express = require('express');
const app = express();

app.get('/status', (req, res) => {
    res.status(200).json({ status: "Running" });
});

app.get('/data', (req, res) => {
    res.status(200).json({ message: "Hello world!" });
});

app.get("/joke", async (req, res) => {
    await fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single")
        .then(data => data.json())
        .then(dataJson => res.status(200).json(dataJson))
        .catch(() => res.status(500).json({message: "Trouble connecting to the external api"}))
});

module.exports = app;