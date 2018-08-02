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
    cin >> a;                               //inputs an int into a
    
    cout << "You entered: " << a << endl;   //prints what you entered
    
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

#include <iostream>    

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
using namespace std;
#include <iostream>

void change (int &r, int s)       //r is passed by reference
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
using namespace std;
#include <iostream>

inline int square(int x)        //macro like method
{
    return x * x;
}

int main()
{
    int k = 4;
    
    cout << square(k) << endl;  //prints 16
    
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
    cout << multiply(4, 4) endl; // 16
    
    return 0;
}
```


## Function Overloading

Like Java and Python, you can overload methods in C++. Not only can you overload the
methods, but, the return type of the methods which are overloaded don't have to match.


```c++
double add(double x)
{
    return x;
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
    cout << add(4) << endl; // 4
    cout << add(4.0, 4.0) << endl; // 8
    return 0;
}
```


## Operator Overloading

You can redefine basic operators like (+,/,-,<<,>>, +=) for certain data types by using
operator overloading. 

```c++
using namespace std;
#include <iostream>

struct tuple                //since tuple is defined elsewhere, we need to use :: to access it
{
   int x;
   int y;
};

::tuple operator + (int a, ::tuple b)
{
   ::tuple r;               //creates the tuple from our file -- tuple is defined elsewhere

   r.x = a + b.x;
   r.y = a + b.y;

   return r;
}


::tuple operator * (int a, ::tuple b)
{
   ::tuple r;               //creates the tuple from our file -- tuple is defined elsewhere

   r.x = a * b.x;
   r.y = a * b.y;

   return r;
}

int main ()
{
   ::tuple k, m;             // No need to type "struct vector"

   k.x =  2;                 // To be able to write
   k.y = -1;                 // k = vector (2, -1)
                             // see chapter 19.

   m = 3 +  k;               // Magic!

   cout << "(" << m.x << ", " << m.y << ")" << endl;

   return 0;
}
```

## Functions with Generic Parameter Types

In C++ you can use a template class to create a method which has generic
 return and parameter types.

```c++
template <class ttype>                  //function with 1 generic type
ttype max (ttype a, ttype b)
{
    ttype r;
    
    r = a;
    if (b < a) 
        r = b;
    
    return r;
}



template <class type1, class type2>     //function with 2 generic types
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

Malloc and free still exists in C++, however, people typically
use "new" and "delete" instead because it is cleaner.

```c++
int *i = new int;        //i = malloc(sizeof(int)); //c code
*i = 55;
delete i;                //free(i); // c code

i = new int[15];
i[0] = 99;
delete i;
```


## Struct Functions

You can now add functions to structs.

```c++
struct pair
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

The syntax of a class is similar to a struct.

```c++
class Pair
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

Class constructors are similar to constructors in java. Class de-constructors
are simply the name of the class with a "~" sign in front of it. It is important to
free any allocated memory in the class deconstruct. 

```c++
class Pair
{
public:
    int i;
    int x;
    
    Pair(int i1, int i2)               //constructor
    {
        i = i1;
        x = i2;
    }
    
    ~Pair()                            //class deconstructor
    {
        //delete any memory you have!
    }

    int sum()
    {
        return i + x;
    }
};


// in main or somewhere
Pair t (12, 14);                   //creates a tuple on the stack

Pair* tt = new Pair(12, 15);      //allocates memory for the tuple on the heap

cout << t.sum() << endl;            //prints 26
cout << tt->sum() << endl;          //prints 27
```

## Encapsulation

Like Java, you can declare who can view access certain members of a class.

- protected: Only members of the class and children can view the variables/methods.
- public: Everyone has access to the variables/methods.
- private: Only this class can access the variables/methods.

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
};
```

## This keyword

When you use the "this" key word, you are getting the pointer to the class that you are
in.

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
        this->name = name;
    }
    
    ~Person()
    {
    }
    
private:
    void increaseAge()
    {
        age++;
    }
};
```


## Class Inheritance

Classes can inherit variables and methods from other classes. The major thing to
remember is that if you ever want to override a method in a child class, you have
to declare the method as "virtual".

```c++
class Pair
{
protected:
    int x;
    int y;
    
public:
    Pair(int i1, int i2)
    {
        x = i1;
        y = i2;
    }

    virtual int sum()
    {
        return x + x;
    }
};

class Triple: public Pair
{
protected:
    int z;
    
public:
    Triple(int i1, int i2, int i3): Pair(i1, i2)  //calls the parent classes constructor
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

Abstract classes are simply classes which can not be instantiated. To do this in C++
you simply set a virtual function equal to zero.

```c++
class Animal
{
public:
    virtual void speak()=0;
};


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

If you wish to have a method prototype in a class, you have to use namespace
syntax to define it elsewhere. This is particularly useful for breaking a class
into multiple files. It is common to declare the class in a header file and then 
implement the functions in a cpp file.

```c++
class Animal
{
public:
    virtual void speak()=0;
};

class Cat: public Animal
{
public:
    void speak()
    {
        cout << "Meow" << endl;
    }
    
    int fly();          //method prototype
};


int Cat::fly()
{
    return 42;
}
```

## Strings

Since C++ has classes, it can now work with strings in a more pleasant way. 

```c++
using namespace std;

#include <iostream>

int main()
{
    string str1 = "Hello";          // string "Hello"
    string str2("World");           // string "World"
    string str1Copy(str1);          // string "Hello" 
    
    
    //initalizes string by a character and number of occurances 
    string str4(5, '$');            // string "$$$$$$"
    
    //string contatination
    string greeting = str1 + " " + str2;
    cout << greeting << endl;
    
    //length of a string
    int len = str1.size();
    cout << "str1.size(): " << len << endl;
    
    //clear all characters from a string
    greeting.clear();
    cout <<"Greeting: "<< greeting << endl;
    
    
    string numbers = "0123456789";
    
    //returns first character in string
    char first = numbers.front();
    
    //returns last character in string
    char back = numbers.back();
    
    //gets character at a certain position
    char second = numbers.at(1);
    char secondAlt = numbers[1];
    
    cout << "first: " << first << endl;
    cout << "back: " << back << endl;
    cout << "second: " << second << endl;
    
    
    //substr(a, b) function returns a substring of b length
    //starting from index a. if there is no second argument, it 
    //goes to the end.
    cout << numbers.substr(2, 7) << endl;
    

    //replace(a, b, str)  replaces b character from a index by str
    string str6 = "This is a examples";
    str6.replace(2, 7, "ese are test");
    cout << str6 << endl;
    
    return 0;
}
```


# File IO

File IO is significantly different in C++. I will quickly glance over
a few examples which should give you most of what you need to start writing some programs.

## Reading From File

Reading a file example by character.

```c++
using namespace std;

#include <iostream>
#include <fstream>      // Header for files

int main()
{
    fstream f;
    char c;
    f.open("p022_names.txt", ios::in);
    
    while(!f.eof())
    {
        f.get(c);
        cout << c;
    }
    f.close();
}
```

Reading lines from a file using strings.

```c++
using namespace std;

#include <iostream>
#include <fstream>
#include <string>

int main () 
{
    string line;
    ifstream myfile ("example.txt");
    if(myfile.is_open())                //checks to see if file open sucessfully
    {
        while(getline(myfile,line))     //gets contents of file and puts them in a string
        {
            cout << line << '\n';
        }
        myfile.close();
    }
    else
    {
        cout << "Unable to open file"; 
    }
    
    return 0;
}
```

## Writing to File

Writing to a file example.

```c++
using namespace std;

#include <iostream>
#include <fstream>      // Header for files

int main()
{
    fstream f;
    char c;
    f.open("p022_names.txt", ios::out);
    
    f << "stuff in the file " << endl;
    
    int i = 4;
    
    f << i << " this is also in the text file" << endl;
    
    f.close();
}
```

## Resources

You should now know enough C++ to start developing with it. If you want to take your C++
skills to the next level, I would recommend start working on a few projects in C++ and get
a comprehensive C++ book.

- [Online C++ Guide](https://www.programiz.com/cpp-programming)
- Kochan: Programming in C _p4 (4th Edition) (Developer's Library) 4th Edition -- Really good book if you don't know C that good.
- [Tutorials Point C++](https://www.tutorialspoint.com/cplusplus/index.htm)
