import { Contest } from "../models/contest.model.js";

export const cleanupOldContests = async () => {

    try {
        const ONE_DAY = 24 * 60 * 60 * 1000;

        const result = await Contest.deleteMany({
            status: "ended",
            updatedAt: { $lt: new Date(Date.now() - ONE_DAY)},
        });

        console.log(
            `Cleanup done: ${result.deletedCount} old contests removed`
        );

    } catch (error) {
        console.log("X cleanup failed:", error);
    }
}