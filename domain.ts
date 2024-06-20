import domain from "domain";

console.log((process as any).domain?.dataFromClient);
setInterval(() => {
  console.log((process as any).domain?.dataFromClient);
}, 1000);

setTimeout(async () => {
  const aDomain = domain.create();
  aDomain["dataFromClient"] = "data";
  aDomain.enter();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  aDomain.exit();
}, 3000);
