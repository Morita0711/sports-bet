const express = require("express");
const axios = require("axios");
const fs = require("fs");
const cron = require("node-cron");
const path = require("path");
let futeboolCompetitionsFilePath = path.join(
  __dirname,
  "../../../../public/Json/SportCompetitiosJson/futeboolCompetitions.json"
);
let baseballCompetitionsFilePath = path.join(
  __dirname,
  "../../../../public/Json/SportCompetitiosJson/baseballCompetitions.json"
);
let basketballCompetitionsFilePath = path.join(
  __dirname,
  "../../../../public/Json/SportCompetitiosJson/basketballCompetitions.json"
);
let icehockeyCompetitionsFilePath = path.join(
  __dirname,
  "../../../../public/Json/SportCompetitiosJson/icehockeyCompetitions.json"
);
let tennisCompetitionsFilePath = path.join(
  __dirname,
  "../../../../public/Json/SportCompetitiosJson/tennisCompetitions.json"
);
const getFuteboolCompetitions = () => {
  axios({
    mehto: "get",
    url: `https://proxy.bets.com.br/soccer/trial/v4/pt/competitions.json?api_key=4v8qsm5w6pgcns228e6pz2vz`,
  })
    .then((res) => {
      let data = JSON.stringify([], null, 2);
      if (res.data.competitions.length > 0)
        data = JSON.stringify(res.data.competitions, null, 2);
      saveFile(futeboolCompetitionsFilePath, data);
      console.log("Futebool");
    })
    .catch((error) => {
      console.log(error);
    });
};
const getBasqueteCompetitions = () => {
  axios({
    mehto: "get",
    url: `https://proxy.bets.com.br/basketball/trial/v2/pt/competitions.json?api_key=rpqvd8kvav7srxnp7b2ua7mc`,
  })
    .then((res) => {
      let data = JSON.stringify([], null, 2);
      if (res.data.competitions.length > 0)
        data = JSON.stringify(res.data.competitions, null, 2);
      saveFile(basketballCompetitionsFilePath, data);
      console.log("Basquete");
    })
    .catch((error) => {
      console.log(error);
    });
};
const getTennisCompetitions = () => {
  axios({
    mehto: "get",
    url: `https://proxy.bets.com.br/tennis/trial/v3/pt/competitions.json?api_key=6d85gmk84bp3yjt47wdrjhs7`,
  })
    .then((res) => {
      let data = JSON.stringify([], null, 2);
      if (res.data.competitions.length > 0)
        data = JSON.stringify(res.data.competitions, null, 2);
      saveFile(tennisCompetitionsFilePath, data);
      console.log("Tennis");
    })
    .catch((error) => {});
};
const getIceHockeyCompetitions = () => {
  axios({
    mehto: "get",
    url: `https://proxy.bets.com.br/icehockey/trial/v2/pt/competitions.json?api_key=wmkcsepkbshnw9wma85tec5c`,
  })
    .then((res) => {
      let data = JSON.stringify([], null, 2);
      if (res.data.competitions.length > 0)
        data = JSON.stringify(res.data.competitions, null, 2);
      saveFile(icehockeyCompetitionsFilePath, data);
      console.log("IceHockey");
    })
    .catch((error) => {});
};
const getBaseballCompetitions = () => {
  axios({
    mehto: "get",
    url: `https://proxy.bets.com.br/baseball/trial/v2/pt/competitions.json?api_key=rbvvhfkr7vmy9heqbt6djt3c`,
  })
    .then((res) => {
      let data = JSON.stringify([], null, 2);
      if (res.data.competitions.length > 0)
        data = JSON.stringify(res.data.competitions, null, 2);
      saveFile(baseballCompetitionsFilePath, data);
      console.log("Baseball");
    })
    .catch((error) => {});
};
//Every 1 minute for football competitions
cron.schedule("0 */1 * * * *", function () {
  //getFuteboolCompetitions();
});

//Every 1 Minute for basketball competitions
cron.schedule("0 */1 * * * *", function () {
  //getBasqueteCompetitions();
});

//Every 30 second for Tennis competitions
//2	Calls per second
//5,000	Calls per month
cron.schedule("0 */1 * * * *", function () {
  //getTennisCompetitions();
});

//Every 1 Minute for Ice Hockey competitions
//Key Rate Limits
//1	Calls per second
//1,000	Calls per month
cron.schedule("0 */1 * * * *", function () {
  //getIceHockeyCompetitions();
});

//Every 1 Minute for Baseball competitions
//Key Rate Limits
//1	Calls per second
//1,000	Calls per month
cron.schedule("0 */1 * * * *", function () {
  //getBaseballCompetitions();
});

const saveFile = (filePath, data) => {
  try {
    fs.writeFile(filePath, data, function (err) {
      if (err) {
        console.log("File Create:" + err);
      }
    });
  } catch (error) {}
};
export default function handler(req, res) {
  res.status(200).json({ Message: "Scheduler Is Started" });
}
