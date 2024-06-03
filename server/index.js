import express from 'express';
import ServiceRepository from './src/ServiceRepository.js';
import {v4} from 'uuid';

import cors from 'cors';

import {downloadHandler, uploadHandlerV3, deleteImage} from './src/ImageHandler.js';
import fs from "fs/promises";
import path from "path";

const PORT = process.env.PORT || 3001;

const app = express();
const serviceRepository = new ServiceRepository('./services.db');

app.use(express.json({limit: '15mb'}));
app.use(cors());

// ========================= Services API =========================
app.get("/api/services", async (req, res) => {
    const services = await serviceRepository.fetchAll();

    const servicesArray = services.map((service) => {
        return {key: service[0], value: service[1]}
    });

    res.json(servicesArray);
});

app.get("/api/services/:key", async (req, res) => {
    const key = req.params.key;
    const service = await serviceRepository.get(key);
    res.json(service);
});

app.post("/api/services", async (req, res) => {
    const service = req.body;
    const key = v4();
    await serviceRepository.put(key, service);
    res.json({ key: key, message: "Service added successfully" });
});

app.put("/api/services/:key", async (req, res) => {
    const key = req.params.key;
    const value = req.body;
    await serviceRepository.put(key, value);
    res.json({ message: "Service updated successfully" });
});

app.delete("/api/services/:key", async (req, res) => {
    const key = req.params.key;

    const service = await serviceRepository.get(key);
    await deleteImage(service.logo);

    await serviceRepository.del(key);
    res.json({ message: "Service deleted successfully" });
});

// ========================= Configuration API =========================
app.get("/api/configuration", async (req, res) => {
    const filePath = './configuration.yaml';

    try {
        const data = await fs.readFile(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/yaml');
        res.send(data);
    } catch (e) {
        console.log(e);
        res.status(500).send('Error reading configuration file');
    }
});

app.put("/api/configuration", express.text(), async (req, res) => {
    const filePath = './configuration.yaml';
    const data = req.body;

    try {
        await fs.writeFile(filePath, data, 'utf8');
        res.send('Configuration file updated successfully');
    }  catch (e) {
        console.log(e);
        res.status(500).send('Error writing configuration file');
    }
});

// ========================= Images API =========================
app.use('/images/download', downloadHandler);
app.use(express.static('../client/build'));
app.use('*', express.static('../client/build'));

//app.post("/images/upload", uploadHandler, uploadHandlerV2);
app.post("/images/upload/base64", uploadHandlerV3);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});