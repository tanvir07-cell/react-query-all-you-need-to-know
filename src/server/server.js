import http from "node:http";
import fs from "node:fs/promises";

const server = http.createServer(async (req, res) => {


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {

        res.writeHead(200);
        res.end();
        return; // Ensure no further processing for this request
    }


    // Handle GET request to root
    if (req.method === 'GET' && req.url === '/') {
        const path = new URL("./users.json", import.meta.url).pathname;
        try {
            const readFile = await fs.readFile(path, "utf-8");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(readFile);
            return; // Ensure no further processing for this request
        } catch (e) {
            console.log(e);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return; // Ensure no further processing for this request
        }
    }

    // Handle POST request to /submit
    if (req.method === 'POST' && req.url === '/submit') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const data = JSON.parse(body);
            console.log('Received data:', data);

            const path = new URL("./users.json", import.meta.url).pathname;
            try {
                const readFile = await fs.readFile(path, "utf-8");
                const { users } = JSON.parse(readFile);
                users.push(data);
                await fs.writeFile(path, JSON.stringify({ users }, null, 2));
            } catch (e) {
                console.log(e);
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data received successfully', user: data }));
            return; // Ensure no further processing for this request
        });
        return; // It's important to return here to prevent further execution until async handling is completed
    }


    // Default case for unhandled routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
