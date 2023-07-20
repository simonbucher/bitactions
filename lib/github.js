const axios = require('axios')
const config = require('./config')

const options = {
  baseURL: `https://api.github.com/repos/${config.githubRepoName}/actions`,
  timeout: 5000, // Set timeout to 5000 ms
  headers: {}
}

if (config && config.githubToken) {
  options.headers.Authorization = `bearer ${config.githubToken}`
}

const http = axios.create(options)

module.exports.getWorkflows = async () => {
  try {
    const res = await http.get(`/workflows`)
    if (res && res.data && res.data.workflows) return res.data.workflows
  } catch (error) {
    console.error(`Failed to get workflows: ${error.message}`);
  }
  return []; // Default to empty array
}

module.exports.getJobs = async (run) => {
  try {
    const res = await http.get(`/runs/${run}/jobs`)
    if (res && res.data && res.data.jobs) return res.data.jobs
  } catch (error) {
    console.error(`Failed to get jobs: ${error.message}`);
  }
  return []; // Default to empty array
}


module.exports.getCommitMessage = async (sha) => {
  const commitHttp = axios.create({
    baseURL: `https://api.github.com/repos/${config.githubRepoName}/commits`,
    headers: {
      Authorization: `bearer ${config.githubToken}`,
    },
    timeout: 5000, // Set timeout to 5000 ms
  });

  try {
    const res = await commitHttp.get(`/${sha}`);
    if (res && res.data && res.data.commit && res.data.commit.message) {
      const commitMessage = res.data.commit.message.split('\n')[0];
      return commitMessage;
    }
  } catch (error) {
    console.error(`Failed to get commit message: ${error.message}`);
  }
  return ""; // Default to empty string
}

module.exports.getAllRuns = async (workflow) => {
  try {
    const res = await http.get(`/workflows/${workflow}/runs`)
    if (res && res.data && res.data.workflow_runs && res.data.workflow_runs.length > 0)
      return res.data.workflow_runs
  } catch (error) {
    console.error(`Failed to get all runs: ${error.message}`);
  }
  return []; // Default to empty array
}
