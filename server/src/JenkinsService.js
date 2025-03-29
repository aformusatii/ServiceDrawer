import jenkins from 'jenkins';
import { promises as fs } from 'fs';

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import Handlebars from 'handlebars';

// Get the __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the .env file relative to the current file
const envPath = path.resolve(__dirname, '..', '.env');

// Load the environment variables from the specified .env file
dotenv.config({ path: envPath });

class JenkinsService {

    constructor() {
        this.jenkinsClient = new jenkins({
            baseUrl: `http://${process.env.JENKINS_USER}:${process.env.JENKINS_PASS}@${process.env.JENKINS_HOST}:${process.env.JENKINS_PORT}`,
            crumbIssuer: true,
            promisify: true
        });
    }

    async getMeta() {
        const meta = await this.jenkinsClient.info();
        return meta;
    }

    async createJob(jobName, configXml) {
        // Check if the job already exists
        const jobExists = await this.jenkinsClient.job.exists(jobName);

        if (!jobExists) {
            // Create the job
            await this.jenkinsClient.job.create(jobName, configXml);
            return `Job '${jobName}' created successfully.`;
        } else {
            await this.jenkinsClient.job.config(jobName, configXml);
            return `Job '${jobName}' already exists, updated configuration.`;
        }
    }

    async createOrUpdateJob(jobId, service) {
        return await this['createJob' + jobId](service);
    }

    async buildJob(jobId, service) {
        return await this['buildJob' + jobId](service);
    }

    async createJobUpgradeDockerImage(service) {
        const jobProperties = service.properties.object.jenkins.updateDockerImageJob;
        const jobName = `${jobProperties.parentFolder}/${jobProperties.name}`;

        const jenkinsTemplatePath = path.resolve(__dirname, 'Jenkins-Templates', 'UpgradeDockerImage.xml');
        const data = await fs.readFile(jenkinsTemplatePath, 'utf-8');
        const jenkinsTemplate = Handlebars.compile(data);
        const jenkinsTemplateCompiled = jenkinsTemplate(jobProperties);

        //console.log('Job Name', jobName);
        //console.log('Jenkins template:', jenkinsTemplateCompiled);
        //console.log('Jenkins template context:', jobProperties);

        return await this.createJob(jobName, jenkinsTemplateCompiled);
    }

    async buildJobUpgradeDockerImage(service) {
        const jobProperties = service.properties.object.jenkins.updateDockerImageJob;
        const jobName = `${jobProperties.parentFolder}/${jobProperties.name}`;
        const buildId = await this.jenkinsClient.job.build(jobName);
        return 'Triggered build with ID: ' + buildId;
    }

}

export default JenkinsService;