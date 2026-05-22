// ── Algorithm Info Registry ─────────────────────────────────────────────────
// Provides the sidebar with explanation text + per-language code snippets.
// Code implementations live in ./algo/* and are imported here.

import { linearSearchImpl } from './algo/linearSearch';
import { binarySearchImpl } from './algo/binarySearch';
import { bubbleSortImpl } from './algo/bubbleSort';
import { selectionSortImpl } from './algo/selectionSort';
import { insertionSortImpl } from './algo/insertionSort';
import { mergeSortImpl } from './algo/mergeSort';
import { quickSortImpl } from './algo/quickSort';
import { stackImpl } from './algo/stack';
import { queueImpl } from './algo/queue';

// ── Types ───────────────────────────────────────────────────────────────────

export interface AlgoImplementations {
  python: string;
  java: string;
  cpp: string;
  javascript: string;
  golang: string;
}

export interface AlgoInfo {
  name: string;
  category: string;
  complexity: { time: string; space: string };
  description: string;
  steps: string[];
  implementations: AlgoImplementations;
}

// ── Linear Search ───────────────────────────────────────────────────────────
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
  implementations: linearSearchImpl,
};

// ── Binary Search ───────────────────────────────────────────────────────────
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
  implementations: binarySearchImpl,
};

// ── Bubble Sort ─────────────────────────────────────────────────────────────
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
  implementations: bubbleSortImpl,
};

// ── Selection Sort ──────────────────────────────────────────────────────────
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
  implementations: selectionSortImpl,
};

// ── Insertion Sort ──────────────────────────────────────────────────────────
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
  implementations: insertionSortImpl,
};

// ── Merge Sort ──────────────────────────────────────────────────────────────
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
  implementations: mergeSortImpl,
};

// ── Quick Sort ──────────────────────────────────────────────────────────────
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
  implementations: quickSortImpl,
};

// ── Stack ────────────────────────────────────────────────────────────────────
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
  implementations: stackImpl,
};

// ── Queue ────────────────────────────────────────────────────────────────────
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
  implementations: queueImpl,
};

// ── Lookup Maps (page key → AlgoInfo) ────────────────────────────────────────

/** Sort page: algo key → info */
export const SORT_ALGO_INFO: Record<string, AlgoInfo> = {
  bubble: BUBBLE_SORT_INFO,
  selection: SELECTION_SORT_INFO,
  insertion: INSERTION_SORT_INFO,
  merge: MERGE_SORT_INFO,
  quick: QUICK_SORT_INFO,
};

/** Search page: algo key → info */
export const SEARCH_ALGO_INFO: Record<string, AlgoInfo> = {
  linear: LINEAR_SEARCH_INFO,
  binary: BINARY_SEARCH_INFO,
};
