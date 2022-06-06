(async () => {
  const dns = require("dns");
  const tcpp = require("tcp-ping");
  var util = require("util");

  const tcpPing = util.promisify(tcpp.ping);

  const TIMEOUT_DNS = 4 * 1000;
  const TIMEOUT_PORT = 2 * 1000;

  let hosts = [];

  // I better use Minimist but this is so straight forward I can't resist
  const JSONMODE = process.argv.slice(2).some((arg) => arg === "--json");

  // This is just a POC I don't like it and rather use NewRelic and such, it has many utilities, it's fast, relible and most importently it's free.
  let JsonLogger = undefined;
  if (JSONMODE) {
    JsonLogger = [];
  }

  // Extremely ineffecient since it work sync and buffer ALL the file in memory before it starts, yet, IDC.
  require("fs")
    .readFileSync("input.txt", "utf-8")
    .split(/\r?\n/)
    .forEach(function (line) {
      // ln 0 is the hostname, ln 1 is the port
      let ln = line.split(" ");
      hosts[ln[0]] = hosts[ln[0]] || [];
      hosts[ln[0]].push(ln[1]);
    });

  customLog(hosts);

  for (const host in hosts) {
    // Resolve DNS should be done once per host
    customLog(`Resolving ${host}`);
    try {
      var start = new Date().getTime();
      let resolve = await nsLookup(host, TIMEOUT_DNS);
      var end = new Date().getTime();
      customLog(`Resolved ${host} in ${end - start}ms`);
      if (!resolve) {
        customLog(`${host} not resolved`);
        continue;
      }

      customLog(resolve);

      let promises = [];
      hosts[host].forEach(async (port) => {
        promises.push(
          tcpPing({
            address: host,
            port: port,
            timeout: TIMEOUT_PORT,
            attempts: 1,
          })
        );
      });

      // Await for all the promises to finish
      const result = await Promise.all(promises);
      result.forEach((res) => {
        customLog(`${host}:${res.port} is ${res.max ? "open" : "closed"}`);
      });
    } catch (e) {
      // We really should handle this error better
      console.log(e);
    }
  }

  function customLog(obj) {
    if (JSONMODE) {
      JsonLogger.push(obj);
    } else {
      console.log(obj);
    }
  }

  // Purely ripped off https://stackoverflow.com/a/71009354/3852918
  function nsLookup(domain, timeout) {
    return new Promise((resolve, reject) => {
      if (domain === "localhost") {
        resolve(["127.o.o.1"]);
      }
      let finished = false;

      const timer = setTimeout(() => {
        finished = true;
        reject();
      }, timeout);

      const callback = (_err, result) => {
        clearTimeout(timer);
        if (!finished) resolve(result);
      };

      dns.resolveNs(domain, callback);
    });
  }

  process.on("uncaughtException", function (exception) {
    // Don't you like to do absolutly nothing when you get an error? :D
    console.log(exception);
  });

  if (JSONMODE) {
    console.log(JSON.stringify(JsonLogger));
  }
})();
