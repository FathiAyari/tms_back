import Message from "../models/Message.js";

// Add a new message
export const addMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: "Les champs obligatoires sont manquants (name, email, subject, message)",
            });
        }

        const newMessage = await Message.create({
            name,
            email,
            subject,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Message ajouté avec succès",
            newMessage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Échec de l'ajout du message",
            error: error.message,
        });
    }
};

// Get all messages
export const getMessages = async (req, res) => {
    const { search = "", limit = 10, page = 1 } = req.query;

    try {
        const limitNumber = parseInt(limit, 10);
        const pageNumber = parseInt(page, 10);

        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const messages = await Message.find(query)
            .sort({ sentAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const totalCount = await Message.countDocuments(query);

        res.status(200).json({
            success: true,
            messages,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des messages",
            error: error.message,
        });
    }
};

// Get a single message by ID
export const getOneMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message non trouvé",
            });
        }
        res.status(200).json({
            success: true,
            message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du message",
            error: error.message,
        });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message non trouvé",
            });
        }

        res.status(200).json({
            success: true,
            message: "Message supprimé avec succès",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Échec de la suppression du message",
            error: error.message,
        });
    }
};
