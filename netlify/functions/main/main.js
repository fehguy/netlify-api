const swambda = require('swambda')
const yaml = require('yaml')
const fs = require('fs')


const controllerMap = (path) => {
  if (path.indexOf("./") === 0) {
      path = path.substring(2);
  }

  return require([process.cwd(), "src", "controllers", path].join("/"))
}

const handler = async (event, context, callback) => {
  // this is essential when using MongoDB
  context.callbackWaitsForEmptyEventLoop = false;

  // tell swambda to bind to a cache, global in this case
  swambda.cacheWith(global);

  try {
      const router = await swambda.fromCache()
          .catch(() => {
              // not in cache, need to create

              const path = [".", "src", "openapi.yaml"].join("/");
              const file = fs.readFileSync(path, 'utf8');
              const swagger = yaml.parse(file);

              // set the route path
              return new Swambda("/api/v1")
                  .cors()
                  .preProcessor(preProcessor)
                  .postProcessor(postProcessor)
                  .controllerMap(controllerMap)
                  .load(swagger)
                  .then(router => {
                      return router;
                  });
          })

      return router.process(event);
  }
  catch (e) {
      console.log(e);
  }
};

const preProcessor = function (event, args) {
  return new Promise((resolve, reject) => {
      console.log("Pre Processor");
      resolve(args);
  });
}

const postProcessor = function (response) {
  return new Promise((resolve, reject) => {
      console.log("Post Processor")
      resolve(response);
  })
}

module.exports = { handler }
