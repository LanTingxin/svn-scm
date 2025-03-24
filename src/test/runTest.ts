import * as path from "path";
import { runTests } from "vscode-test";

async function main() {
  const extensionDevelopmentPath = path.resolve(__dirname, "../../");
  const extensionTestsPath = path.resolve(__dirname, "../../out/test");

  try {
    await runTests({
      version: process.env.CODE_VERSION,
      extensionDevelopmentPath,
      extensionTestsPath
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Failed to run tests: ${err.message}\n${err.stack}`);
    } else {
      console.error(`Failed to run tests: ${err}`);
    }
    process.exit(1);
  }
}

main();