const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const process = require("process");

const PROTO_PATH = path.join(process.cwd(), "helloworld.proto");

function main() {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const helloworldPackage =
    grpc.loadPackageDefinition(packageDefinition).helloworld;

  const client = new helloworldPackage.Greeter(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  client.sayHello({ name: "Arindam" }, function (err, response) {
    console.log("Greeting:", response.message);
  });
}

if (require.main === module) {
  main();
}
