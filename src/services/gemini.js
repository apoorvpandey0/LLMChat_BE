import { GoogleGenerativeAI } from '@google/generative-ai';
import neo4j from 'neo4j-driver';


// Function to fetch chat history from Neo4j
const fetchChatHistory = async (userId, limit = 5) => {
    // Initialize Neo4j connection
    const driver = neo4j.driver(
        process.env.NEO4J_URI, 
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
    );
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)


    const session = driver.session();
    try {
        const query = `
            MATCH (m:Message)-[:SENT_BY]->(u:User {id: $userId})
            RETURN m.text ORDER BY m.timestamp DESC LIMIT $limit
        `;
        const result = await session.run(query, { userId, limit });

        return result.records.map(record => record.get('m.text')).reverse();
    } finally {
        await session.close();
    }
};

// Function to store chat messages in Neo4j
const storeMessage = async (userId, message, response) => {
    // Initialize Neo4j connection
    const driver = neo4j.driver(
        process.env.NEO4J_URI, 
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
    );
    
    const session = driver.session();
    try {
        await session.run(
            `MERGE (u:User {id: $userId})
             CREATE (m:Message {text: $message, timestamp: timestamp()})-[:SENT_BY]->(u)
             CREATE (r:Message {text: $response, timestamp: timestamp()})-[:SENT_BY]->(u)
             CREATE (m)-[:REPLY_TO]->(r)`,
            { userId, message, response }
        );
    } finally {
        await session.close();
    }
};

// Function to generate response
export const generateResponse = async (prompt) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        console.log(prompt);
        
        const resp = await model.generateContent(prompt);
        const aiResponse = resp.response.text();
        console.log(aiResponse);
        

        return aiResponse;
    } catch (error) {
        console.error('Error:', error);
        return 'An error occurred while generating the response.';
    }
};
