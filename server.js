const express = require('express');
const bodyParser = require('body-parser')

const app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Search for Tweets within the past seven days
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/recent-search

const needle = require('needle');

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.TWITTER_BEARER_TOKEN;

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

let tweetResult = []


app.post('/', (req, res) => {

    async function getRequest() {
        const query = req.body.tweetContext
        const params = {
            'query': query,
            'tweet.fields': 'author_id,attachments,entities',
            'user.fields': 'description,profile_image_url,entities,url',
            'expansions': 'author_id'

        }

        const res = await needle('get', endpointUrl, params, {
            headers: {
                "User-Agent": "v2RecentSearchJS",
                "authorization": `Bearer ${token}`
            }
        })


        if (res.body) {
            return res.body;
        } else {
            throw new Error('Unsuccessful request');
        }
    }

    (async () => {
        try {
            const response = await getRequest();
            tweetResult.push(response)
            res.send(response)
        } catch (e) {
            console.log(e);
        }
    })();


})

app.listen('5000', () => {
    console.log("Node server started on port 5000")
})