import ServiceRepository from "../src/ServiceRepository.js";
import {v4} from "uuid";

const test = async function() {
    const serviceRepository = new ServiceRepository('./services.test.db');

    let key = v4();
    await serviceRepository.put(key, {name: 'Service 1', description: 'Service 1 description', type: 'Service 1 type', status: 'Service 1 status'});

    let service = await serviceRepository.get(key);
    console.log('After one service creation', service);

    key = v4();
    await serviceRepository.put(key, {name: 'Service 2', description: 'Service 2 description', type: 'Service 2 type', status: 'Service 2 status'});

    let services = await serviceRepository.fetchAll();
    console.log('All services', services);

    for (const service of services) {
        const key = service[0];
        console.log('Delete entry with key:', key);
        await serviceRepository.del(key);
    }

    services = await serviceRepository.fetchAll();
    console.log('No services', services);
}

test();

