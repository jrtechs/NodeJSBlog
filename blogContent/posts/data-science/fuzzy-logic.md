All applications of Fuzzy logic rely on the notion of
linguistic variables. These are variables whose values are words rather than 
cold hard numbers. Something like "it is nice outside" is an examples of a linguistic 
variable. These are values which map to conceptual property rather than numerical numbers.
When I say that it is nice
outside, that is subjective to my opinion; other people may have different opinions
on what is considered nice outside. That is why this field is called fuzzy logic: each
fuzzy set carries some tolerance for imprecision. This tolerance for ambiguity helps us model 
the world in a more versatile way because it allows us to language for computation. 

With words we can quickly convey ideas like "hot" and "cold" and take actions.
Since there is no definitive answer on what is the
cut of for being hot/cold, we can use fuzzy logic to model the ambiguity and deal with partial truth values.
For example, it is possible to be 60% cold and 20% hot in a fuzzy logic system. If it is hot, we want to 
turn up the fans, if it is cold we want to turn off the fan. Knowing the partial truth values we may decide
to turn the fans on at 10%.

The remainder of this blog post will dive into the details of each component of a fuzzy logic system.

# Fuzzy Sets

Classical sets are mutually exclusive. In other words: things can only belong
to one set at a time.
In a fuzzy set, elements can belong to multiple sets with some degree of membership.
As an example, someone who is 30 may be 33% in the young set and 66% in the old set.
Fuzzy sets are usually are represented by trapezoids; however, other shapes such as gaussian can
be used.

## Temperature Example
    
# Fuzzy Rules


# De-fuzzification


# Fuzzy Logic System

-------lucid chart diagram of fuzzifier, rule, deffizifier



# Example

--javascript code?