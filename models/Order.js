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
        destination: {
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
