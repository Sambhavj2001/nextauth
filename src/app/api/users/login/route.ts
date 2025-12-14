import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/modals/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { log } from "console";

// Connect to Database
connectDB();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        log({ email, password });

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 400 }
            );
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 400 }
            );
        }

        const tokenDetails = {
            id: user._id,
            email: user.email,
            username: user.username
        };

        const token = await jwt.sign(tokenDetails, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

        const response = NextResponse.json(
            { success: true, message: "Login successful", status: true },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
        });
        return response;
    } catch (error) {
        log("Error in user login:", error);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}