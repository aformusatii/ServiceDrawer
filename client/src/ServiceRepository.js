import {isSet} from "./Utils.js";

class ServiceRepository {

    fetchAll() {
        return fetch('/api/services')
            .then(response => response.json());
    }

    async fetchAllAndGroupByCategory(categoriesGroupingOrder, filterCallback) {
        let services = await fetch('/api/services')
            .then(response => response.json());

        if (filterCallback) {
            services = services.filter(filterCallback);
        }

        const groupedServices = services.reduce((acc, service) => {
            let category = service.value.properties.object.category;
            category = category || 'Other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(service);
            return acc;
        }, {});

        const groupedServicesByCategory = Object.keys(groupedServices).map(category => {
            return {
                category: category,
                services: groupedServices[category]
            };
        });

        const categoryOrderMap = categoriesGroupingOrder.reduce((acc, category, index) => {
            acc[category] = index;
            return acc;
        }, {});

        groupedServicesByCategory.sort((a, b) => {
            const aOrder = categoryOrderMap[a.category] !== undefined ? categoryOrderMap[a.category] : Infinity;
            const bOrder = categoryOrderMap[b.category] !== undefined ? categoryOrderMap[b.category] : Infinity;
            return aOrder - bOrder;
        });

        // console.log('groupedServicesByCategory', groupedServicesByCategory, 'servicesResp', servicesResp, 'groupedServices', groupedServices);
        return groupedServicesByCategory;
    }

    saveOrUpdate(service) {
        if (service.key) {
           return this.update(service);
        } else {
            return this.save(service);
        }
    }

    save(service) {
        return fetch('/api/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service.value)
        });
    }

    update(service) {
        return fetch('/api/services/' + service.key, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service.value)
        });
    }

    async uploadLogo(logo) {
        const formData = new FormData();

        const blob = await (await fetch(logo)).blob();
        formData.append("image", blob, 'myImage.jpg');
        //formData.append('image', logo);

        return fetch('/images/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.json());
    }

    async uploadLogoBase64(base64Image, filename) {
        const data = {
            base64Image: base64Image,
            filename: filename
        }

        return fetch('/images/upload/base64', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json());
    }

    delete(service) {
        return fetch('/api/services/' + service.key, {
            method: 'DELETE'
        });
    }

}

export default ServiceRepository;