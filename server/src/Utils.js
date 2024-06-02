function isNotSet(value) {
    return value === null || value === undefined || value.toString().trim() === '';
}

function isSet(value) {
    return !isNotSet(value);
}

export { isNotSet, isSet };