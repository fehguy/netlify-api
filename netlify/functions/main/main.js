const fs = require("fs");

const handler = async (event) => {
  try {
    const data = fs.readFileSync("./src/openapi.yaml", "utf-8");
    console.log(data);
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
