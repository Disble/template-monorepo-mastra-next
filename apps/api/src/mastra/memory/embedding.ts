import { ollama } from "ollama-ai-provider-v2";
import { VECTOR_STORE } from "../constants/memory.constant";

// const embedder = ollama.embedding("embeddinggemma"); // no
const embedder = ollama.embedding(VECTOR_STORE.EMBEDDING_NAME); // no
// const embedder = ollama.embedding("zylonai/multilingual-e5-large:latest"); // no

/**
 * Default embedder configuration for the Mastra memory system.
 * Uses Ollama's Qwen3-Embedding:0.6b model which produces 768-dimensional vectors.
 * This embedder is used to convert text into numerical vectors for semantic search and memory retrieval.
 *
 * @see {@link VECTOR_STORE} in constants.ts for the expected vector dimension
 */
export default embedder;
