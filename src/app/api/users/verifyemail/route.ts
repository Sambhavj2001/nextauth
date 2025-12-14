import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/modals/userModal";
import { NextRequest, NextResponse } from "next/server";
import { log } from "console";



export async function POST(request: NextRequest) {
    try {
        // Connect to Database
        await connectDB();
        const { token } = await request.json();
        log(token);

        // Find user with the given verification token
        const user = await User.findOne({ verificationToken: token, verificationTokenExpiry: { $gt: Date.now() } });
        log("User found:", user);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 400 }
            );
        }
        log("User found for email verification:", user);
        // Update user's email verification status
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return NextResponse.json(
            { success: true, message: "Email verified successfully" },
            { status: 200 }
        );
    } catch (error) {
        log("Error in email verification:", error);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}   