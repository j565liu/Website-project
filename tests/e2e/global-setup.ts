import { rm } from "node:fs/promises";
import migrateTestDatabase from "../unit/global-setup";

export default async function setup() {
  await rm(".outbox/e2e", { recursive: true, force: true });
  await migrateTestDatabase();
}
