import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_only";

// Extracts and verifies the JWT from incoming requests
export function getUserFromToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null; // No token found
  }

  const token = authHeader.split(" ")[1];
  
  try {
    // Returns the payload we signed during login (userId and role)
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch (error) {
    return null; // Token is expired or invalid
  }
}