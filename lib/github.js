const axios = require('axios')
const config = require('./config')

const options = { baseURL: `https://api.github.com/repos/${config.githubRepoName}/actions` }
options.headers = {}

if (config && config.githubToken) {
  options.headers.Authorization = `bearer ${config.githubToken}`
}

const http = axios.create(options)

module.exports.getWorkflows = async () => {
  const res = await http.get(`/workflows`)
  if (res && res.data && res.data.workflows) return res.data.workflows
  throw new Error('Can\'t find workflows')
}

module.exports.getJobs = async (run) => {
  const res = await http.get(`/runs/${run}/jobs`)
  if (res && res.data && res.data.jobs) return res.data.jobs
  throw new Error('Can\'t find jobs')
}


module.exports.getCommitMessage = async (sha) => {
  const commitHttp = axios.create({
    baseURL: `https://api.github.com/repos/${config.githubRepoName}/commits`,
    headers: {
      Authorization: `bearer ${config.githubToken}`,
    },
  });

  const res = await commitHttp.get(`/${sha}`);
  if (res && res.data && res.data.commit && res.data.commit.message) {
    const commitMessage = res.data.commit.message.split('\n')[0];
    return commitMessage;
  }
}

module.exports.getAllRuns = async (workflow) => {
  const res = await http.get(`/workflows/${workflow}/runs`)

  // Check if res.data.workflow_runs exists before checking its length
  if (res && res.data && res.data.workflow_runs && res.data.workflow_runs.length > 0)
    return res.data.workflow_runs

  // Return an empty array instead of throwing an error if there are no workflow runs
  return []
}

