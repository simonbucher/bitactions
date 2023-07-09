const github = require('./github')
const config = require('./config')
const moment = require('moment')
const humanizeDuration = require("humanize-duration")

module.exports.start = async () => {

    let output = []
    let status = []

    const workflows = await github.getWorkflows()
    let allRuns = []

    for (let i = 0; i < workflows.length; i++) {

        const workflow = workflows[i]

        if (workflow.state == 'active') {
            const runs = await github.getAllRuns(workflow.id)
            allRuns = allRuns.concat(runs.map(run => ({...run, workflowName: workflow.name})));
        }
    }

    allRuns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const numOfWorkflowRuns = config.numOfWorkflowRuns || 3;

    const recentRuns = allRuns.slice(0, numOfWorkflowRuns);

    for (let run of recentRuns) {
        try {
            await submenus(output, github, run)
            status.push({
                icon: icon(run.conclusion),
                name: run.workflowName
            })
        } catch { }
    }

    status = status.reverse();
    console.log(status.map(s => s.icon).join(''));
    console.log('---')

    output.forEach(o => console.log(o))
}

async function submenus(output, github, run) {
    const jobs = await github.getJobs(run.id)
    let displayName = run.workflowName;

    if (run.event != 'workflow_dispatch') {
        let commitMessage = await github.getCommitMessage(run.head_sha);
        displayName = commitMessage ? commitMessage : 'No commit message';
    }

    // Initialize earliest start time and latest end time with run's start and end time
    let earliestStart = moment(run.started_at);
    let latestEnd = moment(run.completed_at || moment()); // use current time if not completed yet

    for (let job of jobs) {
        // Update earliest start and latest end times
        let jobStart = moment(job.started_at);
        let jobEnd = moment(job.completed_at || moment()); // use current time if not completed yet
        earliestStart = moment.min(earliestStart, jobStart);
        latestEnd = moment.max(latestEnd, jobEnd);
    }

    // Calculate the duration using earliest start time and latest end time
    const runDuration = {
        started_at: earliestStart,
        completed_at: latestEnd
    };

    // For the outer level, add levelIndicator as 0
    print(output, '', run.conclusion, `${displayName}`, { itemDuration: runDuration, html_url: run.html_url }, 0);

    for (let job of jobs) {
        // Update earliest start and latest end times
        let jobStart = moment(job.started_at);
        let jobEnd = moment(job.completed_at || moment()); // use current time if not completed yet
        earliestStart = moment.min(earliestStart, jobStart);
        latestEnd = moment.max(latestEnd, jobEnd);

        // For the submenus, add levelIndicator as 1
        print(output, '--', job.conclusion, job.name, { itemDuration: job, html_url: job.html_url }, 1);

        for (let step of job.steps) {
            print(output, '----', step.conclusion, step.name, { itemDuration: step, html_url: job.html_url }, 1);
        }
    }
}


function print(output, level, status, name, options, levelIndicator) {
    let duration = ''
    if (options.itemDuration != undefined) {
        let item = options.itemDuration;
        let completedAt = item.completed_at || moment();  // use current time if not completed yet
        const diff = moment(completedAt).diff(moment(item.started_at), 'milliseconds');
        if(levelIndicator === 0) {
            // For the outer level, add " ago"
            duration = '\033[0;36m' + ` (${humanizeDuration(diff, { round: true, largest: 2 })} ago)` + '\033[0m';
        } else {
            // For the submenus, don't add " ago"
            duration = '\033[0;36m' + ` (${humanizeDuration(diff, { round: true })})` + '\033[0m';
        }
    }
    let href = ` | href=${options.html_url}`;
    output.push(`${level} ${icon(status)} ${name}${duration}${href}`);
}



function icon(status) {
    switch (status) {
        case 'success': return '\033[0;32m●\033[0m'
        case 'failure': return '\033[0;31m●\033[0m'
        case 'cancelled': return '\033[0;37m●\033[0m'
        case 'pending': return '\033[0;34m●\033[0m'
        case 'skipped': return '\033[0;30m●\033[0m'
        default: return '\033[0;34m●\033[0m'
    }
}
