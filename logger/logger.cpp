#include "logger.h"

  
void Logger::a() {
    int i = 0;
    cin >> i;

    if((i < 0) || i >= static_cast<int>(master.size())) {
        cerr << "Position given is out of bounds.\n";
        return;
    }

    excerpt.push_back(append[i]);
    cout << "log entry " << i << " appended\n";
}

void Logger::l() {
    cout << "excerpt list cleared\n";
    if(excerpt.empty()) {
        cout << "(previously empty)\n";
    }
    else {
        cout << "previous contents:\n";

        cout << 0 << '|' << master[excerpt.front()] << '\n';
        cout << "...\n";
        cout << excerpt.size()-1 << '|' << master[excerpt.back()] << '\n';
    }

    excerpt.clear();
}

void Logger::t() {
    string time1;
    string time2;
    //Read in the space before the timestamps
    getline(cin, time1, ' ');
    getline(cin, time1, '|');
    getline(cin, time2);
    if((time1.size() != 14) || (time2.size() != 14)) {
        cerr << "One or more of the timmestamps were invalid.\n";
        return;
    }
    //Is going to be lower than the first log message that we want
    Entry eL(0, time1, "", "");

    //Is going to be higher than the first log message that we want
    Entry eU(0, time2, "", "");

    // Find the beginning of the timestamp range
    auto itL = lower_bound(begin(master), end(master), eL, [](const Entry &lhs, const Entry &rhs) {
        return (lhs.time < rhs.time);
    });

    timesearch.first = static_cast<uint32_t>(itL - master.begin());

    // Find the end of the timestamp range
    auto itU = upper_bound(itL, end(master), eU, [](const Entry &lhs, const Entry &rhs) {
        return (lhs.time < rhs.time);
    });

    timesearch.second = static_cast<uint32_t>(itU - master.begin());
    cout << "Timestamps search: " << timesearch.second - timesearch.first << " entries found\n";
    type = Search::time;
}

void Logger::m() {
    string time;
    cin >> time;

    if(time.length() != 14) {
        cerr << "Invalid time stamp\n";
    }

    Entry e(0, time, "", "");

    // Find the beginning of the timestamp range
    auto itL = lower_bound(begin(master), end(master), e, [](const Entry &lhs, const Entry &rhs) {
        return (lhs.time < rhs.time);
    });

    timesearch.first = static_cast<uint32_t>(itL - master.begin());

    // Find the end of the timestamp range
    auto itU = upper_bound(itL, end(master), e, [](const Entry &lhs, const Entry &rhs) {
        return (lhs.time < rhs.time);
    });

    timesearch.second = static_cast<uint32_t>(itU - master.begin());

    cout << "Timestamp search: " << timesearch.second - timesearch.first << " entries found\n";
    type = Search::time;
}

void Logger::c() {
    string category;
    cin >> ws;
    getline(cin, category);

    // If '\r' signifies a new line and no '\n', delete the '\r' at the end
    if((category.size() > 0) && (category[category.size()-1] == '\r')) {
        category = category.substr(0, category.size()-1); 
    }

    type = Search::cat;
    results.clear();
    tolow(category, lower);
    if(!(categ.find(lower) == categ.end())) {
        cout << "Category search: " << categ[lower].size() << " entries found\n";
        return;
    }
    else {
       cout << "Category search: 0 entries found\n";
       lower = "";
       return;
    }
}


void Logger::p() {
    for(size_t i = 0; i < excerpt.size(); i++) {
        cout << i << '|' << master[excerpt[i]] << '\n';
    }
}

void Logger::g() {
    if(type == Search::none) {
        cerr << "A previous search did not occur.\n";
        return;
    }

    if(type == Search::time) {
        for(uint32_t i = timesearch.first; i < timesearch.second; i++) {
            cout << master[i] << '\n';
        }
        return;
    }

    if(type == Search::cat) {
        if(lower.size() == 0) {
            return;
        }
        for(uint32_t i = 0; i < categ[lower].size(); i++) {
            cout << master[categ[lower][i]] << '\n';
        }
        return;
    }

    for(size_t i = 0; i < results.size(); i++) {
        cout << master[results[i]] << '\n';
    }
    return;    
}

void Logger::r() {
    if(type == Search::none)  {
        cerr << "A previous search did not occur.\n";
        return;
    }

    if(type == Search::cat) {
        if(lower.size() == 0) {
            cout << "0 log entries appended\n";
            return;
        }
        for(uint32_t i = 0; i < categ[lower].size(); i++) {
            excerpt.push_back(categ[lower][i]);
        }
        cout << categ[lower].size() << " log entries appended\n";
        return;
    }

    if(type == Search::time) {
        for(uint32_t i = timesearch.first; i < timesearch.second; i++) {
            excerpt.push_back(i);
        }
        cout << timesearch.second - timesearch.first << " log entries appended\n";
        return;
    }

    for(size_t i = 0; i < results.size(); i++) {
        excerpt.push_back(results[i]);
    }

    cout << results.size() << " log entries appended\n";
}

void Logger::e() {
    int i = 0;
    cin >> i;

    if((i < 0 ) || (i >= static_cast<int>(excerpt.size()))) {
        cerr << "Invalid entry position\n";
        return;
    }
    excerpt.push_back(excerpt[i]);
    excerpt.erase(excerpt.begin() + i);

    cout << "Moved excerpt list entry " << i << '\n';
}

void Logger::b() {
    int i = 0;
    cin >> i;

    if((i < 0 ) || (i >= static_cast<int>(excerpt.size()))) {
        cerr << "Invalid entry position\n";
        return;
    }
    excerpt.push_front(excerpt[i]);
    excerpt.erase(excerpt.begin() + i + 1);

    cout << "Moved excerpt list entry " << i << '\n';
}

void Logger::d() {
    int i = 0;
    cin >> i;

    if((i < 0 ) || (i >= static_cast<int>(excerpt.size()))) {
        cerr << "Invalid entry position\n";
        return;
    }

    excerpt.erase(excerpt.begin() + i);

    cout << "Deleted excerpt list entry " << i << '\n';
}

void Logger::s() {
    cout << "excerpt list sorted\n";

    if(excerpt.empty()) {
        cout << "(previously empty)\n";
        return;
    }

    cout << "previous ordering:\n";
    cout << 0 << '|' << master[excerpt.front()] << '\n';
    cout << "...\n";
    cout << excerpt.size()-1 << '|' << master[excerpt.back()] << '\n';

    sort(begin(excerpt), end(excerpt), [this](uint32_t lhs, uint32_t rhs) {
        return (this->master[lhs] < this->master[rhs]);
    });

    cout << "new ordering:\n";
    cout << 0 << '|' << master[excerpt.front()] << '\n';
    cout << "...\n";
    cout << excerpt.size()-1 << '|' << master[excerpt.back()] << '\n';
}

void Logger::k() {
    string keyw;
    cin >> ws;
    getline(cin, keyw);
    results.clear();
    type = Search::key;
    stringstream ss2(keyw);
    string keyword = "";
    string word = "";
    bool first = true;

    while(ss2 >> keyword) {
        for(auto &letter : keyword) {
            // Words are sperated by non-alphanumeric characters
            if(isalnum(letter)) {
                word += static_cast<char>(tolower(letter));
            }
            else {
                // If we have search results for the most recent word
                if((words.size() > 0) && !(words.find(word) == words.end())) {
                    // If its the first word just save all of the indexes that
                    // contain the word 
                    if(first) {
                        for(size_t i = 0; i < words[word].size(); i++) {
                            results.push_back(words[word][i]);
                        }
                        first = false;
                    }
                    // See if any of the entries in our current search also
                    // contain the word 
                    else {
                        vector<uint32_t> out;
                        set_intersection(begin(results), end(results), begin(words[word]),
                                         end(words[word]), back_inserter(out));
                        results = move(out);
                    }
                }
                // If there was no word
                else if (word.size() > 0) {
                    cout << "Keyword search: 0 entries found\n";
                    results.clear();
                    return;
                }
                word = "";
            }
        }

        // Do it one more time for the last word that ends with a space
        if((words.size() > 0) && !(words.find(word) == words.end())) {
            if(first) {
                for(size_t i = 0; i < words[word].size(); i++) {
                    results.push_back(words[word][i]);
                }
                first = false;
            }
            else {
                vector<uint32_t> out = {};
                set_intersection(begin(results), end(results), begin(words[word]),
                                 end(words[word]), back_inserter(out));
                results = move(out);
            }
        }
        else if (word.size() > 0) {
            cout << "Keyword search: 0 entries found\n";
            results.clear();
            return;
        }
        word = "";
    }

    // Do it one more time for the last word that ends with an endline ('\n')
    if((word.size() > 0) && !(words.find(word) == words.end())) {
        if(first) {
            for(size_t i = 0; i < words[word].size(); i++) {
                results.push_back(words[word][i]);
            }
            first = false;
        }
        else {
            vector<uint32_t> out;
            set_intersection(begin(words[word]), end(words[word]), 
                             begin(results), end(results), begin(out));
            results = move(out);
        }
    }

    cout << "Keyword search: "  << results.size() << " entries found\n";
}

