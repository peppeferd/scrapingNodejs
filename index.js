const cheerio = require("cheerio");
const fs = require("fs");
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/scraping", (req, res) => {
  try {
    const theUrl = req.body;
    console.log(req.body);
    /*     const url = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3";
     */
    console.log(theUrl);
    async function scrapeData() {
      try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(req.body.theUrl);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        // Select all the list items in plainlist class
        const listItems = $(".plainlist ul li");
        // Stores data for all countries
        const countries = [];
        // Use .each method to loop through the li we selected
        listItems.each((idx, el) => {
          // Object holding data for each country/jurisdiction
          const country = { name: "", iso3: "" };
          // Select the text content of a and span elements
          // Store the textcontent in the above object
          country.name = $(el).children("a").text();
          country.iso3 = $(el).children("span").text();
          // Populate countries array with country data
          countries.push(country);
        });
        // Logs countries array to the console
        console.dir(countries);
        // Write countries array in countries.json file
        fs.writeFile(
          "coutries.json",
          JSON.stringify(countries, null, 2),
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("Successfully written data to file");
          }
        );

        return res.status(200).json({
          result: countries,
        });
      } catch (err) {
        console.error(err);
      }
    }
    // Invoke the above function
    scrapeData();
  } catch (error) {
    console.log(error);
  }
});
// URL of the page we want to scrape
app.listen(5000, () => {
  console.log("Server started at 5000");
});
