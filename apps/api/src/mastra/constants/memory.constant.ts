/**
 * Configuration constants for the vector store used in the Mastra memory system.
 * These values must match the embedding model configuration to ensure compatibility.
 */
export const VECTOR_STORE = {
  /** The name of the vector store implementation being used */
  VECTOR_NAME: "pgVector",
  /** The name of the embedding model being used */
  EMBEDDING_NAME: "qwen3-embedding:0.6b",
  /** The dimensionality of the vector space
   *  This should match the dimensionality of the embeddings used in the application.
   *  For example, if using OpenAI's text-embedding-ada-002 model, the dimension is 1536.
   *  In this case, the dimension is 768.
   *  For Ollama Qwen3-Embedding:0.6b the dimension is 768.
   */
  DIMENSION: 768,
};
