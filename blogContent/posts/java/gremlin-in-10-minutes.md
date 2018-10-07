# What is Gremlin?

Gremlin is a graph traversal language: think of Gremlin as the SQL for graph databases. Gremlin is not
a graph database server, it is a language; but, there is a Gremlin Server and a Gremlin Console available for 
interacting with graph databases. It is possible to use Gremlin on large database platforms 
like [Titan](https://www.digitalocean.com/community/tutorials/how-to-set-up-the-titan-graph-database-with-cassandra-and-elasticsearch-on-ubuntu-16-04)
 and [HBase](https://docs.janusgraph.org/latest/hbase.html). 


# Graph Data Base Basics

A graph database is based on graph theory. A graph is composed of nodes, edges, and properties. A key
object/component in a graph database is stored as a node. Nodes are connected via edges representing
relationships. For example, you may represent people as nodes and have edges representing friendships. 
You can assign properties to both nodes and edges. A person (node) may have the properties of age and name, 
where a friendship (edge) may have a start date property.

## Why Graph Databases?

Graph databases are great for modeling data where the value lies in the shape of the graph. Graph databases
also allow to to model more complex relationships which would be difficult to model in a normal table-based
database.

## Gremlin Installation

Download and extract the following:
- [Gremlin Console](https://www.apache.org/dyn/closer.lua/tinkerpop/3.3.3/apache-tinkerpop-gremlin-console-3.3.3-bin.zip)
- [Gremlin Server](https://www.apache.org/dyn/closer.lua/tinkerpop/3.3.3/apache-tinkerpop-gremlin-server-3.3.3-bin.zip)

Start the Gremlin server by running it with the start script in the bin folder. As a prerequisite for running gremlin, you
must have Java installed on your computer.
```
./gremlin-server.sh
```
Start the Gremlin console by running the gremlin.sh or gremlin.bat script in the bin folder.
```
./gremlin.sh
```

Now you need to instantiate a new graph on the server to use. To to that, execute the following commands in 
the Gremlin console.
```java
#Creates a empty graph
gremlin> graph = EmptyGraph.instance()
==>emptygraph[empty]

#Opens a connection to the server -- listens on localhost by default
gremlin> cluster = Cluster.open()
==>localhost/127.0.0.1:8182

#Tells the server to use g as the graph traversal source
gremlin> g = graph.traversal().withRemote(DriverRemoteConnection.using(cluster, "g"))
==>graphtraversalsource[emptygraph[empty], standard]
```


# Gremlin Syntax

Now that you have your gremlin server and console set up, you are ready to start executing Gremlin queries.

## Adding a Vertex

In Gremlin nodes are referred to as "Vertexes". To add a node/vertex to the graph, you simply use the 
command addV() on your graph traversal source. For consistency, most people
use "g" as their default graph traversal source. To append properties to your your vertex, you add a series of
".property('property_name', 'property_value')" strings to the add vertex query. 

EX:
```java
g.addV('student').property('name', 'Jeffery').property('GPA', 4.0);
```

## Updating a Property

Unlike SQL, you are not limited to a specific schema in a graph database. If you want to add or change 
a property on a vertex or edge, you simply use the property command again.
The "g.V(1)" in the following example refers to a specific vertex with the primary id of 1-- the graph database auto assigns these ids.
You can replace "g.V(1)" with a command to select a specific vertex or edge. 

```java
g.V(1).property('name', 'Jeffery R');
```

## Selection

Selecting nodes and edges is the most complicated part of Gremlin. The concept is not particularly hard, but, there
are dozens of ways to do graph traversals and selections. I will cover the most common aways to traverse a graph.


This example will select all vertexes which have the label "student". The ".valueMap()" command appended to the end of the query 
makes Gremlin return a map of all the objects it returns with their properties.
```java
g.V().hasLabel('student').valueMap();
```

In this following example, instead of returning a ValueMap of values, we are just returning the names of the students
in the graph.
```java
g.V().hasLabel('student').values('name');
```

This example will return the GPA of the student with the name "Jeffery R".
```java
g.V().hasLabel('student').has('name', 'Jeffery R').values('gpa');
```


This command will return all the students in order of their GPA.
```java
g.V().hasLabel('student').order().by('gpa', decr).value('name')
```


## Adding Edges

The easiest way (my opinion) to add edges in Gremlin is by
using aliasing. In this example we select two nodes and assign them a name: in this case it is "a", and "b".
After we have selected two edges, we can add an edge to them using the "addE()" command. The syntax of this is
nice because we know that "a" is friends with "b"-- it is easy to tell the direction of the edge. 

```java
g.V(0).as('a').V(1).as('b').addE('knows')
                    .from('a').to('b');
```


# Using Gremlin with Java

Now that you know the basic syntax of Gremlin, you are ready to use it somewhere other than the Gremlin console. If you
are trying to use Gremlin with Java, there is a great Maven dependency for TinkerPop and Gremlin. If you want to quickly 
connect to your Gremlin server with Java, make sure your server is set up exactly as it was before this tutorial started discussing
Gremlin syntax. 

## Maven dependency for Java:
```html
<!-- https://mvnrepository.com/artifact/com.tinkerpop/gremlin-core -->
<dependency>
  <groupId>com.tinkerpop</groupId>
  <artifactId>gremlin-core</artifactId>
  <version>3.0.0.M7</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver -->
<dependency>
  <groupId>org.apache.tinkerpop</groupId>
  <artifactId>gremlin-driver</artifactId>
  <version>3.3.3</version>
</dependency>

<dependency>
  <groupId>org.apache.tinkerpop</groupId>
  <artifactId>tinkergraph-gremlin</artifactId>
  <version>3.3.3</version>
</dependency>
```

It is helpful to wrap everything relating to the graph database connection into a single Java class. This is roughly
the code that I usually use to interact with a Gremlin Server-- anybody is free to use it. 

```java
public class GraphConnection
{
    /** Stores/manages client connections **/
    private Cluster cluster;

    /** Connection to the graph db */
    private Client client;

    public RemoteConnection()
    {
        Cluster.Builder b = Cluster.build();
        b.addContactPoint("localhost");
        b.port(8182);
        this.cluster = b.create();
        this.client = cluster.connect();
    }

    public synchronized ResultSet queryGraph(String q)
    {
        return this.client.submit(q);
    }

    public void closeConnection()
    {
        this.cluster.close();
    }
}
```

## Basic GraphConnection.java Usage:
```java
RemoteConnection con = new RemoteConnection()
String query = "g.V().hasLabel('player')" +
        ".has('id', '" + p1 + "')" +
        ".as('p1')" +
        "V().hasLabel('player')" +
        ".has('id', '" + p2 + "')" +
        ".as('p2')" +
        ".addE('friends')" +
        ".from('p1').to('p2')";
this.con.queryGraph(query);
```

## Overly complex usage with a lambda statement
```java
/**
 * Fetches the list of a player's friends.
 *
 * @param id steam id
 * @return list of friends
 */
private List<Player> getFriendsFromGraph(String id)
{
    List<Player> friends = new ArrayList<>();

    String query = "g.V().hasLabel('player')" +
            ".has('id', '" + id + "')" +
            ".both().valueMap()";

    this.con.queryGraph(query).stream().forEach(r ->
            friends.add(new Player(
                    ((ArrayList) (((HashMap<String, Object>) (r.getObject()))
                            .get("name"))).get(0).toString(),
                    ((ArrayList) (((HashMap<String, Object>) (r.getObject()))
                            .get("id"))).get(0).toString()))
    );
    return friends;
}
```

The most important thing to do while playing around with Gremlin in Java is to keep an eye on the 
return type. From experience, I can say that it is often easier to return the vertex from your 
query rather than returning the valueMap.

Without returning the valueMap in the query, you can directly access the vertex
in the result rather than doing some voodoo witchcraft and casting between ArrayLists and HashMaps.

The previous example could be re-written as this:
```java
List<Player> friends = new ArrayList<>();

String query = "g.V().hasLabel('player')" +
        ".has('id', '" + id + "')" +
        ".both()";

for(Result r: this.con.queryGraph(query))
{
    friends.add(new Player(r.getVertex("name").value().toString), 
                r.getVertex("id").value().toString));
}
```

You now know enough about Gremlin to be dangerous with it. Yay! If you want to do more than basic things with Gremlin,
I highly suggest that you look at the tutorial [SQL 2 Gremlin](http://sql2gremlin.com/). 
If you plan on deploying this to production, it is recommended that you use HBase for a persistent back end storage
server.

# Resources

- [SQL 2 Gremlin](http://sql2gremlin.com/)
- [Practical Gremlin](http://kelvinlawrence.net/book/Gremlin-Graph-Guide.html)
- [Apache TinkerPop](http://tinkerpop.apache.org/)
- [Steam Friends Graph (Personal Gremlin Project)](https://github.com/jrtechs/SteamFriendsGraph)