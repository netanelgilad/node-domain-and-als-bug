import express from "express";
import domain, { Domain } from "domain";
import { AsyncLocalStorage } from "async_hooks";

export function startServer() {
  return new Promise<void>((resolve) => {
    const app = express();

    const someAsyncStorage = new AsyncLocalStorage();

    app.get("/domain", async (req, res) => {
      const dataFromClient = req.headers["data"];

      const theDomain = domain.create();

      theDomain["dataFromClient"] = dataFromClient;

      myOwnRunImpl(theDomain, async () => {
        const theAsyncData = await anAsyncFunctionThatReturnsFromContext();
        res.header("data", theAsyncData);
        res.end();
      });
    });

    app.get("/async-local-storage", async (req, res) => {
      const dataFromClient = req.headers["data"];

      someAsyncStorage.run({ dataFromClient }, async () => {
        const theAsyncData = await anAsyncFunctionThatReturnsFromContext();

        res.header("data", theAsyncData);
        res.end();
      });
    });

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
      resolve();
    });

    async function anAsyncFunctionThatReturnsFromContext() {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
      return (
        (process as any).domain?.["dataFromClient"] ??
        someAsyncStorage.getStore()?.["dataFromClient"]
      );
    }
  });
}

function myOwnRunImpl(aDomain: Domain, fn: () => void) {
  aDomain.enter();
  const ret = fn.apply(aDomain, [...arguments].slice(2));
  aDomain.exit();

  return ret;
}
