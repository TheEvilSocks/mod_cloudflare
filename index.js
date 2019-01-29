const DEFAULT_OPTIONS = {
	CloudFlareRemoteIPHeader: "CF-Connecting-IP",
	DenyAllButCloudflare: false,
	CloudFlareRemoteIPTrustedProxy: [ ],
	ForbiddenPage: null
};

const IPCIDR = require("ip-cidr");


const CloudFlareIPs = require('./CloudFlareIPs.json').map(r => new IPCIDR(r));


module.exports = function(options = {}){
	options = Object.assign(DEFAULT_OPTIONS, options);

	options.CloudFlareRemoteIPTrustedProxy = options.CloudFlareRemoteIPTrustedProxy.map(r => new IPCIDR(r));

	return function(req, res, next){
		var isCloudFlare = false;
		
		let _ip = req.ip;
		if(/^::ffff:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(_ip))
			_ip = _ip.substring(7);

		for(let range of CloudFlareIPs){
			if(range.contains(_ip)){
				isCloudFlare = true;
				break;
			}
		}

		if(options.CloudFlareRemoteIPTrustedProxy.length > 0 && !isCloudFlare){
			for(let range of options.CloudFlareRemoteIPTrustedProxy){
				if(range.contains(_ip)){
					isCloudFlare = true;
					break;
				}
			}
		}

		if(options.DenyAllButCloudflare === true && !isCloudFlare){
			if(options.ForbiddenPage != null){
				req.app._router.stack.find(m => m.route !== undefined && m.route.path == options.ForbiddenPage).handle(req,res,next);
			}else{
				res.status(403).send();
			}
			return;
		}

		if(isCloudFlare){
			Object.defineProperty(req, 'ip', {
				configurable: true,
				enumerable: true,
				get: function ip (){ return req.get(options.CloudFlareRemoteIPHeader) }
			});
		}
		
		next();
	}
}