## Graph Data Base Basics


## Gremlin Installation


## Gremlin Syntax

#### Add a vertex
```gremlin
g.addV('student').property('name', 'Jeffery').property('GPA', 4.0);
```

#### Update a Property
```gremlin
g.V(1).property('name', 'Jeffery R');
```

#### Selection
```gremlin
g.V().hasLabel('student').valueMap();
```

```gremlin
g.V().hasLabel('student').values('name');
```

```gremlin
g.V().hasLabel('student').order().by('gpa', decr).valueMap();
```


#### Adding Edges
```gremlin
g.V(0).as('a').V(1).as('b').addE('knows')
                    .from('a').to('b');
```

#### Traversing Graph


## Using Gremlin With Java


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