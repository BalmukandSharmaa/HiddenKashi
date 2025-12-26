import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const users = [
    {
        fullName: "Test Customer",
        email: "customer@test.com",
        password: "password123",
        role: "customer",
        phone: "1234567890"
    },
    {
        fullName: "Hotel Owner",
        email: "owner@test.com",
        password: "password123",
        role: "hotel_owner",
        phone: "9876543210",
        businessName: "Test Hotel Business",
        businessLicense: "LICENSE123456"
    },
    {
        fullName: "Admin User",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
        phone: "5551234567"
    }
];

const registerUsers = async () => {
    try {
        await mongoose.connect(`${process.env.MONGOOSE_URI}/swagatam_kashi`);
        console.log('Connected to MongoDB\n');

        for (const userData of users) {
            try {
                // Check if user exists
                const existingUser = await User.findOne({ email: userData.email });
                if (existingUser) {
                    console.log(`✗ ${userData.email} already exists`);
                    continue;
                }

                // Hash password before creating
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                
                // Insert directly without hooks
                await User.collection.insertOne({
                    ...userData,
                    password: hashedPassword,
                    isVerified: false,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                
                console.log(`✓ Registered: ${userData.email} (${userData.role})`);
            } catch (error) {
                console.log(`✗ Failed: ${userData.email} - ${error.message}`);
            }
        }

        console.log('\n=== Registration Complete ===');
        console.log('\nTest Credentials:');
        console.log('  Customer: customer@test.com / password123');
        console.log('  Owner:    owner@test.com / password123');
        console.log('  Admin:    admin@test.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

registerUsers();
