import { randomUUID } from "crypto";
import { startServer } from "./server";

startServer().then(() => {
  console.log("running validations...");

  // run this script with: npx tsx ./index.ts
  // scenarios:
  // 1. run only validationDomainAPI: no errors
  // 2. run only validateAsyncLocalStorageAPI: no errors
  // 3. run both: errors in async local storage API
  validationDomainAPI();
  validateAsyncLocalStorageAPI();
});

function validationDomainAPI() {
  setInterval(async () => {
    const data = randomUUID();
    const response = await fetch("http://localhost:3000/domain", {
      headers: {
        data,
      },
    });
    const responseData = response.headers.get("data");
    if (responseData !== data) {
      console.error(
        `Data mismatch in domain API: client: ${data} !== server: ${responseData}`
      );
    }
  }, 50);
}

function validateAsyncLocalStorageAPI() {
  setInterval(async () => {
    const data = randomUUID();
    const response = await fetch("http://localhost:3000/async-local-storage", {
      headers: {
        data,
      },
    });
    const responseData = response.headers.get("data");
    if (responseData !== data) {
      console.error(
        `Data mismatch in async local storage API: client: ${data} !== server: ${responseData}`
      );
    }
  }, 50);
}
