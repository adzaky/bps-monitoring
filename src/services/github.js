import axios from "axios";
import { GITHUB_CONFIG } from "@/constants/config";

const baseUrl = `https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}`;
const headers = {
  Authorization: `Bearer ${GITHUB_CONFIG.TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

export const githubService = {
  async getLatestWorkflowRun(workflowId) {
    try {
      const response = await axios.get(`${baseUrl}/actions/workflows/${workflowId}/runs?per_page=1`, { headers });
      return response.data.workflow_runs[0] || null;
    } catch (error) {
      console.error("Error fetching latest run:", error);
      throw error;
    }
  },

  async getWorkflowRun(runId) {
    try {
      const response = await axios.get(`${baseUrl}/actions/runs/${runId}`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching workflow status:", error);
      throw error;
    }
  },

  async triggerWorkflow(workflowId) {
    try {
      await axios.post(
        `${baseUrl}/actions/workflows/${workflowId}/dispatches`,
        { ref: GITHUB_CONFIG.BRANCH },
        { headers }
      );
      return true;
    } catch (error) {
      console.error("Error triggering workflow:", error);
      throw error;
    }
  },
};
