import express from 'express'
import fs from 'fs'
import {readFile, writeFile} from 'fs/promises'
import path from 'path'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const PUBLIC_DIR = path.join(__dirname, "public");
const SUBMISSIONS_PATH = path.join(DATA_DIR, "roster.json");
const IMAGES_SUBMISSIONS_PATH = path.join(DATA_DIR, "images.json");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

function callback(err){
  console.log("HELP ME")
}
app.set('view engine', 'ejs')

async function readJSON(fp, fallback) {
  console.log("start of reading")
  try {
    const txt = await readFile(fp, "utf8");
    return JSON.parse(txt);
  } catch (err) {
    console.log("read error")
  }
}
async function writeJSON(fp, data) {
  const txt = JSON.stringify(data, null, 2);
  await writeFile(fp, txt, "utf8", callback);
}

app.post("/api", async (req,res)=>{
    try{
        const {name, airSpeed, runSpeed, weight, fastestOutOfShield, homeFranchise} = req.body
        const current = await readJSON(SUBMISSIONS_PATH, []);
        const item = {
            name,
            airSpeed,
            runSpeed,
            weight,
            fastestOutOfShield,
            homeFranchise
        }
        console.log(current)
        current.push(item)
        console.log(current)
        await writeJSON(SUBMISSIONS_PATH, current)
        res.status(201).sendFile(path.join(PUBLIC_DIR, "index.html"))
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to save submission" });
    }
})
//Pass a character to display
app.post("/character", async (req,res)=>{
  try{
    
    const {name} = req.body
    
    const current = await readJSON(SUBMISSIONS_PATH, []);
    const maybe = current.find(x=>{
      return x.name.toLowerCase().trim() == name.toLowerCase().trim()
    })
    res.render('character', {roster:current, showcase:maybe})
  }catch(err){
    res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"))
  }
  
})

app.get("/fullRoster", async (req,res)=>{
  const current = await readJSON(SUBMISSIONS_PATH, []);
  res.render('full_roster', {roster:current})
})
app.get("",(req,res)=>{

})
app.patch("",(req,res)=>{

})
app.delete("",(req,res)=>{

})





app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});