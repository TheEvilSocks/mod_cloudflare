## mod_cloudflare ##

Based on mod_cloudflare.c, this ExpressJS middleware will replace the IP variable with the correct remote IP sent from CloudFlare. 


To install, simple run:

    npm install mod_cloudflare --save

### Usage ###

```javascript
const express = require('express')
const app = express()

const mod_cloudflare = require('mod_cloudflare');

app.use(mod_cloudflare());

app.get('/', function (req, res) {
  res.send(`Your IP is: {$req.ip}`);
})

app.listen(3000);
```
## Options ##

By default mod_cloudflare will still accept non-cloudflare connections. This can be changed by passing an object with the desired options to the mod_cloudflare constructor.

Option | Default Setting | Description
------------ | ------------- | ------------- 
CloudFlareRemoteIPHeader | `"CF-Connecting-IP"` | The header which contains the original IP.
DenyAllButCloudflare | `false` | Deny all requests that aren't sent via CloudFlare.
CloudFlareRemoteIPTrustedProxy | `[ ]` | Additional array of IP addresses or ranges which are to be treated as CloudFlare IPs.
ForbiddenPage | `null` | Only served to denied clients. The path to serve as 403 FORBIDDEN page.
