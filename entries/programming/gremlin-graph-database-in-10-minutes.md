## Graph Data Base Basics

A graph database is based on graph structures. A graph is composed of nodes, edges, and properties. A key
object/component in a graph database is stored as a node. Nodes are connected together via edges representing
relationships. For example, you may represent people as nodes and have edges representing who people are friends 
with. You can assign properties to both nodes and edges. A person (node) may have the properties of age and name, 
where a friendship (edge) may have a start date property.

#### Why Graph Databases?

Graph databases are great for modeling data where the value lies in the shape of the graph, or, it would be difficult
to model in a traditional table based database.

#### What is Gremlin?

Gremlin is a graph traversal language; think of Gremlin as SQL but for graph databases. Gremlin is not
a graph database server, it is a language; but, there is a Gremlin Server and Gremlin Console available for 
interacting with graph databases using Gremlin. It is possible to use Gremlin on large database platforms 
like [Titan](https://www.digitalocean.com/community/tutorials/how-to-set-up-the-titan-graph-database-with-cassandra-and-elasticsearch-on-ubuntu-16-04)
 and [HBase](https://docs.janusgraph.org/latest/hbase.html). 

## Gremlin Installation

Download and extract the following:
- [Gremlin Console](https://www.apache.org/dyn/closer.lua/tinkerpop/3.3.3/apache-tinkerpop-gremlin-console-3.3.3-bin.zip)
- [Gremlin Server](https://www.apache.org/dyn/closer.lua/tinkerpop/3.3.3/apache-tinkerpop-gremlin-server-3.3.3-bin.zip)

Start the Gremlin server by running it with the start script in the bin folder.
```
./gremlin-server.sh
```
Start the Gremlin console by running the gremlin.sh or gremlin.bat script in the bin folder of the apache-tinkerpop folder.
```
./gremlin.sh
```

Now you need to instantiate a new graph on the server to use. To to that, execute the following commands.
```gremlin
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


## Gremlin Syntax

Now that you have your gremlin server and console set up, you are ready to start executing Gremlin queries.

#### Add a Vertex

For Gremlin, nodes are referred to as "Vertexes". To add a node/vertex to the graph, you simply use the 
command addV('node label') on your graph traversal source. For consistency, most people and documentation
use "g" as their default graph traversal source. To append properties to your your node, you string a series of
.property('property_name', 'property_value') to the queries. 

ex:
```gremlin
g.addV('student').property('name', 'Jeffery').property('GPA', 4.0);
```

#### Update a Property

Unlike SQL, you are not limited to a specific schema for a graph database. If you want to add or change 
a property of a vertex or edge, you simply call its .property('property_name', 'property_value').
The g.V(1) in the example refers to a specific node with the primary id of 1, these ids are auto assigned by the graph database.
You can replace g.V(1) with a command to select a specific node. 

```gremlin
g.V(1).property('name', 'Jeffery R');
```

#### Selection

Selecting nodes and edges is the most complicated part of Gremlin. The concept is not particularly hard but, there
are dozens of ways to do traversals and selections. I will cover the most common and helpful ways to traverse a 
graph.


This example will select all vertexes which have the label "student". The .valueMap() appended to the end means
that it will returns a map of all the properties of the nodes it returns. 
```gremlin
g.V().hasLabel('student').valueMap();
```

In this example instead of returning a ValueMap of values, we are just returning the names of the students
in the graph.
```gremlin
g.V().hasLabel('student').values('name');
```

This example will return the GPA of the student with the name "Jeffery R".
```gremlin
g.V().hasLabel('student').has('name', 'Jeffery R').values('gpa');
```


This command will all the students in order of their GPA.
```gremlin
g.V().hasLabel('student').order().by('gpa', decr).value('name')
```


#### Adding Edges

If you want to add a edge (relationship/connection) between two nodes, the easiest way (my opinion) to do it in Gremlin is by
using something called aliasing. In this example we select two nodes and give them a name, in this case it is "a", and "b".
After we have selected two edges, we can add an edge to them using the addE('Relation_Name') command. The syntax of this is
nice because we know that "a" is friends with "b"-- it is easy to tell the direction

```gremlin
g.V(0).as('a').V(1).as('b').addE('knows')
                    .from('a').to('b');
```


## Using Gremlin With Java

Now that you know the syntax of Gremlin, you are ready to use it somewhere other than just the Gremlin console. If you
are trying to use Gremlin with Java, there is a nice Maven dependency for TinkerPop and Gremlin. If you want to quickly 
connect to your server with Java, make sure your server is set up exactly as it was before this tutorial started discussing
Gremlin Syntax. 
```maven
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
the code that I usually use to interact with a Gremlin Server, anybody is free to use it. 

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

ex GraphConnection Usage:
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
//System.out.println(query);
this.con.queryGraph(query);
```

Overly complex usage with lambda example.
```java
/**
 * Fetches a list of friends from the graph database
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
return type. From experience, I can say that it is often easier to return the node/edges from your 
query rather than doing a valueMap.

Without adding valueMap()/values() to the end of the query, you now can directly access the vertex or edge in the result rather than
doing some voodoo witchcraft and casting between ArrayLists and HashMaps.

The previous example could be re-written as this:
```java
List<Player> friends = new ArrayList<>();

String query = "g.V().hasLabel('player')" +
        ".has('id', '" + id + "')" +
        ".both()";

for(Result r: this.con.queryGraph(query))
{
    friends.add(new Player(r.getVertex("name").value().toString), 
                                    r.getVertex("id").value().toString),)
}
```

Now you know enough to be dangerous with Gremlin. Yay! If you want to do more than basic things with Gremlin,
I highly suggest that you take a look at the tutorial [SQL 2 Gremlin](http://sql2gremlin.com/). 
If you plan on deploying this to production, it is recommended to use HBase with JanusGraph for a persistent back end storage
server.


## Resources

- [SQL 2 Gremlin](http://sql2gremlin.com/)
- [Practical Gremlin](http://kelvinlawrence.net/book/Gremlin-Graph-Guide.html)
- [Apache TinkerPop](http://tinkerpop.apache.org/)
- [Steam Friends Graph (Personal Gremlin Project)](https://github.com/jrtechs/SteamFriendsGraph)