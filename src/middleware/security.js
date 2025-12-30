const rateLimit = require('express-rate-limit');

// Rate limiting: 20 requests per minute per IP
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again after a minute'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware to block bots scanning for sensitive files
const blockBots = (req, res, next) => {
  const sensitivePaths = [
    '/.env',
    '/.git',
    '/wp-admin',
    '/wp-login.php',
    '/config.php',
    '/.aws',
    '/.ssh',
    '/composer.json',
    '/package.json',
    '/.vscode',
    '/id_rsa'
  ];

  if (sensitivePaths.some(path => req.path.toLowerCase().includes(path))) {
    console.warn(`Blocked suspicious request to ${req.path} from IP: ${req.ip}`);
    return res.status(403).json({ message: 'Access denied' });
  }

  next();
};

module.exports = {
  limiter,
  blockBots
};
