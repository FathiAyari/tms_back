import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // or "Client", adjust based on your app structure
            required: true,
        },
        status: {
            type: String,
            enum: ["En attente", "Confirmée", "Livrée", "Annulée"],
            default: "En attente",
        },
        destinationAdress: {
            type: String,
            trim: true,
            default: "",
        },
        sourceAdress: {
            type: String,
            trim: true,
            default: "",
        },
        destinationCountry: {
            type: String,
            trim: true,
            default: "",
        },
        sourceCountry: {
            type: String,
            trim: true,
            default: "",
        },
        adminNotes: {
            type: String,
            trim: true,
            default: "",
        },
        paymentMethod: {
            type: String,
            enum: ["Carte", "Espèces", "Chèque", "Virement"],
            default: "Carte",
        },
        paymentStatus: {
            type: String,
            enum: ["Non payé", "Partiellement payé", "Payé"],
            default: "Non payé",
        },
        totalAmount: {
            type: Number,
            required: false, // optional
            min: 0,
        },
        type: {
            type: String,
            enum: [
                "Fragile",
                "Périssable",
                "Électronique",
                "Documents",
                "Vêtements",
                "Meubles",
                "Produits chimiques",
                "Lourd",
                "Volumineux",
                "Standard"
            ],
            default: "Standard",
        },

        weight: {
            type: Number,
            required: false, // optional
            min: 0,
        },
        notes: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
