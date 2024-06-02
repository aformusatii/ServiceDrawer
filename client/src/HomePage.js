// --- HomePage.js ---
import React, { useState, useEffect } from "react";
import {Button, Container, Spinner} from 'react-bootstrap';
import EditServiceModal from './EditServiceModal';
import Table from 'react-bootstrap/Table';
import {clone} from './Utils';
import { parse } from 'yaml';

import ServiceRepository from './ServiceRepository';
import ConfigurationRepository from "./ConfigurationRepository";

import { resolveImageUrl } from './Utils.js';

const serviceRepository = new ServiceRepository();
const configurationRepository = new ConfigurationRepository();

const defaultService = {
    key: null,
    value: {
        properties: {
            object: {
                name: '',
                description: '',
                category: 'Other',
                tags: ['DB', 'WEB'],
                showOnMobile: false,
                ports: [{8080: 'http'}, {8443: 'https'}],
                mainLink: 'http://localhost:8080',
                otherLinks: [
                    {label: 'Web UI', url: 'http://localhost:8080'},
                    {label: 'Web UI 2', url: 'http://localhost:8080'},
                ],
                credentials: {
                    admin: {username: 'admin', password: 'admin'}
                }
            },
            string: ''
        },
        textDetails: '',
        logo: null
    }
}

const HomePage = () => {

    // https://react.dev/reference/react/useState
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(clone(defaultService));
    const [dataLoaded, setDataLoaded] = useState(false);
    const [servicesByCategory, setServicesByCategory] = useState([]);

    const handleModalClose = () => setShowModal(false);

    const openEditServiceModal = (service) => {
        setSelectedService(service || clone(defaultService));
        setShowModal(true);
    }

    const deleteService = (service) => {
        serviceRepository.delete(service).then(() => {
            (async () => {await fetchAllData()})();
        });
    }

    const handleModalSave = (service, image) => {
        console.log('Save Changes', service, image);

        const save = async function() {
            if (image) {
                //const uploadResponse = await serviceRepository.uploadLogo(image);
                const uploadResponse = await serviceRepository.uploadLogoBase64(image, service.value.logo);
                service.value.logo = uploadResponse.filename;
            }

            await serviceRepository.saveOrUpdate(service);

            await fetchAllData();

            setShowModal(false);
        }

        save();
    }

    const fetchAllData = async () => {
        const configurationResp = await configurationRepository.fetch();
        const configuration = parse(configurationResp);

        const servicesByCategory = await serviceRepository.fetchAllAndGroupByCategory(configuration.categories);
        setServicesByCategory(servicesByCategory);
        setDataLoaded(true);
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    const CategoryWithServices = ({category, services}) => (
        <div>
            <h2>{category}</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Service Description</th>
                    <th>Service Type</th>
                    <th>Service Status</th>
                    <th>Service Actions</th>
                </tr>
                </thead>
                <tbody>
                {services.map((service, index) => (
                    <tr key={index}>
                        <td><img src={resolveImageUrl(service.value.logo)} style={{maxHeight: 20}}/></td>
                        <td>{service.value.properties.object.name}</td>
                        <td>{service.type}</td>
                        <td>{service.status}</td>
                        <td>
                            <Button size={"sm"} variant="primary" onClick={() => openEditServiceModal(service)} style={{marginRight: 10}}>
                                Edit
                            </Button>
                            <Button size={"sm"} variant="danger" onClick={() => deleteService(service)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );

    const TableSection = (
        <div>
            {servicesByCategory.map((serviceAndCategory, index) => (
                <CategoryWithServices key={index} category={serviceAndCategory.category} services={serviceAndCategory.services}/>
            ))}

            <Button variant="primary" onClick={() => openEditServiceModal(null)}>
                Create New Service
            </Button>
        </div>
    );

    return (
        <div>
            {dataLoaded ? TableSection : <Spinner animation="border" role="status"/>}

            <EditServiceModal show={showModal}
                              onClose={handleModalClose}
                              onSave={handleModalSave}
                              service={selectedService}/>
        </div>
    );
};

export default HomePage;