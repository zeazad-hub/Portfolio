#include <iostream>
#include <cmath>
using namespace std;
void merge(int * orig, int* first, int* second, int n, int m, int m2) {
    int* ptr1 = first;
    int* ptr2 = second;
    for(int * ptr = orig; ptr < orig + n; ++ptr) {
        if (ptr1 >= (first + m)) {
            *ptr = *ptr2;
            ++ptr2;
        }
        else if (ptr2 >= (second + m2)) {
            *ptr = *ptr1;
            ++ptr1;
        }
        else if (*ptr1 < *ptr2) {
            *ptr = *ptr1;
            ++ptr1;
        }
        else {
            *ptr = *ptr2;
            ++ptr2; 
        }
    }
} 
void mergeSort(int* list, int n) {
    if (n > 1) {
        int m = n / 2;
        int m2 = m + (n % 2);
        int first[m];
        int second[m2];
        for(int i = 0; i < m; i++) {
            first[i] = list[i];
            second[i] = list[m + i];
        }
        if (m2 > m) {
            second[m] = list[m + m];
        }
        mergeSort(first, m);
        mergeSort(second, m2);
        merge(list, first, second, n, m, m2);
    }
}
int main() {
    cout << "How many numbers are going to be in the list? : ";
    int g = 0;
    cin >> g;

    int list[g] = {};
    cout << "Please type your list of integers to be sorted: ";
    int i = 0;
    while(i < g) {
        cin >> list[i];
        i++;
    }
    cout << "Original: ";
    for(int c = 0; c < g; c++) {
        cout << list[c] << " ";
    }
    cout << std::endl;
    mergeSort(list, g);
    cout << "Sorted: ";
    for(int b = 0; b < g; b++) {
        cout << list[b] << " ";
    }
    cout << std::endl;
}
