import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/modals/userModal";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { error, log } from "console";
import { sendEmail } from "@/utils/mailer";

// Connect to Database
connectDB();

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();
        log({ username, email, password });
        // Check if user already exists
        const existingUser = await User.find({ email });

        if (existingUser.length > 0) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        log(hashedPassword);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        if (!savedUser) {
            return NextResponse.json({ message: "Error saving user" }, { status: 500 });
        }
        // send Verification Email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id,
        });

        return NextResponse.json({ message: "User registered successfully", status: true, savedUser }, { status: 201 });
    } catch (error) {
        console.error("Error during user registration:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

