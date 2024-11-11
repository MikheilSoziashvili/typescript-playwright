const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("GITHUB_TOKEN");
    const workflowId = core.getInput("workflow_id");
    const ref = core.getInput("ref");

    const octokit = github.getOctokit(token);

    // Trigger the workflow
    await octokit.rest.actions.createWorkflowDispatch({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      workflow_id: workflowId,
      ref: ref,
    });

    console.log(`Triggered workflow: ${workflowId} on ref: ${ref}`);
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
}

run();