import { Mastra } from "@mastra/core/mastra";
import { weatherAgent } from "./agents/weather-agent";

export const mastra = new Mastra({
	observability: {
		default: { enabled: true }, // Enables DefaultExporter and CloudExporter
	},
	agents: { weatherAgent },
});
