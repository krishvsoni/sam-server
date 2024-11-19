const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the local image name to tag: ', (localImageName) => {
  rl.question('Enter the tag name for the Docker image to push: ', (tag) => {
    const remoteImageName = `krishsoni/sam-server:${tag}`;
    try {
      console.log(`Tagging Docker image: ${localImageName} as ${remoteImageName}`);
      execSync(`docker tag ${localImageName} ${remoteImageName}`, { stdio: 'inherit' });
      console.log(`Successfully tagged Docker image: ${remoteImageName}`);

      console.log(`Pushing Docker image: ${remoteImageName}`);
      execSync(`docker push ${remoteImageName}`, { stdio: 'inherit' });
      console.log(`Successfully pushed Docker image: ${remoteImageName}`);
    } catch (error) {
      console.error(`Error tagging or pushing Docker image: ${error.message}`);
    }
    rl.close();
  });
});