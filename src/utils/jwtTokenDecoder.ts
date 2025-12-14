import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function decodeJWTToken(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        
        const decodedToken = jwt.verify(token!, process.env.TOKEN_SECRET!) as JwtPayload; 
        return decodedToken.id;
    } catch (error) {
        throw new Error("Error: " + (error as Error).message);
    }   
}