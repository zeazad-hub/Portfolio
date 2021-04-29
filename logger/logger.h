#include <iostream>
#include <fstream>
#include <deque>
#include <queue>
#include <vector>
#include <unordered_map>
#include <cmath>
#include <string.h>
#include <algorithm>
#include "Entry.h"
#include <cassert>
#include <sstream>

using namespace std;

// Enum that specifies the most recent search type done on
// the data in the log file
enum class Search {
    cat,
    time,
    none,
    key
};

class Logger {
    private:
        // Converts the string cat to its lower case and saves it in
        // ans
        void tolow(const string &cat, string& ans) {
            ans = cat;
            for(size_t i = 0; i < ans.size(); i++) {
                ans[i] = static_cast<char>(tolower(ans[i]));
            }      
        }

        // Master Log (entry data from the original log file)
        vector<Entry> master = {};

        // Search Result Containers
        pair<uint32_t, uint32_t> timesearch;
        vector<uint32_t> results = {};
        string lower;

        // Excerpt List (saves all of the search results that the user)
        // has searched for
        deque<uint32_t> excerpt;

        // Hash maps used for category search and word search commands
        // uint32_t is the entry id and string is the word that is
        // being searched for.
        unordered_map<string, vector<uint32_t>> categ;
        unordered_map<string, vector<uint32_t>> words;

        // Vector that matches an entry's index in the unsorted master log (index) 
        // to its index in the sorted master log (value) 
        vector<uint32_t> append = {};

        //What type of search was the most recent search?
        Search type = Search::none;

    public:

    // Class constructor
    // Takes in the name of the log file to run tyhe command prompt
    // on.
    Logger(const string &filename) {
        ifstream fin(filename);

        if(!(fin.is_open())) {
            cerr << "File could not be opened\n";
            exit(1);
        }

        // Fill the master log with entries
        string ts, cat, msg;
        while(getline(fin, ts, '|')) {
            getline(fin, cat, '|');
            getline(fin, msg);
            Entry e(master.size(), ts, cat, msg);
            master.push_back(e);
        }
        fin.close();

        // sort master log data
        sort(begin(master), end(master));

        append.resize(master.size());
        for(uint32_t i = 0; i < static_cast<uint32_t>(master.size()); i++) {
            // Fill up categ
            tolow(master[i].cat, lower);
            categ[lower].push_back(i);

            // Fill up append vector
            append[master[i].id] = i;
            // Fill up word search map
            stringstream ss(master[i].cat + ' ' + master[i].msg);
            string word;
            while(ss >> word) {
                string iw = "";
                for (auto letter:word) {
                    // Words are seperated by non alpha numeric characters
                    if(isalnum(letter)) {
                        iw += static_cast<char>(tolower(letter));
                    }
                    else {
                        if((iw.size() != 0) && ((words[iw].empty()) || (words[iw].back() != i))) {
                            words[iw].push_back(i);
                        }
                        iw = "";
                    }
                }

                if((iw.size() != 0) && ((words[iw].empty()  || (words[iw].back() != i)))) {
                    words[iw].push_back(i);
                }
            }
        }
        cout << master.size() << " entries read\n";
    }

    //Calls all of the seperate functions for every command
    //depending on user input
    void command() {
        char cmd = ' ';

        do {
            bool wrong = true;
            cout << "% ";
            cin >> cmd;
            string j;
            switch (cmd) {
                // '#' means comment
                case '#' :
                    getline(cin, j);
                    wrong = false;
                    break;

                case 'a' :
                    a();
                    wrong = false;
                    break;

                case 't' :
                    t();
                    wrong = false;
                    break;
                
                case 'm' :
                    m();
                    wrong = false;
                    break;
                
                case 'c' :
                    c();
                    wrong = false;
                    break;

                case 'p' :
                    p();
                    wrong = false;
                    break;

                case 'g' :
                    g();
                    wrong = false;
                    break;

                case 'r' :
                    r();
                    wrong = false;
                    break;

                case 'l' :
                    l();
                    wrong = false;
                    break;

                case 'e' :
                    e();
                    wrong = false;
                    break;

                case 'd' :
                    d();
                    wrong = false;
                    break;
                
                case 'b' :
                    b();
                    wrong = false;
                    break;

                case 's' :
                    s();
                    wrong = false;
                    break;
                
                case 'k' :
                    k();
                    wrong = false;
                    break;
            }

            if((wrong) && (cmd != 'q')) {
                cerr << cmd << " is not a valid command.\n";
            }

        } while (cmd != 'q');
    }

    //Have functions for every command here

    // 'a' command
    // Appends the log entry at the specified index to the
    // end of the excerpt list
    void a();

    // 't' command
    // Searches for the entries that fall in between
    // the 2 timestamps given (this is a timesearch)
    void t();

    // 'm' command
    // Searches for the entries that have the
    // timestamp given (this is a timesearch)
    void m();

    // 'c' command
    // Searches for the entries that have the category
    // given (this is a category search)
    void c();

    // 'p' command
    // Prints the contents of the excerpt list
    void p();

    // 'g' command
    // Shows the entries in the most recent search result.
    // If a search has not occurred, prints nothing and reprompts
    // the user for another command. 
    void g();

    // 'r' command
    // Appends the entries in the most recent search result to the end
    // of the excerpt list. If a search has not occurred, prints nothing
    // and reprompts the user for another command.
    void r();

    // 'l' command
    // clears the excerpt list so that it has no entries saved
    void l();

    // 'e' command
    // Moves the entry in the given index in of the excerpt list to the end
    // of the excerpt list.
    void e();

    // 'd' command
    // Deletes the entry in the given index in of the excerpt list.
    void d();

    // 'b' command
    // Moves the entry in the given index in of the excerpt list to the beginning
    // of the excerpt list.
    void b();

    // 's' command
    // Sorts the excerpt list
    void s();

    // 'k' command
    // Searches for the entries that have  all of the words
    // given (this is a word search)
    void k();
};
