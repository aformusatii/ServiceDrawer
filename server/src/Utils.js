import fs from "fs/promises";

function isNotSet(value) {
    return value === null || value === undefined || value.toString().trim() === '';
}

function isSet(value) {
    return !isNotSet(value);
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function readAll(filePath) {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
}

export { isNotSet, isSet, fileExists, readAll };