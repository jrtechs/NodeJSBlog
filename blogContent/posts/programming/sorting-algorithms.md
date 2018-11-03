
# Insertion Sort


# Heap Sort


# Merge Sort


#Quick Sort


## Memory Greedy Solution

```
def quickSortNormal(data):
    """
    This is the traditional implementation of quick sort
    where there are two recursive calls.
    """
    if len(data) == 0:
        return []
    else:
        less, equal, greater = partition(data)
        return quickSortNormal(less) + equal + quickSortNormal(greater)
```


## Accumulation Solution

```
def quick_sort_accumulation(data, a):
    """
    Implementation of quickSort which forces tail recursion
    by wrapping the second recursive in the tail positioned
    recursive call and added an accumulation variable.
    """
    if len(data) == 0:
        return a
    less, equal, greater = partition(data)
    return quick_sort_accumulation(less,
                equal + quick_sort_accumulation(greater, a))


def quicksort(data):
    """
    Wrapper function for quick sort accumulation.
    """
    return quick_sort_accumulation(data, [])
```


## In-Place Sorting Implementation

```
def iterative_partition(data, left, right):
    """
    Function which partitions the data into two segments,
    the left which is less than the pivot and the right
    which is greater than the pivot. The pivot for this
    algo is the right most index. This function returns
    the ending index of the pivot.

    :param data: array to be sorted
    :param left: left most portion of array to look at
    :param right: right most portion of the array to look at
    """
    x = data[right]
    i = left - 1
    j = left
    while j < right:
        if data[j] <= x:
            i = i + 1
            data[i], data[j] = data[j], data[i]
        j = j+1
    data[i + 1], data[right] = data[right], data[i + 1]
    return i + 1


def iterative_quick_sort(data):
    """
    In place implementation of quick sort

    Wrapper function for iterative_quick_sort_helper which
    initializes, left, right to be the extrema of the array.
    """
    iterative_quick_sort_helper(data, 0, len(data) -1)
    return data


def iterative_quick_sort_helper(data, left, right):
    """
    Uses the divide and conquer algo to sort an array

    :param data: array of data
    :param left: left index bound for sorting
    :param right: right bound for sorting
    """
    if left < right:
        pivot = iterative_partition(data, left, right)
        iterative_quick_sort_helper(data, left, pivot -1)
        iterative_quick_sort_helper(data, pivot+1, right)
```