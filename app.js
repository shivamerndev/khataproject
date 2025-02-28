const express = require("express");
const path = require("path");
let app = express();
let fs = require("fs");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    fs.readdir(`./hisaab`, function (err, files) {
        if (err) return res.status(500).send(err);
        res.render("index", { files: files });
    })
});


app.get("/create", (req, res) => {
    res.render("create");
});

app.post("/createhisaab", (req, res) => {
    let currentDate = new Date();
    let formattedDate = currentDate.toISOString().slice(0, 10).split("-").reverse().join("-");
    console.log(formattedDate);
    fs.writeFile(`./hisaab/${formattedDate}.txt`, req.body.saman, err => {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
});

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./hisaab/${req.params.filename}`, 'utf-8', (err, filedata) => {
        if (err) return res.status(500).send(err);
        res.render("edit", { filedata, filename: req.params.filename });
    })
});
app.post("/update/:filename", (req, res) => {
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.saman, function (err, data) {
        if (err) return res.status(500).send(err);
        res.redirect("/");

    })
});

app.get("/hisaab/:filename", (req, res) => {
    fs.readFile(`./hisaab/${req.params.filename}`, 'utf-8', (err, filedata) => {
        if (err) return res.status(500).send(err);
       res.render('hisaab',{filename: req.params.filename,filedata})
    })
})

app.get("/delete/:filename", (req, res) => {
    fs.unlink(`./hisaab/${req.params.filename}`, (err) => {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
 });

app.listen(3000);
