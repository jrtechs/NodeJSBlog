In this post I will go over how you can frame a question in terms of recursion and then slowly massage the question into a dynamic programming question.

# Problem Description

The knapsack problem is a famous optimization problem in computer science.
Given a set of items, a thief has to determine which items he should steal to maximize his total profits.
The thief knows the maximum capacity of his knapsack and the weights and values of all the items.

The fractional knapsack problem is where a thief can steal fractions of the items instead of being mandated to take the whole item.
This problem can be solved really easily using a greedy algorithm where the thief just steals the most valuable dense objects first.
The 0-1 knapsack problem is where the thief can't steal fractions of items.
By nature this object is more difficult since it requires more computations.
A naive brute force algorithm would take exponential time, but, dynamic programming can slash the complexity.

# Recursive Formula

The initial recursive way of defining the problem will look something like this:

$$
k([], W) = 0\\
k((v,w)::items, W) =
  \begin{cases}
   k(items, W) & \text{if } w > W\\
   max(k(items, W), k(items, W- w) + v) & otherwise\\
  \end{cases}
$$

In this example the knapsack problem takes in two parameters, a list of items and a max capacity of the knapsack.
We have three cases in this formulation. If the knapsack is empty, the max value we can steal is 0.
If the weight of the item at the start of the list is greater than the capacity of the knapsack, we can't steal it.
The final case is were we decide whether it would be better to take the item or not.

It is often nice to work with lists when theoretically formulating a recursive definition.
However, it is better to have arrays when actually coding the problem.

$$
k(a, W) =
  \begin{cases}
   0 & \text{if } |a| = 0\\
   k(a[1:], W) & \text{if } a[0].w > W\\
   max(k(a[1:], W), k(a[1:], W- a[0].w) + a[0].v) & otherwise\\
  \end{cases}
$$

In this formulation we converted the list into a array. The array is filled with objects which has a "v" value and "w" weight property.
The [1:] syntax represents array slicing where you take everything after the first element.
Slicing is nice theoretically, but, in practice they are slow.
To stop using slicing we will have to introduce a slicing index to our formulation.
This will make all of our array operations constant time and prevent our memory from growing exponentially under recursive calls.

$$
k'(a, W) =
  \begin{cases}
   0 & \text{if } i = |a|\\
   k'(a, W, i+1) & \text{if } a[i].w > W\\
   max(k'(a, W, i+1), k'(a, W- a[i].w, i+1) + a[i].v) & otherwise\\
  \end{cases}
$$

# Dynamic Programming Formulation

Now that we have a recursive definition which has overlapping sub problems, we can convert it to imperative pseudo code which uses dynamic programming.
Think of the two-dimensional array as a way to store the results of the recursive calls bottom up.
This will prevent us from having an exponential number of computations.

````Python
def knapsack(a, W):
    n = |a|
    k = array(0...W, 0... n)

    for w = 0 to W:  # base case i = n
        k[w, n] = 0

    for i = n-1 down to 0:
        for w = 0 to W:
            if a[i].w > W: # unable to take current item
                k[w, i] = k[w, i+1]
            else: #decides whether to include item
                k[w, i] = max(k[w,i+1], k[w-a[i].w, i+1] + a[i].v)
    return k[W, 0]
````

We can now easily implement the pseudo code in python.
Instead of just returning the maximum value which our thief can steal, we can return a list of objects which the thief actually stole.

````Python
def knapsack(V, W, capacity):
    """
    Dynamic programming implementation of the knapsack problem

    :param V: List of the values
    :param W: List of weights
    :param capacity: max capacity of knapsack
    :return: List of tuples of objects stolen in form (w, v)
    """
    choices = [[[] for i in range(capacity + 1)] for j in range(len(V) + 1)]
    cost = [[0 for i in range(capacity + 1)] for j in range(len(V) + 1)]

    for i in range(0, len(V)):
        for j in range(0, capacity + 1):
            if W[i] > j:  # don't include another item
                cost[i][j] = cost[i -1][j]
                choices[i][j] = choices[i - 1][j]
            else:  # Adding another item
                cost[i][j] = max(cost[i-1][j], cost[i-1][j - W[i]] + V[i])
                if cost[i][j] != cost[i-1][j]:
                    choices[i][j] = choices[i - 1][j - W[i]] + [(W[i], V[i])]
                else:
                    choices[i][j] = choices[i - 1][j]
    return choices[len(V) -1][capacity]


def printSolution(S):
    """
    Takes the output of the knapsack function and prints it in a
    pretty format.

    :param S: list of tuples representing items stolen
    :return: None
    """
    print("Thief Took:")
    for i in S:
        print("Weight: " + str(i[0]) + "\tValue: \t" + str(i[1]))

    print()
    print("Total Value Stolen: " + str(sum(int(v[0]) for v in S)))
    print("Total Weight in knapsack: " + str(sum(int(v[1]) for v in S)))


values =  [1,1,1,1,1,1]
weights = [1,2,3,4,5,1]
printSolution(knapsack(values, weights, 5))
````

# Time Complexity

Since we simply calculate each value in our two dimensional array, the complexity is 0(n*W).
The W is the max capacity of the knapsack and the n is the number of objects you have.

The interesting caveat with this problem is that it is NP-Complete.
Notice that we have a solution which runs in "polynomial" time.
NP hard problems currently don't have any known polynomial solutions for them.
In our case here, we simply have a pseudo polynomial solution -- size required to solve solution grows exponentially with respect to input.
Since it has this pseudo polynomial solution, the knapsack is [weak NP-complete](https://en.wikipedia.org/wiki/Weak_NP-completeness).