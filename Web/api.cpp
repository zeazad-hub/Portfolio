#include "json.hpp"
#include <iostream>
#include <list>

using nlohmann::json;
using namespace std;

class MethodReader {
    private:
    //All of the valid options for the path of
    //a request.
    const string options[4] = {"/api/",
                               "/api/queue/",
                               "/api/queue/tail/",
                               "/api/queue/head/"};

    //Holds the location, position, and uniqname of one person in the office
    //hours queue.
    struct hold {
        string loc;
        int pos;
        string uniq;
    };

    //The office hours queue.
    list<hold> q;

    //Holds all of the jsons in the queue
    json all;

    //Prints out an error message if the request was invalid.
    void bad_request(const string& vers) {
        cout << vers << " " << 400 << " Bad Request" << endl;
        cout << "Content-Type: application/json; charset=utf-8" << endl;
        cout << "Content-Length: 0" << endl;
        cout << endl;
    }

    public:
    //Constructer
    MethodReader() {}

    //Handles a valid GET request.
    //Assumes that the request is a GET request and has a valid path
    //for a GET request.
    //RETURNS: nothing
    //MODIFIES: nothing
    //EFFECTS: Prints out the response for a GET request
    //to cout
    void get_response(const string& path, const string& vers) {
        cout << vers << " " << 200 << " OK" << endl;
        cout << "Content-Type: application/json; charset=utf-8" << endl;
        json j2;
        if (path == options[0]) {
            j2 = {{"queue_head_url", "http://localhost/queue/head/"}, 
                {"queue_list_url", "http://localhost/queue/"}, 
                {"queue_tail_url", "http://localhost/queue/tail/"}};
        }
        else if (path == options[3]) {
            hold h = q.front();
            j2["location"] = h.loc;
            j2["position"] = h.pos;
            j2["uniqname"] = h.uniq;
        }
        else {
            j2["count"] = q.size();
            j2["results"] = all;
        }

        string s = j2.dump(4) + "\n";
        size_t length = s.length();
        cout << "Content-Length: " << length << endl;
        cout << endl;
        cout << s;
    }

    //Handles a valid POST request.
    //Assumes that the request is a POST request and has a valid path
    //for a POST request.
    //RETURNS: nothing
    //MODIFIES: nothing
    //EFFECTS: Prints out the response for a POST request
    //to cout
    void post_response(const string& vers, json& j) {
        cin >> j;
        int pos = q.size() + 1;
        hold h = {j["location"], pos, j["uniqname"]};
        q.push_back(h);
        json j2;
        j2["location"] = h.loc;
        j2["position"] = h.pos;
        j2["uniqname"] = h.uniq;
        all.push_back(j2);

        cout << vers << " " << 201 << " Created" << endl;
        cout << "Content-Type: application/json; charset=utf-8" << endl;
        string s = j2.dump(4) + "\n";
        size_t length = s.length();
        cout << "Content-Length: " << length << endl;
        cout << endl;
        cout << s;
    }

    void delete_response(const string& vers) {
        q.pop_front();
        cout << vers << " " << 204 << " No Content" << endl;
        cout << "Content-Type: application/json; charset=utf-8" << endl;
        cout << "Content-Length: " << 0 << endl;
        cout << endl;
    }

    //Checks if the request is valid, meaning that the method
    //request (GET, POST, or DELETE) and the path are an appropriate
    //match. If the request is valid then it returns false, returns
    //true otherwise. If the request is invalid an error message 
    //for a bad request is also printed to cout.
    //RETURNS: true or false
    //MODIFIES: nothing
    //EFFECTS: prints an error message to cout if the request
    //is not valid
    bool check_fail(const string& meth, const string& path, const string& vers) {
        bool bad_opt = true;
        for(int i = 0; i < 4; i++) {
            if(path == options[i]) {
                bad_opt = false;
                break;
            }
        }
        if((bad_opt) || ((meth == "GET") && (path == options[2])) ||
        ((meth == "POST") && (path != options[2])) ||
        ((meth == "DELETE") && (path != options[3]))) {
            bad_request(vers);
            return true;
        }

        return false;
    }
};



int main(int argc, char** argv) {
    MethodReader read;
    string meth;
    string path;
    string vers;
    string rid;
    json j;
    while(cin >> meth >> path >> vers >> rid 
          >> rid >> rid >> rid >> rid >> rid >> rid) {
              if (!(read.check_fail(meth, path, vers))) {
                  if (meth == "GET") {
                      read.get_response(path, vers);
                  }
                  else if (meth == "POST") {
                      read.post_response(vers, j);
                  }
                  else {
                      read.delete_response(vers);
                  }
              }
    }
    return 0;
}
