import { connectDB } from "@/dbConfig/dbConfig";    
import { NextResponse } from "next/server";

// Connect to Database
connectDB();

export async function GET() {
    try {
        const response = NextResponse.json(
            { success: true, message: "Logout successful" },
            { status: 200 }
        );
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        }); 
        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }   
}