const cooldowns = new Map();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress ||
        "unknown";

    const now = Date.now();

    if (
        cooldowns.has(ip) &&
        now - cooldowns.get(ip) < 10000
    ) {
        return res.status(429).json({
            error: "Wait 10 seconds"
        });
    }

    cooldowns.set(ip, now);

    const { username, message } = req.body;

    console.log(`${username}: ${message}`);

    return res.status(200).json({
        success: true,
        formatted: `${username}: ${message}`
    });
}
