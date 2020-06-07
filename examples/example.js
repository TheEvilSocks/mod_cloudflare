const express = require('express')
const app = express()

const mod_cloudflare = require('mod_cloudflare');

app.use(mod_cloudflare());

app.get('/', function (req, res) {
  res.send(`Your IP is: ${req.ip}`);
})

app.listen(3000);
