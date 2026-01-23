import { MCPServer } from "@mastra/mcp";
import { getContentPageTool } from "../tools/get-content-page/get-content-page-tool";

export const disbleMcpServer = new MCPServer({
  id: "disble-mcp-server",
  name: "Disble MCP Server",
  version: "1.0.0",
  tools: { "get-content-page": getContentPageTool },
});
