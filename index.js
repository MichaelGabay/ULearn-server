const express = require("express")
const path = require("path")
const http = require("http")
const routesInit = require("./api/routes/routes-configuration")
const app = express()
require('./api/db/mongoConnect')
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.all('*', (req, res, next) => {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token,apiKey');
    next();
});
routesInit(app);
const server = http.createServer(app);
let port = process.env.PORT || "3000";
server.listen(port, () => { console.log("api work") });




