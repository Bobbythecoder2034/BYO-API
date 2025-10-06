import express from 'express'
import fs from 'fs'
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

async function readJSON(fp, fallback) {
  try {
    const txt = await fs.readFile(fp, "utf-8");
    return JSON.parse(txt);
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw err;
  }
}
async function writeJSON(fp, data) {
  const txt = JSON.stringify(data, null, 2);
  await fs.writeFile(fp, txt, "utf-8");
}

app.post("/api", async (req,res)=>{
    try{
        const {name, airSpeed, walkSpeed, weight, fastestOutOfShield, homeFranchise} = req.body || {}
        // if(!name || !airSpeed || !walkSpeed || !weight || !fastestOutOfShield || !homeFranchise){
        //     return res.status(400).json({ error: "name, Air Speed, Walk Speed, weight, Fastest Out of Shield, Home Franchise are required" });
        // }
        const current = await readJSON(SUBMISSIONS_PATH, []);
        const item = {
            name: String(name).trim,
            airSpeed: String(airSpeed).trim,
            walkSpeed: String(walkSpeed).trim,
            weight: String(weight).trim,
            fastestOutOfShield: String(fastestOutOfShield).trim,
            homeFranchise: String(homeFranchise).trim,
        }
        current.push(item)
        await writeJSON(SUBMISSIONS_PATH, current)
        res.status(201).json({ ok:true, submission: item})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Failed to save submission" });
    }
})
app.get("",(req,res)=>{

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
  res.status(404).json({ error: "Page not found" });
});
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});