const Sentry = require("@sentry/node");

function alert() {
    Sentry.init({
        dsn: "https://8e58381899d546ffaa797bd27eda0784@o447852.ingest.sentry.io/5428313",
        tracesSampleRate: 1.0,
    });
}

module.exports = alert