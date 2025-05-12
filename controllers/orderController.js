import Order from "../models/Order.js";

// Add a new order
export const addOrder = async (req, res) => {
  const {
    customerName,
    ownerId,
    status,
    destinationAdress,
    sourceAdress,
    destinationCountry,
    sourceCountry,
    adminNotes,
    paymentMethod,
    paymentStatus,
    totalAmount,
    type,
    weight,
    notes,
  } = req.body;

  try {
    if (!customerName || !ownerId) {
      return res.status(400).json({
        message: "Les champs obligatoires sont manquants (customerName, ownerId)",
      });
    }

    const order = await Order.create({
      customerName,
      ownerId,
      status,
      destinationAdress,
      sourceAdress,
      destinationCountry,
      sourceCountry,
      adminNotes,
      paymentMethod,
      paymentStatus,
      totalAmount,
      type,
      weight,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Commande ajoutée avec succès",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Échec de l'ajout de la commande",
      error: error.message,
    });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  const { search = "", limit = 10, page = 1, status = "" } = req.query;

  try {
    const limitNumber = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);
    const query = search ? { ownerId: search } : {};

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
        .populate("ownerId", "email username")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const totalCount = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commandes",
      error: error.message,
    });
  }
};

// Get a single order by ID
export const getOneOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("ownerId", "email username");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la commande",
      error: error.message,
    });
  }
};

// Update order details
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    ownerId,
    status,
    destinationAdress,
    sourceAdress,
    destinationCountry,
    sourceCountry,
    adminNotes,
    paymentMethod,
    paymentStatus,
    totalAmount,
    type,
    weight,
    notes,
  } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    order.customerName = customerName || order.customerName;
    order.ownerId = ownerId || order.ownerId;
    order.status = status || order.status;
    order.destinationAdress = destinationAdress || order.destinationAdress;
    order.sourceAdress = sourceAdress || order.sourceAdress;
    order.destinationCountry = destinationCountry || order.destinationCountry;
    order.sourceCountry = sourceCountry || order.sourceCountry;
    order.adminNotes = adminNotes || order.adminNotes;
    order.paymentMethod = paymentMethod || order.paymentMethod;
    order.paymentStatus = paymentStatus || order.paymentStatus;
    order.totalAmount = totalAmount ?? order.totalAmount;
    order.type = type || order.type;
    order.weight = weight ?? order.weight;
    order.notes = notes || order.notes;

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Commande mise à jour avec succès",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Échec de la mise à jour de la commande",
      error: error.message,
    });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      message: "Commande supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Échec de la suppression de la commande",
      error: error.message,
    });
  }
};

// Fetch dashboard statistics
export const getDashboardData = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const totalCount = stats.reduce((total, stat) => total + stat.count, 0);
    const enAttente = stats.find((stat) => stat._id === "En attente")?.count || 0;
    const confirmee = stats.find((stat) => stat._id === "Confirmée")?.count || 0;
    const livree = stats.find((stat) => stat._id === "Livrée")?.count || 0;
    const annulee = stats.find((stat) => stat._id === "Annulée")?.count || 0;

    res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        enAttente,
        confirmee,
        livree,
        annulee,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Échec de la récupération des statistiques",
      error: error.message,
    });
  }
};
