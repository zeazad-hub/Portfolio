#include <iostream>
#include <cmath>

using namespace std;

//merge helper function that takes in an unsorted array of ints and 2 sorted arrays of 
//ints as well as the respective sizes of the three arrays. os is the size of the orig 
//array, fs is the size of the first array, and ss is the size of the second array. The 
//first and second arrays are asssumed to be sorted and os is assumed to be equal to 
//fs + ss.
//RETURNS: nothing
//MODIFIES: orig
//EFFECTS: orig is sorted and contains all of the elements in first and second  
void merge(int * orig, int* first, int* second, int os, int fs, int ss) {
    int* ptr1 = first;
    int* ptr2 = second;
    for(int * ptr = orig; ptr < orig + os; ++ptr) {
        if (ptr1 >= (first + fs)) {
            *ptr = *ptr2;
            ++ptr2;
        }
        else if (ptr2 >= (second + ss)) {
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
//MergeSort function that takes in an unsorted array of ints and the size
//of the array. The end result is the list array being sorted from least 
//to greatest.This function is recursive.
//RETURNS: nothing
//MODIFIES: list
//EFFECTS: list is sorted from least to greatest 
void mergeSort(int* list, int n) {
    //If n only has 1 element or less it is already sorted.
    if (n > 1) {
        //Split list in half with first being the
        //front half and second being the back half.
        int m = n / 2;
        int m2 = m + (n % 2);
        int first[m];
        int second[m2];
        for(int i = 0; i < m; i++) {
            first[i] = list[i];
            second[i] = list[m + i];
        }
        //If the second array is 1 bigger than the first array then
        //the last element of the second array still needs to be filled.
        if (m2 > m) {
            second[m] = list[m + m];
        }

        //Sort the first array.
        mergeSort(first, m);
        //Sort the second array.
        mergeSort(second, m2);
        //Merge the two sorted arrays.
        merge(list, first, second, n, m, m2);
    }
}
int main() {
    //Read in the size of the list.
    cout << "How many numbers are going to be in the list? : ";
    int g = 0;
    cin >> g;

    //Read in the array.
    int list[g] = {};
    cout << "Please type your list of integers to be sorted: ";
    int i = 0;
    while(i < g) {
        cin >> list[i];
        i++;
    }

    //Print out the list in the order it was typed in.
    cout << "Original: ";
    for(int c = 0; c < g; c++) {
        cout << list[c] << " ";
    }
    cout << endl;

    //Print out the sorted list.
    mergeSort(list, g);
    cout << "Sorted: ";
    for(int b = 0; b < g; b++) {
        cout << list[b] << " ";
    }
    cout << endl;
}
