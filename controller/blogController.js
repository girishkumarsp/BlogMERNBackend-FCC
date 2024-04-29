const mongoose = require("mongoose");
const Blog = require("../model/Blog");

//Fetch a blog
//add
//delete
//update 

const fetchListOfBlogs = async (req, res) => {
    let blogList;
    try {
        blogList = await Blog.find();
    } catch (error) {
        console.log(error);
    }

    if (!blogList) {
        return res.status(404).json({ message: "No Blogs Found" });
    } else {
        return res.status(200).json({ blogList });
    }
};

const addNewBlog = async (req, res) => {
    const { title, description } = req.body;
    const currentDate = new Date();

    const newlyCreateBlog = new Blog({ title, description, date: currentDate });

    try {
        await newlyCreateBlog.save();
    } catch (error) {
        console.log(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newlyCreateBlog.save(session);
        session.commitTransaction();
    } catch (error) {
        return res.status(500).json({ message: error });
    }

    return res.status(200).json({ newlyCreateBlog });
};

const deleteABlog = async (req, res) => {
    const id = req.params.id;
    try {
        const findCurrentBlog = await Blog.findByIdAndDelete(id);
        if (!findCurrentBlog) {
            return res.status(404).json({ message: 'Blog not found' })
        }

        return res.status(200).json({ message: 'Successfully Deleted' })

    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Unable to delete ! Please try again' })
    }
}

const updateABlog = async (req, res) => {
    const id = req.params.id;

    const { title, description } = req.body;
    let currentBlogToUpdate

    try {
        currentBlogToUpdate = await Blog.findByIdAndUpdate(id, {
            title, description
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Something Went Wrong wile updating try again' })
    }

    if (!currentBlogToUpdate) {
        return res.status(500).json({ message: 'Unable to update' })
    }

    return res.status(200).json({ currentBlogToUpdate })
}

module.exports = {fetchListOfBlogs, deleteABlog, addNewBlog, updateABlog};