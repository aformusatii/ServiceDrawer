import {resolveApiUrl} from "./Utils";

class ConfigurationRepository {

    fetch() {
        return fetch(resolveApiUrl('api/configuration'))
            .then(response => response.text());
    }

    save(configuration) {
        return fetch(resolveApiUrl('api/configuration'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: configuration
        });
    }

}

export default ConfigurationRepository;