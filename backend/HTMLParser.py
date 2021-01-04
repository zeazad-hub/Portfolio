#This html parser that I designed can find the data(words)
#stored between two tags of my choosing in an HTML file
#and print them back out to the terminal. In the case below the
#html parser is searching for vocabularyu words in an online textbook.
from html.parser import HTMLParser
import sys
class MyHTMLParser(HTMLParser) :
    def __init__(self) :
        HTMLParser.__init__(self)
        self.bold = False
    
    def __new__(self) :
        self.bold = False
        return HTMLParser.__new__(self)
    
    def handle_starttag(self, tag, attrs) :
        s = [('style', 
        'left: 390.384px; top: 661.162px; font-size: 9.6px; font-family: sans-serif; transform: scaleX(0.993498);')]
        if ((tag == 'span') and 
        (attrs == s)) :
            self.bold = True

    def handle_endtag(self, tag) :
        if (tag == 'span') :
            self.bold = False

    def handle_data(self, data) :
        if(self.bold) :
            print(sys.argv[4], data)

parser = MyHTMLParser()
filename = sys.argv[1]
with open(filename, "r") as f:
    data = f.read()
    parser.feed(data)

hit_except = False
try :
    f = open(filename, "r")
except:
    hit_except = True
finally:
    if not hit_except:
        f.close()

