import { Client, Databases } from "appwrite";

const client = new Client();
const db_id = "675026fd000adda3b76e";
const collection_id = "6750270f00098e6096b6";

client.setProject('675025d50004dbc7f75e');

export const databases = new Databases(client);
export {db_id , collection_id}
