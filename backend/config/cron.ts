import cron from "node-cron";
import {Product} from "../model/product.model";


cron.schedule("* * * * *", async () => { //one minute once
    console.log("Running cleanup job: Deleting soft-deleted products...");
    
    const result = await Product.deleteMany({ isDeleted: true });
    
    console.log(`Soft-deleted products cleaned up! Removed: ${result.deletedCount}`);
});
