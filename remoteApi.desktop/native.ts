import http from "http";

let qNum = 0;
let qProcessedNum = 0;
const inQueue: Map<number, string> = new Map();
const outQueue: Map<number, string> = new Map();



const server = http.createServer(async (req, res) => {
    if (req.url !== "/backend")
        console.log(`Received request: ${req.method} ${req.url}`);
    try {
        res.setHeader("Keep-Alive", "timeout=15");
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        switch (req.url) {
            case "/backend":
                if (req.method === "GET") {
                    if (inQueue.has(qProcessedNum)) {
                        var response: string = JSON.stringify({ num: qProcessedNum, cmd: JSON.parse(inQueue.get(qProcessedNum)!) });
                        res.writeHead(200)
                            .end(response);
                        qProcessedNum++;
                        return;
                    } else {
                        var response: string = JSON.stringify({ num: qNum, procNum: qProcessedNum });
                        res.writeHead(404)
                            .end(response);
                        return;
                    }
                } else if (req.method === "POST") {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk;
                    });
                    req.on('end', () => {
                        var tmp = JSON.parse(body);
                        console.log(tmp);
                        if (inQueue.has(tmp.num)) {
                            inQueue.delete(tmp.num);
                            outQueue.set(tmp.num, JSON.stringify(tmp.payload));
                            var response: string = JSON.stringify({ num: qNum, procNum: qProcessedNum });
                            res.writeHead(204);
                            res.end();
                            return;
                        } else {
                            res.writeHead(404);
                            res.end();
                            return;
                        }
                    });
                }
                return;
            case "/gameActivity/toggle":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "toggleGameActivity" }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;
            case "/gameActivity":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "getGameActivity" }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;
            case "/gameActivity/true":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "toggleGameActivity", value: true }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;

            case "/gameActivity/false":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "toggleGameActivity", value: false }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;
            case "/streamerMode/true":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "setStreamerMode", value: true }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;

            case "/streamerMode/false":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "setStreamerMode", value: false }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;

            case "/vc/mute/toggle":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "toggleMuted" }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;

            case "/vc/deaf/toggle":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "toggleDeafened" }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;
            case "/vc/join":
                if (req.method === "POST") {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk;
                    });
                    req.on('end', async () => {
                        var response: string = await handleRequest(JSON.stringify({ method: "vcJoin", channel: JSON.parse(body).channel, call: false }));
                        res.writeHead(200);
                        res.end(response);
                    });
                }
                return;
            case "/vc/call":
                if (req.method === "POST") {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk;
                    });
                    req.on('end', async () => {
                        var response: string = await handleRequest(JSON.stringify({ method: "vcJoin", channel: JSON.parse(body).channel, call: true }));
                        res.writeHead(200);
                        res.end(response);
                    });
                }
                return;
            case "/vc/leave":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "vcLeave" }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;

            case "/vc/setvolume":
                if (req.method === "POST") {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk;
                    });
                    req.on('end', async () => {
                        var response: string = await handleRequest(JSON.stringify({ method: "setVolume", user: JSON.parse(body).user, volume: JSON.parse(body).volume }));
                        res.writeHead(200);
                        res.end(response);
                    });
                }

                return;
            case "/vc/playsound":
                if (req.method === "POST") {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk;
                    });
                    req.on('end', async () => {
                        var response: string = await handleRequest(JSON.stringify({ method: "playSound", body: JSON.parse(body) }));
                        res.writeHead(200);
                        res.end(response);
                    });
                }
                return;
            case "/message":
                if (req.method === "POST") {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk;
                    });
                    req.on('end', async () => {
                        var j = JSON.parse(body);
                        var response: string = await handleRequest(JSON.stringify({ method: "sendMessage", channel: j.channel, msg: j.msg }));
                        res.writeHead(200);
                        res.end(response);
                    });
                }

                return;
            case "/user":
                if (req.method === "GET") {
                    var response: string = await handleRequest(JSON.stringify({ method: "getUser" }));
                    res.writeHead(200);
                    res.end(response);
                }
                return;

            default:
                res.writeHead(404);
                res.end(JSON.stringify({ err: "Not Found" }));
                return;
        }
    }
    catch (error) {
        console.log(error);
        res.writeHead(500);
        res.end(JSON.stringify({ err: error }));
        return;
    }
});
export function start(_, port: number, ip: string) {
    server.listen(port, ip, () => {
        console.log(`Server is running on ` + ip + ":" + port);
    });
}
export function stop() {
    server.close();
}

function handleRequest(data: string, MAX_RETRIES = 200): Promise<string> {
    var num = qNum++;
    inQueue.set(num, data);
    return new Promise((resolve, reject) => {
        var retries = 0;
        const loop = () => {
            retries++;
            if (retries > MAX_RETRIES) reject(new Error("timeout"));
            if (outQueue.has(num)) {
                var tmp: string = outQueue.get(num)!;
                resolve(tmp);
                outQueue.delete(num);
            } else setTimeout(loop, 20);
        };
        loop();
    });
}
