const user_id = 'aformusatii';
const users_token = '11fd380fc255968f3e455da89fd978ca02';

import jenkins from 'jenkins';

const jenkinsClient = new jenkins({
  baseUrl: `http://${user_id}:${users_token}@192.168.100.3:8015`,
  crumbIssuer: true, // Enable crumbIssuer for CSRF protection
  promisify: true
});

async function createJob(jobName, configXml) {
  try {
    // Check if the job already exists
    const jobExists = await jenkinsClient.job.exists(jobName);

    if (!jobExists) {
      // Create the job
      await jenkinsClient.job.create(jobName, configXml);
      console.log(`Job '${jobName}' created successfully.`);
    } else {
      console.log(`Job '${jobName}' already exists.`);
    }
  } catch (err) {
    console.error(`Error creating job '${jobName}':`, err);
  }
}

async function main() {
  // Define the job configuration XML
  const configXml = `<?xml version='1.0' encoding='UTF-8'?>
<project>
    <actions/>
    <description>A test job created via API</description>
    <keepDependencies>false</keepDependencies>
    <properties/>
    <scm class="hudson.scm.NullSCM"/>
    <canRoam>true</canRoam>
    <disabled>false</disabled>
    <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
    <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
    <triggers/>
    <concurrentBuild>false</concurrentBuild>
    <builders/>
    <publishers/>
    <buildWrappers/>
</project>`;

  const jobName = 'my-new-job';

  await createJob(jobName, configXml);
}

main();