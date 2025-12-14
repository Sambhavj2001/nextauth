import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { decodeJWTToken } from "@/utils/jwtTokenDecoder";
import User from "@/modals/userModal";
// Connect to Database
connectDB();

export async function POST(request: NextRequest) {
    try {
        const userId = await decodeJWTToken(request);
        const user = await User.findById(userId).select("-password -__v -verificationToken -verificationTokenExpiry");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "User fetched successfully", user },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "Server Error" },
            { status: 500 }
        );
    }
}