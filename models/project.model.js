const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name: {
            type: String,
            name: false,
            unique: true,
        },
        description: {
            type: String,
            name: false,
            unique: true,
        },
        img: {
            type: String,
            name: false,
            unique: true,
        },
        author: {
            type: String,
            name: false,
            unique: true,
        }
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
    }

);




const Project = model("Project", userSchema);

module.exports = Project;
