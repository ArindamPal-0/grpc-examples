const path = require("path");
const process = require("process");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.join(process.cwd(), "todo.proto");

function main() {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});

  const grpcObject = grpc.loadPackageDefinition(packageDefinition);
  const todoPackage = grpcObject.todoPackage;

  const client = new todoPackage.Todo(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  // const text = process.argv.length >= 3? process.argv.slice(2).join(" "): "empty task";
  // client.createTodo({ id: 0, text }, function (err, response) {
  //   console.log("Received from server: " + JSON.stringify(response));
  // });

  // client.readTodos({}, (err, response) => {
  //   // console.log("Received from server: " + JSON.stringify(response))
  //   console.dir(response);
  // });

  const call = client.readTodosStream();
  call.on("data", item => {
    console.dir(item);
  });

  call.on("end", e => console.log("server done!"));
}

if (require.main === module) {
  main();
}
