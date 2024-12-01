const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the tag name for the Docker image: ', (tag) => {
  const imageName = `krishsoni/sam-server:${tag}`;
  try {
    console.log(`Building Docker image with tag: ${imageName}`);
    execSync(`docker build -t ${imageName} .`, { stdio: 'inherit' });
    console.log(`Successfully built Docker image: ${imageName}`);
  } catch (error) {
    console.error(`Error building Docker image: ${error.message}`);
  }
  rl.close();
});