import Review from "../models/Review.js";

// Ajouter une nouvelle review
export const addReview = async (req, res) => {
    const { user, message, review } = req.body;

    try {
        if (!user || !message || !review) {
            return res.status(400).json({
                message: "Les champs obligatoires sont manquants (user, message, review)",
            });
        }

        const newReview = await Review.create({
            user,
            message,
            review,
        });

        res.status(201).json({
            success: true,
            message: "Avis ajouté avec succès",
            newReview,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout de l'avis",
            error: error.message,
        });
    }
};

// Mettre à jour une review
export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { message, review } = req.body;

    try {
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { message, review },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({
                success: false,
                message: "Avis non trouvé",
            });
        }

        res.status(200).json({
            success: true,
            message: "Avis mis à jour avec succès",
            updatedReview,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'avis",
            error: error.message,
        });
    }
};

// Récupérer les reviews d'un utilisateur spécifique
export const getReviews = async (req, res) => {
    try {
        const { search } = req.query;  // Get userId from query parameters
        const query = search ? { user: search } : {};  // If userId is passed, filter by user ID

        const reviews = await Review.find(query)  // Apply the filter condition if userId is provided
            .populate("user", "username email image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des avis",
            error: error.message,
        });
    }
};

// Récupérer une review par ID
export const getOneReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id).populate("user", "name email");
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Avis non trouvé",
            });
        }
        res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'avis",
            error: error.message,
        });
    }
};

// Supprimer une review
export const deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Avis non trouvé",
            });
        }

        res.status(200).json({
            success: true,
            message: "Avis supprimé avec succès",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'avis",
            error: error.message,
        });
    }
};
