#include "logger.h"
#include <iostream>
#include <getopt.h>

using namespace std;

// This is a program that takes in a log file and allows a user to run a multitude
// of commands on the log file data (run searches or organize their own subset of the data)
// with the use of a custom command prompt.

// Handle argument options
void get_opt(int argc, char** argv) {
            int option_index = 0, option = 0;
            opterr = false;
            
            struct option longOpts[] = {{"help", 0, nullptr, 'h'},
                                        {nullptr,  0, nullptr, '\0'}};

            while((option = getopt_long(argc, argv, "h", longOpts, &option_index)) != -1) {
                switch(option) {
                    case 'h':
                        cout << "Insert a log file and a command prompt for you to run" << "\n";
                        cout << "commands related to the log file will pop up. The" << "\n";
                        cout << "command prompt will prompt you with \"% \" " << "\n";
                        exit(0);
                        break;
                }
            }
}

int main(int argc, char** argv) {
    ios_base::sync_with_stdio(false);
    get_opt(argc, argv);

    if(argc < 2) {
        cerr << "no file given\n";
        exit(1);
    }

    Logger log(argv[1]);

    log.command();
}