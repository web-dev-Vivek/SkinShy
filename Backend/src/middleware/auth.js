const { verifyToken } = require('@clerk/backend');

/**
 * Middleware to verify Clerk JWT tokens
 * Extracts token from Authorization header and validates it
 * Sets req.userId (Clerk ID) on request for downstream routes
 */
const authenticate = async (req, res, next) => {
  try {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid Authorization header'
      });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    try {
      // Verify the token with Clerk
      const decoded = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
      });

      // Set the user ID from Clerk on the request object
      req.userId = decoded.sub; // Clerk uses 'sub' for user ID
      req.clerkUser = decoded;

      next();
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

module.exports = {
  authenticate
};
