import multer from 'multer';
import path from 'path';
import {v4} from 'uuid';
import express from 'express';
import sharp from "sharp";
import fs from 'fs/promises';
import {isSet} from "./Utils.js";

const IMAGES_FOLDER = './images';
const IMAGE_MAX_WIDTH = 400;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, IMAGES_FOLDER)
    },
    filename: function (req, file, cb) {
        const filename = `${file.fieldname}-${Date.now()}-${v4()}${path.extname(file.originalname)}`;
        cb(null, filename)
    }
});

const uploadHandler = multer({ storage: storage }).single('image');
const downloadHandler = express.static(IMAGES_FOLDER, {maxAge: 2000000000});

const uploadHandlerV2 = async (req, res) => {
    if (req.file) {
        res.json({
            filename: req.file.filename,
            message: "Image uploaded successfully!"
        });
    } else {
        res.status(500).json({
            message: "Error uploading image"
        });
    }
}

// Function to extract base64 data from the data URL
const getBase64Data = (base64String) => {
    const dataIndex = base64String.indexOf(';base64,');
    if (dataIndex === -1) {
        throw new Error('Invalid input string');
    }

    const data = base64String.substring(dataIndex + 8);
    return data;
}

const uploadHandlerV3 = async (req, res) => {
    try {
        const base64Data = getBase64Data(req.body.base64Image);
        const imageBuffer = Buffer.from(base64Data, 'base64');

        const resizedImageBuffer = await sharp(imageBuffer)
            .resize({width: IMAGE_MAX_WIDTH, withoutEnlargement: true}) // Set width and height as needed
            .toFormat('png')
            .toBuffer();

        if (isSet(req.body.filename)) {
            await fs.rm(path.join(IMAGES_FOLDER, req.body.filename));
            console.log('Removed file:', req.body.filename);
        }

        const filename = `img-${Date.now()}-${v4()}.png`;

        await fs.writeFile(path.join(IMAGES_FOLDER, filename), resizedImageBuffer);

        //console.log('imageBase64', imageBase64);
        console.log('Uploaded file:', filename);

        res.json({
            filename: filename,
            message: "Image uploaded successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
}

const deleteImage = async (filename) => {
    try {
        if (isSet(filename)) {
            await fs.rm(path.join(IMAGES_FOLDER, filename));
            console.log('Removed file:', filename);
        }
    } catch (error) {
        console.error(error);
    }
}

export {uploadHandler, downloadHandler, uploadHandlerV2, uploadHandlerV3, deleteImage};