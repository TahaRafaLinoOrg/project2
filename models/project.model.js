const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
        },
        imgUrl: {
            type: String,
        },
        username: { type: mongoose.Schema.Types.ObjectId, ref: "Username" }
    },
    {
        timestamps: true,
    }

);




const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
