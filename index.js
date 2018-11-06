const url = require('url');
const debug = false;

const regExpTest = (reg, string) => {
    try {
        return new RegExp(reg).test(string);
    }
    catch (e) {
        console.error('Regex error:', e);
        return false;
    }
};

module.exports = {
    init: function (data) {
        this.BLACKLISTED_EXTS = (process.env.BLACKLISTED_EXTS && process.env.BLACKLISTED_EXTS.split(',')) || [];
        this.BLACKLISTED_DOMAIN = (process.env.BLACKLISTED_DOMAIN && process.env.BLACKLISTED_DOMAIN.split(',')) || [];
        this.BLACKLISTED_MATCH = (process.env.BLACKLISTED_MATCH && process.env.BLACKLISTED_MATCH.split(',')) || [];

        this.options = data.options ? data.options : {};
    },

    tabCreated: function (req, res, next) {
        const tab = req.prerender.tab;

        // Apply for sub request to chrome browser
        tab.Network.requestIntercepted(({interceptionId, request}) => {

            const {blocked, type, data} = this.isBlocked(request.url);

            if (this.options.logRequests && blocked || debug) {
                console.log(`- ${blocked ? 'BLOCK' : 'ALLOW'} ${request.url}`, blocked ? `by rule ${type}:${data}` : '');
            }

            tab.Network.continueInterceptedRequest({
                interceptionId,
                errorReason: blocked ? 'Aborted' : undefined
            });
        });
        tab.Network.setRequestInterception({patterns: [{urlPattern: '*'}]});

        let {blocked} = this.isBlocked(req.prerender.url);
        // Apply check for prerender url
        if (blocked) {
            res.send(404);
        }
        else {
            next();
        }
    },

    /**
     * Get is Blocked url by check blacklist domain, blacklist extension and fully regex matched
     * @param requestUrl
     * @returns {*}
     */
    isBlocked: function (requestUrl) {
        const parsedUrl = url.parse(requestUrl);

        // perform domain test
        for (let i in this.BLACKLISTED_DOMAIN) {
            let reg = this.BLACKLISTED_DOMAIN[i];
            let blocked = regExpTest(reg, parsedUrl.hostname);

            if (blocked) {
                return {blocked: true, type: 'domain', data: reg};
            }
        }
        const ext = parsedUrl.pathname.split('.').pop();

        // perform extension test
        if (this.BLACKLISTED_EXTS.indexOf(ext) > -1) {
            return {blocked: true, type: 'extension', data: ext};

        }
        // perform url match
        for (let i in this.BLACKLISTED_MATCH) {
            let reg = this.BLACKLISTED_MATCH[i];
            let blocked = regExpTest(reg, requestUrl);

            if (blocked) {
                return {blocked: true, type: 'match', data: reg};

            }
        }

        return {blocked: false, type: 'domain', data: ''};

    }
};
