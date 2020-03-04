import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "notes",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log("e", e.message);
    return failure({ status: false });
  }
}

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// export function main(event, context, callback) {
//   //parse() data becomes a javascript object
//   const data = JSON.parse(event.body);

//   const params = {
//     TableName: process.env.tableName,
//     Item: {
//       //'userId': user identities are federated through the
//       // Cognito Identity Pool, we will use the identity id
//       // as the user id of the authenticated user
//       userId: event.requestContext.identity.cognitoIdentityId,
//       // userId: "USER-SUB-1234",
//       noteId: uuid.v1(),
//       content: data.content,
//       attachment: data.attachment,
//       createdAt: Date.now()
//     }
//   };

//   dynamoDb.put(params, (error, data) => {
//     const headers = {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Credentials": true
//     };

//     console.log("data", data);
//     console.log("params", params.Item);
//     console.log("error", error.message);

//     if (error) {
//       const response = {
//         statusCode: 500,
//         headers: headers,
//         body: JSON.stringify({ status: false })
//       };
//       callback(null, response);
//       return;
//     }

//     // Return status code 200 and the newly created
//     const response = {
//       statusCode: 200,
//       headers: headers,
//       body: JSON.stringify(params.Item)
//     };
//     callback(null, response);
//   });
// }
