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
var command;

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
                            exec(command, {
                                cwd: full_path + '\\' + file
                            }, (err, stdout, stderr) => {

                                // If there is an error, print it
                                if (err || stderr) {
                                    console.log(err || stderr);
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

// Ask what the user wants to to with the directory
console.clear();
console.log('What do you want to do within the directory ' + parent_dir + '?');
rl.question('1> Git Pull all subdirectories\n2> Git Push all subdirectories\n3> Custom command?\n> ', (answer) => {
    if (answer == '1') {

        // Set the command to git pull
        command = 'git pull';

        // Scan the parents parent directory with the scandir function
        scandir(parent_dir);

        // Close the readline interface
        rl.close();

    } else if (answer == '2') {

        // Set the command to git push
        command = 'git push';

        // Scan the parents parent directory with the scandir function
        scandir(parent_dir);

        // Close the readline interface
        rl.close();

    } else if (answer == '3') {

        // Ask the user for the command
        rl.question('Enter the custom command\n> ', (answer) => {

            // Set the command to the user input
            command = answer;

            // Scan the parents parent directory with the scandir function
            scandir(parent_dir);

            // Close the readline interface
            rl.close();

        });

    } else {

        // If the user input is not 1, 2 or 3, print an error
        console.log('Error: Invalid input');

    }
});