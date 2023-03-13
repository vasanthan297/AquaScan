import tl = require('azure-pipelines-task-lib/task');
const tr = require('azure-pipelines-task-lib/toolrunner');
const fs = require('fs');
const path = require('path');


async  function run() {
  try {
      
       const endpointId: string | undefined = tl.getInput('connection', true);
	   console.log(endpointId)
       if (endpointId) {
            const endpointAuth: tl.EndpointAuthorization | undefined = tl.getEndpointAuthorization(endpointId, false);
            if(endpointAuth){
                const url = tl.getEndpointUrl(endpointId, false);				
				//const token = endpointAuth.parameters.apitoken
				
				const username: string = endpointAuth.parameters.username;
                const password: string = endpointAuth.parameters.password;
			
			    const podman = tl.tool('podman');
				const podmanPath = tl.which('podman', true);
				podman.arg('run');
                podman.arg('--rm');
                podman.arg('busybox');
                podman.arg('echo');
                podman.arg('Hello, world!');
				
				
				
				console.log(`Full command: ${podmanPath} ${podman.line('')}`);
				//podman.line(`Full command: ${podmanPath} ${podman.line()}`);

                  			
				const result = await podman.exec();
				
if (result != 0) {
  console.error(result);
  process.exit(1);
} else {
  console.log(`Command exited with code ${result}`);
}
				
          } else {
               console.error('endpointAuth object not found............')
          }
        } else {
            console.error(`Authorization for endpoint '${endpointId}' not found.`);
        }	
	
  } catch (error) {
    // Task failed
    tl.setResult(tl.TaskResult.Failed, error.message);
  }
}

run();