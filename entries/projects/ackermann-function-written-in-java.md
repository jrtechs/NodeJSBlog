\`\`\`

class Ackermann_function

 {

    public static void main(String[] args)

    {

        //prints intro

        System.out.println("This program will solve for all values in ackermann
function using recursion.1");

        System.out.println("\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*n");

        //calls for all values of ackerman using for loop

 

        for(int i = 0; i \< 6; i ++)

        {

            for(int j = 0; j \< 10; j ++)

            {

                System.out.println("Ackerman (" + i + "," + j + ") is: " +
ack(i,j));

            }

 

        }

        //test sinlge

        //System.out.println(ack(3,1));

    }

    public static int ack(int m, int n)

    {

        if(m == 0)

        {

            return(n + 1);

        }

        else if(m \> 0 && n == 0)

        {

            return(ack(m-1,1));

        }

        else if(m\>0 && n \> 0);

        {

            return(ack(m-1, ack(m,n-1)));

        }

    }

 

 }

\`\`\`

The Ackermann function is a classic example of a function that is not primitive
recursive – you cannot solve it using loops like Fibonacci. In other words, you
have to use recursion to solve for values of the Ackermann function.

For more information on the Ackermann function [click
here](https://en.wikipedia.org/wiki/Ackermann_function).
