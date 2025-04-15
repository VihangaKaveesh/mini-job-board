// /lib/auth.ts
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(input: string, hashed: string) {
  return await bcrypt.compare(input, hashed);
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload & { id: number, email: string } | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  
      // Ensure it's an object and contains `id`
      if (typeof decoded === 'object' && 'id' in decoded) {
        return decoded as JwtPayload & { id: number, email: string };
      }
  
      return null;
    } catch (err) {
      return null;
    }
}
