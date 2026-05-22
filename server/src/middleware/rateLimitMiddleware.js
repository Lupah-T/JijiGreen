const buckets = new Map();

export const rateLimit = ({ windowMs = 60_000, max = 20, keyPrefix = "global" } = {}) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.user?.id || req.ip}`;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (bucket.resetAt <= now) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }

    return next();
  };
};
