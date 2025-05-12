import Post from "../models/Post.js";

// Add a new post
export const addPost = async (req, res) => {

    const { title, content, author, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        if (!title || !content || !author) {
            return res.status(400).json({
                message: "Les champs obligatoires sont manquants (title, content, author)",
            });
        }

        const newPost = await Post.create({
            title,
            content,
            author,
            status: "en cours",
            image,
        });

        res.status(201).json({
            success: true,
            message: "Post ajouté avec succès",
            newPost,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Échec de l'ajout du post",
            error: error.message,
        });
    }
};

// Update a post by ID
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, author, status } = req.body;

    try {
        // Get the existing post to retain the current image if no new one is uploaded
        const existingPost = await Post.findById(id);
        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post non trouvé",
            });
        }

        const image = req.file ? `/uploads/${req.file.filename}` : existingPost.image;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, content, author, status, image },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Post mis à jour avec succès",
            updatedPost,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du post",
            error: error.message,
        });
    }
};


// Get all posts
export const getPosts = async (req, res) => {
    const { search = "", status, limit = 10, page = 1 } = req.query;

    try {
        const limitNumber = parseInt(limit, 10);
        const pageNumber = parseInt(page, 10);
        const query = search ? { author: search } : {};  // If userId is passed, filter by user ID


        if (status) query.status = status;  // Add status filter if provided
        // Populate the 'author' field (or whatever the user field is called in your Post model)
        const posts = await Post.find(query)
            .populate("author", "username email image")  // Adjust the fields you want to populate from the User model
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const totalCount = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            posts,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des posts",
            error: error.message,
        });
    }
};

// Get a single post by ID
export const getOnePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id)
            .populate("author", "username email")  // Adjust the fields you want to populate from the User model;
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post non trouvé",
            });
        }
        res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du post",
            error: error.message,
        });
    }
};



// Update only the status of a post
export const updatePostStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!["en cours", "accepté", "refusé"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Statut invalide. Les statuts valides sont : pending, accepted, refused.",
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post non trouvé",
            });
        }

        res.status(200).json({
            success: true,
            message: "Statut du post mis à jour avec succès",
            updatedPost,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du statut",
            error: error.message,
        });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post non trouvé",
            });
        }

        res.status(200).json({
            success: true,
            message: "Post supprimé avec succès",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Échec de la suppression du post",
            error: error.message,
        });
    }
};
