function clone(objSource) {
    return JSON.parse(JSON.stringify(objSource));
}

function resolveImageUrl(imageUrl) {
    if (imageUrl && imageUrl.indexOf('/') < 0) {
        return process.env.REACT_APP_IMAGE_BASE_URL + imageUrl;
    } else {
        return imageUrl;
    }
}

function resolveApiUrl(apiUrl) {
    return process.env.REACT_APP_API_BASE_URL + apiUrl;
}

function isNotSet(value) {
    return value === null || value === undefined || value.toString().trim() === '';
}

function isSet(value) {
    return !isNotSet(value);
}

export { clone, resolveImageUrl, isNotSet, isSet, resolveApiUrl };