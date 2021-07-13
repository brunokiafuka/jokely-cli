#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const yargs = require("yargs");
const axios = require("axios");


const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",

};


const options = yargs
    .usage("Usage: -s <search term>")
    .option("s", { alias: "search", describe: "Search term", type: "string", })
    .strict()
    .argv;



if (!options.search) {
    console.log(`Here is a random joke for you.`)
} else {
    console.log(`Searching for jokes about ${options.search}...`)
}


function fetchRemoteJoke() {
    const url = options.search ? `https://icanhazdadjoke.com/search?term=${escape(options.search)}` : "https://icanhazdadjoke.com/";
    return axios.get(url, { headers: { Accept: "application/json" } })
}

function getResponse(res) {
    if (options.search) {
        const { results } = res.data
        if (results.length === 0) {
            throw new Error("no jokes found 😩");
        }

        const length = results.length

        return results[Math.floor(Math.random() * length - 1) + 1].joke

    } else {
        return res.data.joke;
    }
}

function displayJoke(joke) {
    const cliGreeting = chalk.green.bold(`${joke} 🤪`);
    const msgBox = boxen(cliGreeting, boxenOptions);
    console.log(msgBox)
}


fetchRemoteJoke()
    .then(getResponse)
    .then(displayJoke)
    .catch(e => {
        const error = chalk.red.bold(e.message);

        const msgBox = boxen(error, boxenOptions);
        console.log(msgBox)
    })

