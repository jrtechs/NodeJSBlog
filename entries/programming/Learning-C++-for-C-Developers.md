## Namespaces


## Input/Output



## Global Variable

```c++
using namespace std;
#include <iostream>

double a = 128;

int main ()
{
   double a = 256;

   cout << "Local a:  " << a   << endl;
   cout << "Global a: " << ::a << endl;

   return 0;
}
```

## Multiple Names for a Variable


## Passing Variables by Reference


```c++
void change (double &r, double s)
{
   r = 100;
   s = 200;
}
```


## Functions Returning Variables not Values


## Static Variables


## Namespaces

```c++
namespace foo
{
    int a, b;
}


//in main
first::a = 2;
```


## Inline -- similar to Macros


## Exceptions


## Default Parameters for Functions


## Function Overloading


## Operator Overloading


## Functions with Generic Parameter Types


## Replacement for malloc and free


## Struct Functions

# Classes

## Class Constructor and De-constructor

## Scope

## Method Prototypes for Classes

## This keyword

## Class Inheritance

## "Abstract" Classes

# File IO

## Writing to File

## Reading From File