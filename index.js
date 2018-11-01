const url = require('url');

module.exports = {
    init: function (data) {
        this.BLACKLISTED_EXTS = (process.env.BLACKLISTED_EXTS && process.env.BLACKLISTED_EXTS.split(',')) || [];
        this.options = data.options ? data.options : {};
    },

    tabCreated: function (req, res, next) {
        const tab = req.prerender.tab;

        // Apply for sub request to chrome browser
        tab.Network.requestIntercepted(({interceptionId, request}) => {
            const ext = url.parse(request.url).pathname.split('.').pop();

            // perform a test against the intercepted request
            const blocked = this.BLACKLISTED_EXTS.indexOf(ext) > -1;
            if (this.options.logRequests && blocked) {
                console.log(`- ${blocked ? 'BLOCK' : 'ALLOW'} ${request.url}`);
            }

            // decide whether allow or block the request
            tab.Network.continueInterceptedRequest({
                interceptionId,
                errorReason: blocked ? 'Aborted' : undefined
            });
        });
        tab.Network.setRequestInterception({patterns: [{urlPattern: '*'}]});

        // Apply original request
        const originalUrlExt = url.parse(req.prerender.url).pathname.split('.').pop();

        if (this.BLACKLISTED_EXTS.indexOf(originalUrlExt) > -1) {
            res.send(404);
        } else {
            next();
        }
    }
};
