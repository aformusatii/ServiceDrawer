import React, {useEffect, useState} from 'react';
import ServiceRepository from "./ServiceRepository";
import ConfigurationRepository from "./ConfigurationRepository";
import {isSet, resolveImageUrl} from "./Utils";
import {Spinner} from "react-bootstrap";
import styles from './css/mobile.module.css';
import {parse} from "yaml";

const serviceRepository = new ServiceRepository();
const configurationRepository = new ConfigurationRepository();

const MobileDashboardPage = () => {

    const [dataLoaded, setDataLoaded] = useState(false);
    const [servicesByCategory, setServicesByCategory] = useState([]);

    const fetchAllData = async () => {
        const configurationResp = await configurationRepository.fetch();
        const configuration = parse(configurationResp);

        const mobileFilter = (service) => {
            return service.value.properties.object.showOnMobile;
        }

        const servicesByCategory = await serviceRepository.fetchAllAndGroupByCategory(configuration.categories, mobileFilter);
        setServicesByCategory(servicesByCategory);
        setDataLoaded(true);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleServiceClick = (service) => {
        const mainLink = service.value.properties.object.mainLink;

        if (isSet(mainLink)) {
            window.open(mainLink, '_self').focus();
        }
    }

    const CategoryWithServices = ({category, services}) => (
        <div>
            <h2 style={{textAlign: 'center'}}>{category}</h2>

            <div className={styles.tilesBox}>

                {services.map((service, index) => (
                    <div key={"service-" + index}  className={styles.tileBox} onClick={()=> handleServiceClick(service)}>
                        <div className={styles.tileImage}><img src={resolveImageUrl(service.value.logo)}/></div>
                        <div className={styles.tileTitle}>{service.value.properties.object.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ServicesSection = (
        <div>
            {servicesByCategory.map((serviceAndCategory, index) => (
                <CategoryWithServices key={index} category={serviceAndCategory.category} services={serviceAndCategory.services}/>
            ))}
        </div>
    );

    return (
        <div>
            {dataLoaded ? ServicesSection : <Spinner animation="border" role="status"/>}
        </div>
    );
};

export default MobileDashboardPage;