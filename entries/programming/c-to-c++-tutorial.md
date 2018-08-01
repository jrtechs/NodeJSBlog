This post aims to cover all the major topics that C programmers need to know before
they start writing C++ programs. I kept this post as short and concise as possible to 
enable people to use this as a quick reference to jump into C++. This post assumes
that you have prior knowledge of both C and object oriented programming concepts. 

## Input/Output

Input and output in C++ is pretty easy, you just use "cout" and "cin". When printing with
"cout", you separate what your printing with "<<", the "endl" at the end prints a new line.

```c++
using namespace std;                        //namespaces talked about below
#include <iostream>                         //Include statement for terminal IO.

int main()
{
    cout << "Hello World" << endl;          // HELLO WORLD!
    
    int a;
    cin << a;                               //inputs an int into a
    
    cout << "You entered: << a << endl;     //prints what you entered
    
    return 0;                               // return sucess code
}
```


If you wish to run a C++ program simply save it with the extension ".cpp", you then
can compile and run it with g++. Compiling a C++ program with g++ is nearly the same
as compiling a C program with gcc.

ex:

```bash
g++ helloWorld.cpp -o hello
./hello
```


## Namespaces

Name spaces are used to enable you to have multiple functions/methods called the
same thing and not conflict with one another. You use "namespacename::function/variable"
to access something inside of a namespace. To prevent you from always having to type 
"namespacename::", you can use a namespace which makes that namespace "default".

```c++
using namespace std;                //tells compiler we want to use std namespace

namespace foo                       //declares a namespece named foo
{
    int a, b;
    
    void fun()
    {
        cout << "Inside foo namespace" << endl;
    }
}


namespace bar               
{
    void fun()                      //declares a function with the same name as another function
    {
        cout << "Inside bar namespace" << endl;
    }
}


using namespace foo;                //start useing foo instead of std as selected namespace
int main()
{
    fun();
    
    bar::fun();
    
    int a = 5;
    
    foo::a = 12;
    
    std::cout << "a: " << a << endl;    //had to use std::cout since the default namespace is foo
    std::cout << "foo::a: " << foo::a << endl;
    
    return 0;
}
```


## Global Variable

Similar to C, however, you can now reference a global variable with the "::"
accessor.

```c++
using namespace std;
#include <iostream>

double bar = 64;

int main ()
{
   double bar = 12;

   cout << "Local bar:  " << bar << endl;       //prints 12
   cout << "Global bar: " << ::bar << endl;     //prints 64

   return 0;
}
```

## Multiple Names for a Variable/Aliasing

This is simply NOT a pointer. In the following example pi, and x now are treated as
the same exact variable. You cannot later change the pointer destination for x.


```c++
double pi = 3.145;
double &x = pi;  //pi is x

x = 2.1;

cout << "pi: " << pi << " x: " << x << endl; // prints pi: 2.1 x: 2.1
```


## Passing Variables by Reference

In C, everything was passed by value -- only way to get around this was by passing
pointers. C++ now allows us to pass variables by reference. This is very powerful, in
languages like Java, only Objects are passed by reference. C++ lets you decide exactly
what gets passed by reference or by value. 

```c++
void change (double &r, double s)       //r is passed by reference
{
   r = 100;
   s = 200;
}

int main()
{
    int x = 1;
    int y = 2;
    cout << x << ", " << y << endl;
    change(x, y);
    cout << x << ", " << y << endl;
    
    return 0;
}
```

Same code in C. This method still works in C++.

```c
void change(double *r, double s)
{
    *r = 100;
    s = 200;
}

int main()
{
    int x = 1;
    int y = 2;
    printf("%d, %d", x, y);         //printf doesn't exist in c++.
    change(&x, y);
    printf("%d, %d", x, y);
    
    return 0;
}
```


## Functions Returning Variables not Values

A function can return a variable -- not a value. In the following example, a function
returns the reference to the variable which is the smallest.

```c++
using namespace std;
#include <iostream>

int &smallest (int &x, int &y)          //smallest returns a reference to a variable
{
    if (x < y) 
        return x;
    else
        return y;
}

int main ()
{
    int k = 33;
    int m = 2;
    
    cout << "k: " << k << " m: " << m << endl; // prints k: 33 m: 2
    
    smallest (k, m) = 10;                      // MAGIC!
    
    cout << "k: " << k << " m: " << m << endl; // prints k: 33 m: 10
    
    return 0;
}
```


## Inline -- similar to Macros

Inline can be used to replace a function which contains very simple logic -- no
for loops, etc. Like a macro, this will be inserted everywhere the code is used; a
draw back to inline methods is that the compiled source will be larger. But, they
typically run faster.

```c++
inline int square(int x)
{
    return x * y;
}

int main()
{
    int k = 4;
    
    cout << square(k) << endl; //prints 4
    
    return 0;
}
```

## Exceptions

Exceptions might help you stop segmentation faulting. The important thing to notice 
is that you can throw just about any type in a try block.

```c++
int x;
cout << "Type a number: ";
cin >> x;
cout << endl;

try
{
    if(a > 150)
        throw 150;
    if(a < 15)
        throw 15;
    throw a % 2;
}
catch(int result)
{
    cout << result << " was thrown." << endl;
}
```


## Default Parameters for Functions

This is exactly like default parameters in Python. If a function is called without
the parameter, it is assumed to be that value.

```c++
double multiply(double x, double y = 5)
{
    return x * y;
}

int main()
{
    cout << multiply(4) << endl; // 20
    cout << multiply(4, 4) endl; // 15
    
    return 0;
}
```


## Function Overloading



```c++
double add(double x)
{
    return x + x;
}

double add(double x, double y)
{
    return x + y;
}

int add(int x, int y)
{
    return x + y;
}

int main()
{
    cout << multiply(4) << endl; // 20
    cout << multiply(4, 4) endl; // 15
    
    return 0;
}
```


## Operator Overloading

```c++
using namespace std;
#include <iostream>

struct tuple
{
   int x;
   int y;
};

tuple operator + (int a, vector b)
{
   vector r;

   r.x = a + b.x;
   r.y = a + b.y;

   return r;
}

int main ()
{
   tuple k, m;              // No need to type "struct tuple"
                            // also no need to typedef
   k.x = 3;
   k.y = 6;

   m = 2 + k;               // Voodoo witchcraft

   cout << "(" << m.x << ", " << m.y << ")" << endl;

   return 0;
}
```

## Functions with Generic Parameter Types

```c++
template <class ttype>
ttype max (ttype a, ttype b)
{
   ttype r;

   r = a;
   if (b < a) r = b;

   return r;
}



template <class type1, class type2>
type1 maximum (type1 a, type2 b)
{
    type1 r, b_converted;
    r = a;
    b_converted = (type1) b;
    if (b_converted > a) 
        r = b_converted;
    return r;
}
```


## Replacement for malloc and free

```c++
int i*;
i = new int;
*i = 55;
delete i;

i = new int[15];
i[0] = 99;
delete i;
```


## Struct Functions

```c++
struct tuple
{
    int i;
    int x;

    int sum()
    {
        return i + x;
    }
};
```


# Classes


```c++
class Tuple
{
public:
    int i;
    int x;

    int sum()
    {
        return i + x;
    }
};
```

## Class Constructor and De-constructor

```c++
class Tuple
{
public:
    int i;
    int x;
    
    Tuple(int i1, int i2)
    {
        i = i1;
        x = i2;
    }
    
    ~Tuple()
    {
        //delete any memory you have!
    }

    int sum()
    {
        return i + x;
    }
};


// in main


Tuple t (12, 14);

Tuple tt = new Tuple(12, 15);
```

## Scope

```c++
class Person
{
protected:
    int age;
    string name;    
    
public:
    Person(int age, string name)
    {
    }
    
    ~Person()
    {
    }
    
private:
    void increaseAge()
    {
        age++;
    }
}
```

## This keyword
```c++
class Person
{
protected:
    int age;
    string name;    
    
public:
    Person(int age, string name)
    {
        this->age = age;
        strcpy(this->name, name);
    }
    
    ~Person()
    {
    }
    
private:
    void increaseAge()
    {
        age++;
    }
}
```


## Class Inheritance

```c++
class Tuple
{
protected:
    int x;
    int y;
    
public:
    Tuple(int i1, int i2)
    {
        x = i1;
        y = i2;
    }

    virtual int sum()
    {
        return i + x;
    }
};

class Triple: public Tuple
{
protected:
    int x;
    int y;
    int z;
    
public:
    Triple(int i1, int i2, i3): Tuple(i1, i2)
    {
        z = i3;
    }

    int sum()
    {
        return x + y + z;
    }
};
```

## "Abstract" Classes

```c++
class Animal
{
public:
    virtual void speak()=0;
}


class Cat: public Animal
{
public:
    void speak()
    {
        cout << "Meow" << endl;
    } 
};
```

## Method Prototypes for Classes

```c++
class Cat: public Animal
{
public:
    void speak()
    {
        cout << "Meow" << endl;
    }
    
    int fly(); //method prototype 
};


// Off in a header file or something
int Cat::fly()
{
    return 42;
}
```

# File IO

## Reading From File

```c++
#include <fstream>


//in main or somewhere
fstream f;
char c;
f.open("p022_names.txt", ios::in);


while(!f.eof())
{
    f.get(c);
    cout << c;
}
f.close();
```

## Writing to File

```c++
#include <fstream>


//in main or somewhere
fstream f;
char c;
f.open("p022_names.txt", ios::out);

f << "stuff in the file " << endl;

int i = 4;

f << i << " this is also in the text file" << endl;

f.close();
```