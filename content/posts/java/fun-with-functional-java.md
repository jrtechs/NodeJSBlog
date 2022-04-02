It's time I tell you all my un-popular opinion: Java is a fun language.
Many people regard Java as a dingy old language with vanilla syntax.
Please don't fret; I am here to share the forbidden knowledge and lure you into the rabbit hole that is functional programming esque syntax in Java. And yes, this goes way beyond merely having lambda statements.

![java meme](media/java.png)

# Ways to create a list

The plain old way of making a list would look something like this:

```java
List<Integer> myList = new ArrayList<Integer>();
myList.add(1);
myList.add(2);
myList.add(3);
```

Using double brace syntax, you can simplify initialization.
Everything within the double brace gets executed right after the constructor is called.
Java does this by creating an anonymous inner class.
From within this anonymous inner class, you can access any methods private to that class; additionally, since you are still within the scope of the object you are writing the code in, you have access to those methods as well.
Double braces are a slick way to initialize objects, but many people won't recognize it because it is more obscure.

```java
new ArrayList<Integer>()
{{
    add(1); add(2); add(3);
}};
```

Using the streams class, you can create a sequence of objects, and then do a collection on that stream. 

```java
Stream.of(1,2,3).collect(Collectors.toList());
```

Similar to the prior method, we can create an Instream instead.
Note: calling the boxed() method on an Instream will turn it into a Stream<Integer>.

```java
IntStream.range(1, 4).boxed().collect(Collectors.toList())
```

If you are hip to all the new methods in java 1.9 and beyond, you can use the List.of() method. However, I avoid this method because Java 1.8 is still the defacto for compatibility at the moment.

```java
List.of(1,2,3)
```

# Map

For the next few examples, we will be trying to access the integer values in a map object.

```java
Map<String, Integer> datas = new HashMap<String, Integer>()
{{
    put("one", 1);
    put("two", 2);
    put("three", 3);
}};
```

We will recreate"Map.values()-- a function that returns all the values in the map as a list.

When we call stream on a map in Java, it will create a stream for the keys -- not the values.
The map function is an essential concept in a functional language.
In our example, we are using it to take each key, and then fetch the integer values mapped to it.
The result of the map function is a Stream<Integer>, which we then aggregate in a list using the collect() function.

```java
datas.keySet().stream().map(k -> datas.get(k))
        .collect(Collectors.toList());
```

The prior lambda can get simplified to "datas::get" since the value that we are streaming over is getting passed directly to the method getting called.

```java
datas.keySet().stream().map(datas::get)
        .collect(Collectors.toList())
```

Simply mapping to another value may not appear exciting, but it gives us extreme power when creating streams that process data. This example creates a new list where each value is the values in the prior list multiplied by 3. 

```java
datas.keySet().stream().map(k -> datas.get(k) * 3)
        .collect(Collectors.toList())
```

# More about loops

A basic list traversal in Java looks something like this.

```java
List<String> list = new ArrayList<String>()
{{
    add("Biz"); add("Bar"); add("Foo");
}};

for(String s: list)
{
    System.out.println(s);
}
```

Using our functional forEach method, traversing a list becomes a single-liner.

```java
list.forEach(s-> System.out.println(s));
```

The above example can be simplified since the lambda expression parameters are getting passed right into the function getting called.

```java
list.forEach(System.out::println);
```

The Collection.forEach() method uses the iterator of the collection.
Using the iterator of the collection will make the processing order well-defined.
However, if you use the Collection.stream.forEach(), the order of the traversal is undefined. IE: traversal order is not guaranteed to be the same as the original list.
The Collection.parallelStream() stream is particularly useful because it enables us the execute the stream using multiple threads.

```java
list.parallelStream().forEach(System.out::println);
```

# Filter

Filters get used when you want to exclude specific entries from your data.
An example could be that you want to filter out all elements in your list
that contain null values before inserting them into a database.

```java
list.stream() // stream contains Biz, Bar, Foo
    .filter(s -> s.contains("B")) // stream contains Biz, bar
    .collect(Collectors.toList()) // list with Biz, bar
```

It is worth mentioning that other methods are available to a stream, such as count(), which will count the number of elements in the stream.

```java
list.stream().filter(s -> s.contains("B"))
    .count()
```

When calling .findFirst() on a stream it will return an optional-- refers to a Maybe in other functional languages like Haskell.
An optional is essentially saying that it might contain something cleaner than returning null because it is easier to catch and do error handling.
The Optional.orElse() function fetches the data inside the optional, but, returns a default value if none is present.

```java
list.stream().filter(s -> s.contains("B"))
        .findFirst().orElse("Nothing found!")
```


More optional examples:
```java
Optional<String> opt = Optional.empty();

System.out.println(opt.orElse("Not present!"));

// don't do this will throw an exception
System.out.println(opt.get());

opt = Optional.of("Woza");
System.out.println(opt.orElse("Not present!"));
```

It is also possible to turn an array into a stream to do list esque processing on it. 

```java
int[] array = {1,2,3,4};
System.out.println(
    Arrays.stream(array)
        .filter(v -> v > 2) // gets all values greater than 2
        .map(v -> v * 2) // mults the values by 2
        .boxed()// converts intstream to a Stream<Integer>
        .collect(Collectors.toList())
);
```

Recently I've been doing data processing in Java with my [Steams Graphs Project](https://github.com/jrtechs/SteamFriendsGraph), and this has given me an appreciation of stream-based processing. Using JanusGraph with Gremlin in Java gives you native access to all the stream operators.

```java
private List<Game> getPlayerGamesFromGraph(String id)
{
    return con.getTraversal().V()
            .hasLabel(SteamGraph.KEY_PLAYER)
            .has(Player.KEY_STEAM_ID, id)
            .outE()
            .inV()
            .hasLabel(Game.KEY_DB)
            .valueMap()
            .toStream()
            .map(Game::new)
            .collect(Collectors.toList());
}
```

