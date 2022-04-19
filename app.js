// 
// Modules
// 
const exec = require('child_process').exec;
const fs = require('fs');
const readline = require('readline');

// 
// Variables
// 
var dirs_with_git = [];

// Create a readline interface 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Get the path to the parent directory
var parent_dir = process.cwd().split('\\').slice(0, -1).join('\\');

// The function to scan all directories
function scandir(full_path) {

    // Get all files in the current directory
    fs.readdir(full_path, (err, files) => {

        // If there is an error, print it
        if (err) {
            console.log(err);
        } else {

            // Check if the files found are directories
            files.forEach(file => {

                // If the file is a directory, recursively call the function
                if (fs.lstatSync(full_path + '\\' + file).isDirectory()) {

                    // Check if the directory is called node_modules
                    if (file == 'node_modules') {} else {

                        // Check if the folder is a git repository
                        if (fs.existsSync(full_path + '\\' + file + '\\.git')) {

                            // If it is, run git pull in the directory
                            exec('git pull', {
                                cwd: full_path + '\\' + file
                            }, (err, stdout, stderr) => {

                                // If there is an error, print it
                                if (err) {
                                    console.log(err);
                                } else {

                                    // If there is no error, print the output
                                    console.log(stdout);
                                }
                            });

                        }
                        // Recursively call the function
                        scandir(full_path + '\\' + file);
                    }
                }
            });
        }
    });

}

// Ask if the user wants to scan the directory
rl.question('Do you want to scan the directory ' + parent_dir + '? (y/n) ', (answer) => {
    if (answer === 'y') {

        // Scan the parents parent directory with the scandir function
        scandir(parent_dir)
    }
    rl.close();

});