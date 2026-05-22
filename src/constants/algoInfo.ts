// ── Algorithm Info Registry ────────────────────────────────────────────────
// Each entry supplies the sidebar with explanation text and code snippets.
// Pages import the relevant entry and pass it to <AlgoSideBar algoInfo={...} />

export interface AlgoInfo {
  name: string;
  category: string;
  complexity: { time: string; space: string };
  description: string;
  steps: string[];
  implementations: {
    python: string;
    java: string;
    cpp: string;
    javascript: string;
    golang: string;
  };
}

// ── Linear Search ──────────────────────────────────────────────────────────
export const LINEAR_SEARCH_INFO: AlgoInfo = {
  name: 'Linear Search',
  category: 'Search',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    'Linear search scans each element in the array one by one from left to right until the target value is found or the end is reached. It works on both sorted and unsorted arrays.',
  steps: [
    'Start at index 0.',
    'Compare the current element with the target.',
    'If they match, return the index — target found!',
    'Otherwise move to the next element.',
    'If the end is reached without a match, return -1 (not found).',
  ],
  implementations: {
    python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i   # found
    return -1          # not found`,

    java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,

    cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,

    javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,

    golang: `func linearSearch(arr []int, target int) int {
    for i, v := range arr {
        if v == target {
            return i
        }
    }
    return -1
}`,
  },
};

// ── Binary Search ──────────────────────────────────────────────────────────
export const BINARY_SEARCH_INFO: AlgoInfo = {
  name: 'Binary Search',
  category: 'Search',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  description:
    'Binary search works on a sorted array by repeatedly halving the search space. It compares the target with the middle element and discards the half where the target cannot exist.',
  steps: [
    'Set left = 0, right = n-1.',
    'Calculate mid = (left + right) / 2.',
    'If arr[mid] == target, return mid.',
    'If target < arr[mid], search the left half (right = mid - 1).',
    'If target > arr[mid], search the right half (left = mid + 1).',
    'Repeat until left > right (not found).',
  ],
  implementations: {
    python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif target < arr[mid]:
            right = mid - 1
        else:
            left = mid + 1
    return -1`,

    java: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (target < arr[mid]) right = mid - 1;
        else left = mid + 1;
    }
    return -1;
}`,

    cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (target < arr[mid]) right = mid - 1;
        else left = mid + 1;
    }
    return -1;
}`,

    javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (target < arr[mid]) right = mid - 1;
    else left = mid + 1;
  }
  return -1;
}`,

    golang: `func binarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target {
            return mid
        } else if target < arr[mid] {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }
    return -1
}`,
  },
};

// ── Bubble Sort ────────────────────────────────────────────────────────────
export const BUBBLE_SORT_INFO: AlgoInfo = {
  name: 'Bubble Sort',
  category: 'Sort',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Larger elements "bubble up" to the end with each pass.',
  steps: [
    'Iterate over the array n-1 times.',
    'In each pass, compare each adjacent pair.',
    'Swap if the left element is greater than the right.',
    'After each pass, the largest unsorted element is placed correctly.',
    'Stop early if no swaps occur in a pass (optimised).',
  ],
  implementations: {
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,

    java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

    cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,

    golang: `func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        swapped := false
        for j := 0; j < n-1-i; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = true
            }
        }
        if !swapped { break }
    }
}`,
  },
};

// ── Selection Sort ─────────────────────────────────────────────────────────
export const SELECTION_SORT_INFO: AlgoInfo = {
  name: 'Selection Sort',
  category: 'Sort',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Selection sort divides the array into a sorted and unsorted region. It repeatedly finds the minimum element in the unsorted region and moves it to the end of the sorted region.',
  steps: [
    'Start with i = 0 (the sorted boundary).',
    'Find the minimum element in arr[i..n-1].',
    'Swap it with arr[i].',
    'Advance i by 1.',
    'Repeat until i reaches n-1.',
  ],
  implementations: {
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,

    java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        int tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
    }
}`,

    cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        swap(arr[i], arr[minIdx]);
    }
}`,

    javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++)
      if (arr[j] < arr[minIdx]) minIdx = j;
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,

    golang: `func selectionSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        minIdx := i
        for j := i + 1; j < n; j++ {
            if arr[j] < arr[minIdx] { minIdx = j }
        }
        arr[i], arr[minIdx] = arr[minIdx], arr[i]
    }
}`,
  },
};

// ── Insertion Sort ─────────────────────────────────────────────────────────
export const INSERTION_SORT_INFO: AlgoInfo = {
  name: 'Insertion Sort',
  category: 'Sort',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Insertion sort builds a sorted array one element at a time. It picks each element from the unsorted part and inserts it into its correct position in the sorted part.',
  steps: [
    'Start at index 1 (first element is trivially sorted).',
    'Pick arr[i] as the key.',
    'Shift all elements in the sorted region that are greater than key one position right.',
    'Insert key in the correct position.',
    'Repeat for all remaining elements.',
  ],
  implementations: {
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,

    java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; j--;
        }
        arr[j + 1] = key;
    }
}`,

    cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; j--;
        }
        arr[j + 1] = key;
    }
}`,

    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]; j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,

    golang: `func insertionSort(arr []int) {
    for i := 1; i < len(arr); i++ {
        key, j := arr[i], i-1
        for j >= 0 && arr[j] > key {
            arr[j+1] = arr[j]; j--
        }
        arr[j+1] = key
    }
}`,
  },
};

// ── Merge Sort ─────────────────────────────────────────────────────────────
export const MERGE_SORT_INFO: AlgoInfo = {
  name: 'Merge Sort',
  category: 'Sort',
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description:
    'Merge sort is a divide-and-conquer algorithm. It recursively splits the array in half, sorts each half, and then merges them back in sorted order.',
  steps: [
    'If the array has 0 or 1 element, it is already sorted.',
    'Split the array into two halves at the midpoint.',
    'Recursively sort the left half.',
    'Recursively sort the right half.',
    'Merge the two sorted halves into one sorted array.',
  ],
  implementations: {
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,

    java: `public static void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

static void merge(int[] arr, int l, int m, int r) {
    int[] tmp = Arrays.copyOfRange(arr, l, r + 1);
    int i = 0, j = m - l + 1, k = l;
    while (i <= m - l && j <= r - l)
        arr[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
    while (i <= m - l) arr[k++] = tmp[i++];
    while (j <= r - l) arr[k++] = tmp[j++];
}`,

    cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> tmp(arr.begin()+l, arr.begin()+r+1);
    int i=0, j=m-l+1, k=l;
    while (i<=m-l && j<=r-l)
        arr[k++] = tmp[i]<=tmp[j] ? tmp[i++] : tmp[j++];
    while (i<=m-l) arr[k++]=tmp[i++];
    while (j<=r-l) arr[k++]=tmp[j++];
}
void mergeSort(vector<int>& arr, int l, int r) {
    if (l>=r) return;
    int m = l+(r-l)/2;
    mergeSort(arr,l,m); mergeSort(arr,m+1,r); merge(arr,l,m,r);
}`,

    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  const res = []; let i = 0, j = 0;
  while (i < left.length && j < right.length)
    res.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return [...res, ...left.slice(i), ...right.slice(j)];
}`,

    golang: `func mergeSort(arr []int) []int {
    if len(arr) <= 1 { return arr }
    mid := len(arr) / 2
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])
    return mergeFn(left, right)
}
func mergeFn(l, r []int) []int {
    res := []int{}
    i, j := 0, 0
    for i < len(l) && j < len(r) {
        if l[i] <= r[j] { res = append(res, l[i]); i++ } else { res = append(res, r[j]); j++ }
    }
    return append(append(res, l[i:]...), r[j:]...)
}`,
  },
};

// ── Quick Sort ─────────────────────────────────────────────────────────────
export const QUICK_SORT_INFO: AlgoInfo = {
  name: 'Quick Sort',
  category: 'Sort',
  complexity: { time: 'O(n log n) avg, O(n²) worst', space: 'O(log n)' },
  description:
    'Quick sort picks a pivot element and partitions the array into elements smaller than the pivot (left) and larger (right), then recursively sorts each partition.',
  steps: [
    'Choose a pivot (commonly the last element).',
    'Partition: move elements smaller than pivot to the left, larger to the right.',
    'Place the pivot in its correct sorted position.',
    'Recursively apply to the left and right partitions.',
    'Base case: partitions of size 0 or 1 are already sorted.',
  ],
  implementations: {
    python: `def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,

    java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
static int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) { i++; int t=arr[i]; arr[i]=arr[j]; arr[j]=t; }
    }
    int t=arr[i+1]; arr[i+1]=arr[high]; arr[high]=t;
    return i + 1;
}`,

    cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    swap(arr[i+1], arr[high]);
    return i + 1;
}
void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi-1);
        quickSort(arr, pi+1, high);
    }
}`,

    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}
function partition(arr, low, high) {
  const pivot = arr[high]; let i = low - 1;
  for (let j = low; j < high; j++)
    if (arr[j] <= pivot) [arr[++i], arr[j]] = [arr[j], arr[i]];
  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  return i + 1;
}`,

    golang: `func quickSort(arr []int, low, high int) {
    if low < high {
        pi := partition(arr, low, high)
        quickSort(arr, low, pi-1)
        quickSort(arr, pi+1, high)
    }
}
func partition(arr []int, low, high int) int {
    pivot, i := arr[high], low-1
    for j := low; j < high; j++ {
        if arr[j] <= pivot { i++; arr[i], arr[j] = arr[j], arr[i] }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}`,
  },
};

// ── Stack ──────────────────────────────────────────────────────────────────
export const STACK_INFO: AlgoInfo = {
  name: 'Stack',
  category: 'Data Structure',
  complexity: { time: 'O(1) push/pop', space: 'O(n)' },
  description:
    'A stack is a Last-In-First-Out (LIFO) data structure. Elements are added and removed from the same end (the top). Think of a stack of plates.',
  steps: [
    'Push: add an element to the top.',
    'Pop: remove the top element.',
    'Peek: view the top element without removing it.',
    'isEmpty: check if the stack has no elements.',
    'All operations run in O(1) time.',
  ],
  implementations: {
    python: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, val): self._data.append(val)
    def pop(self): return self._data.pop()
    def peek(self): return self._data[-1]
    def is_empty(self): return len(self._data) == 0`,

    java: `import java.util.ArrayDeque;

class Stack<T> {
    private final ArrayDeque<T> data = new ArrayDeque<>();
    public void push(T val) { data.push(val); }
    public T pop()  { return data.pop(); }
    public T peek() { return data.peek(); }
    public boolean isEmpty() { return data.isEmpty(); }
}`,

    cpp: `#include <stack>
using namespace std;

stack<int> s;
s.push(10);
int top = s.top(); // peek
s.pop();
bool empty = s.empty();`,

    javascript: `class Stack {
  #data = [];
  push(val) { this.#data.push(val); }
  pop()  { return this.#data.pop(); }
  peek() { return this.#data.at(-1); }
  isEmpty() { return this.#data.length === 0; }
}`,

    golang: `type Stack[T any] struct { data []T }

func (s *Stack[T]) Push(v T) { s.data = append(s.data, v) }
func (s *Stack[T]) Pop() T   { n := len(s.data)-1; v := s.data[n]; s.data = s.data[:n]; return v }
func (s *Stack[T]) Peek() T  { return s.data[len(s.data)-1] }
func (s *Stack[T]) IsEmpty() bool { return len(s.data) == 0 }`,
  },
};

// ── Queue ──────────────────────────────────────────────────────────────────
export const QUEUE_INFO: AlgoInfo = {
  name: 'Queue',
  category: 'Data Structure',
  complexity: { time: 'O(1) enqueue/dequeue', space: 'O(n)' },
  description:
    'A queue is a First-In-First-Out (FIFO) data structure. Elements are added to the back (enqueue) and removed from the front (dequeue). Think of a line of people.',
  steps: [
    'Enqueue: add an element to the back.',
    'Dequeue: remove the front element.',
    'Front: view the front element without removing it.',
    'isEmpty: check if the queue has no elements.',
    'All operations run in O(1) with a deque or linked list.',
  ],
  implementations: {
    python: `from collections import deque

class Queue:
    def __init__(self): self._data = deque()
    def enqueue(self, val): self._data.append(val)
    def dequeue(self): return self._data.popleft()
    def front(self): return self._data[0]
    def is_empty(self): return len(self._data) == 0`,

    java: `import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> q = new LinkedList<>();
q.offer(10);   // enqueue
int front = q.peek();
q.poll();      // dequeue`,

    cpp: `#include <queue>
using namespace std;

queue<int> q;
q.push(10);      // enqueue
int front = q.front();
q.pop();         // dequeue
bool empty = q.empty();`,

    javascript: `class Queue {
  #data = [];
  enqueue(val) { this.#data.push(val); }
  dequeue() { return this.#data.shift(); }
  front() { return this.#data[0]; }
  isEmpty() { return this.#data.length === 0; }
}`,

    golang: `type Queue[T any] struct { data []T }

func (q *Queue[T]) Enqueue(v T) { q.data = append(q.data, v) }
func (q *Queue[T]) Dequeue() T  { v := q.data[0]; q.data = q.data[1:]; return v }
func (q *Queue[T]) Front() T    { return q.data[0] }
func (q *Queue[T]) IsEmpty() bool { return len(q.data) == 0 }`,
  },
};

// ── Map: page algo key → AlgoInfo ─────────────────────────────────────────
// Sort page
export const SORT_ALGO_INFO: Record<string, AlgoInfo> = {
  bubble: BUBBLE_SORT_INFO,
  selection: SELECTION_SORT_INFO,
  insertion: INSERTION_SORT_INFO,
  merge: MERGE_SORT_INFO,
  quick: QUICK_SORT_INFO,
};

// Search page
export const SEARCH_ALGO_INFO: Record<string, AlgoInfo> = {
  linear: LINEAR_SEARCH_INFO,
  binary: BINARY_SEARCH_INFO,
};
