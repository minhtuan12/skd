import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "@/models/admin";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        const username = "admin";
        const password = "Admin123";

        const hashed = await bcrypt.hash(password, 10);
        await Admin.findOneAndUpdate({username}, {password: hashed}, {new: true, upsert: true});
        console.log("✅ Admin account created:", username);

        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Seeding error:", err);
        process.exit(1);
    }
}

seed();
