import { MongoClient, ServerApiVersion, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "devclass";

if (!uri) {
  // We don't throw at import time so that build-time pages without DB still compile.
  console.warn("[mongodb] MONGODB_URI not set");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient() {
  return new MongoClient(uri!, {
    serverApi: { version: ServerApiVersion.v1, strict: false, deprecationErrors: true },
  });
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClient().connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createClient().connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export { clientPromise };

export const COLLECTIONS = {
  users: "users",
  attempts: "attempts",
  answers: "answers",
  buildLog: "build_log",
} as const;
