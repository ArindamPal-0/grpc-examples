const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const process = require("process");

const PROTO_PATH = path.join(process.cwd(), "helloworld.proto");

// Implements the SayHello RPC method
function sayHello(call, callback) {
  callback(null, { message: `Hello, ${call.request.name}` });
}

// Starts a RPC server that receives request for the Greeter service at the sample port
function main() {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const helloworldPackage =
    grpc.loadPackageDefinition(packageDefinition).helloworld;

  const server = new grpc.Server();
  server.addService(helloworldPackage.Greeter.service, { sayHello });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

if (require.main === module) {
  main();
}
