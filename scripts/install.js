const https = require('https');
const fs = require('fs');

const begin = Date.now();
console.log("Grabbing latest CloudFlare IPs..");
Promise.all([grabUrl("https://www.cloudflare.com/ips-v4"), grabUrl("https://www.cloudflare.com/ips-v6")]).then((ips) => {
	fs.writeFile("./CloudFlareIPs.json", JSON.stringify([].concat(ips[0], ips[1])), () => {console.log("Done!\nTook " + (Date.now() - begin) + "ms");});
}, (err) => {
	console.error(err);
	process.exit(1);
});




function grabUrl(url){
	return new Promise((f, r) => {
		var body = "";
		https.get(url, (res) => {
			if(res.statusCode != 200){
				r(new Error("StatusCode " + res.statusCode));
			}else{
				res.on('data', (d) => {
					body+=d;
				});
				res.on('end', () => {
					let _r = body.split('\n'); _r.pop(); // pop it to remove that last empty line
					f(_r);
				});
			}
		}).on('error', (e) => {
			r(e);
		});
	});
}