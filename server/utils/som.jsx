const somtoday = require("../../node_modules/somtoday.js").default;
const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const dbPath = path.join(__dirname, "../user.json");

let mail;
let password;

fs.readFile(dbPath, "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  try {
    const data = JSON.parse(jsonString);
    mail = data[0].mail;
    password = data[0].password;
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

let accessToken = "";

module.exports = addHomework;
async function addHomework() {
  const org = await somtoday.searchOrganisation({
    name: "Your School Here",
  });
  if (!org) throw new Error("School not found");
  const user = await org.authenticate({
    username: mail,
    password: password,
  });
  const students = await user.getStudents();
  accessToken = students[0].__user.accessToken;
  addDB();
}

function addDB() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const formattedDate = date.toISOString().split("T")[0];

  axios
    .get("https://api.somtoday.nl/rest/v1/studiewijzeritemafspraaktoekenningen", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        begintNaOfOp: formattedDate,
      },
    })
    .then((res) => {
      const items = res.data.items;
      for (i = 0; i < items.length; i++) {
        const info = items[i].studiewijzerItem;
        let date = items[i].datumTijd;
        date = date.split("T")[0].split("-").reverse().join("-");
        date = date.split("-").reverse().join("-");

        const data = {
          id: uuidv4(),
          name: info.onderwerp || info.omschrijving.substring(0, 40),
          type: info.huiswerkType,
          date: date,
        };

        try {
          const jsonData = fs.readFileSync("../server/db.json");
          const db = JSON.parse(jsonData);
          if (!db.some((item) => item.name === data.name)) {
            db.push(data);
            fs.writeFileSync("../server/db.json", JSON.stringify(db, null, 2));
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
}
