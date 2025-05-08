import Visit from "../models/Visit.js"; // Import the Visit model

export const incrementVisit = async (req, res) => {
    try {
        // Find or create the visit count document
        let visit = await Visit.findOne();

        if (!visit) {
            // If no visit document exists, create a new one
            visit = new Visit({ count: 1 });
        } else {
            // Increment the visit count
            visit.count += 0.5;
        }

        // Save the visit count document
        await visit.save();

        // Send the updated visit count in the response
        res.status(200).json({ message: "Visit count incremented", visitCount: visit.count });
    } catch (error) {
        console.error("Error incrementing visit count:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getVisitCount = async (req, res) => {
    try {
        const visit = await Visit.findOne();
        if (!visit) {
            return res.status(404).json({ message: "Visit count not found" });
        }
        res.status(200).json({ visitCount: visit.count });
    } catch (error) {
        console.error("Error fetching visit count:", error);
        res.status(500).json({ message: "Server error" });
    }
};
