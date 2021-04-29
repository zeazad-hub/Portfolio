#include <iostream>
#include <fstream>
#include <deque>
#include <queue>
#include <vector>
#include <unordered_map>
#include <cmath>
#include <string.h>
#include <algorithm>

using namespace std;

// This class represents an individual log entry in the master log file.
// Every entry has an entry id, a timestamp, a subject category, and a 
// message. 
class Entry {
        public:
            uint32_t id = 0;
            uint64_t time = 0;
            string ts;
            string cat;
            string msg;

            // Constructor
            Entry(const size_t ide, const string &t, const string &c, const string &m) : 
            id(static_cast<uint32_t>(ide)), ts(t), cat(c), msg(m) {
                time = 0;
                uint64_t order = 1;
                // Convert the timestamp(string) into a uint64_t
                for(size_t i = t.length(); i != 0; i -= 1) {
                    //Do not process the semicolons
                    if(t[i] != ':') {
                        uint64_t b = static_cast<uint64_t>(t[i] - '0');
                        time += b * order;
                        order *= 10;
                    }
                }
                uint64_t b = static_cast<uint64_t>(t[0] - '0');
                time += b * order;      
            }

            // Assignment operator, used in the swap and sort function
            // in the STL 
            Entry& operator=(const Entry &rhs) {
                id = rhs.id;
                time = rhs.time;
                ts = rhs.ts;
                cat = rhs.cat;
                msg = rhs.msg;
                return *this;
            }
};

// Print out operator
inline ostream& operator<<(ostream& os, const Entry &rhs) {
    os << rhs.id << '|' << rhs.ts << '|' << rhs.cat << '|' << rhs.msg;
    return os;
}

// Less than comparison operator
inline bool operator<(const Entry &lhs, const Entry &rhs) {
    if(lhs.time != rhs.time) {
      return (lhs.time < rhs.time);
    }
    else {
        int less = strcasecmp(lhs.cat.c_str(), rhs.cat.c_str());
        return ((less < 0) ||
                ((less == 0) && (lhs.id < rhs.id)));
    }
}

// Greater than comparison operator
inline bool operator>(const Entry &lhs, const Entry &rhs) {
    if(lhs.time != rhs.time) {
      return (lhs.time > rhs.time);
    }
    else {
        int more = strcasecmp(lhs.cat.c_str(), rhs.cat.c_str());
        return ((more > 0) ||
                ((more == 0) && (lhs.id > rhs.id)));
    }
}
