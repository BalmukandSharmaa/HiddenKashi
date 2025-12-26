import { Hotel } from "./models/hotel.models.js";
import { Tour } from "./models/tour.models.js";
import DBConnections from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const approveAllPending = async () => {
    try {
        await DBConnections();
        
        // Approve all pending hotels
        const hotelResult = await Hotel.updateMany(
            { status: 'pending' },
            { status: 'approved' }
        );
        
        // Approve all pending tours
        const tourResult = await Tour.updateMany(
            { status: 'pending' },
            { status: 'approved' }
        );
        
        console.log(`Approved ${hotelResult.modifiedCount} pending hotels`);
        console.log(`Approved ${tourResult.modifiedCount} pending tours`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

approveAllPending();