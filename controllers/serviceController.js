import Service from "../models/Service.js";

// Add a new service
export const addService = async (req, res) => {
    const { name, region, notes } = req.body;

    try {
        if (!name || !region) {
            return res.status(400).json({
                message: "Les champs obligatoires sont manquants (name, region)",
            });
        }

        const newService = await Service.create({
            name,
            region,
            notes,
        });

        res.status(201).json({
            success: true,
            message: "Service ajouté avec succès",
            newService,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Échec de l'ajout du service",
            error: error.message,
        });
    }
};

// Get all services
export const getServices = async (req, res) => {
    const { search = "", limit = 10, page = 1 } = req.query;

    try {
        const limitNumber = parseInt(limit, 10);
        const pageNumber = parseInt(page, 10);

        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const services = await Service.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const totalCount = await Service.countDocuments(query);

        res.status(200).json({
            success: true,
            services,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des services",
            error: error.message,
        });
    }
};

// Get a single service by ID
export const getOneService = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service non trouvé",
            });
        }
        res.status(200).json({
            success: true,
            service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du service",
            error: error.message,
        });
    }
};

// Update a service
export const updateService = async (req, res) => {
    const { id } = req.params;
    const { name, region, notes } = req.body;

    try {
        const service = await Service.findByIdAndUpdate(
            id,
            { name, region, notes },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service non trouvé",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service mis à jour avec succès",
            service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Échec de la mise à jour du service",
            error: error.message,
        });
    }
};

// Delete a service
export const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findByIdAndDelete(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service non trouvé",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service supprimé avec succès",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Échec de la suppression du service",
            error: error.message,
        });
    }
};
