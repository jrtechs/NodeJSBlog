In this blog post I want to examine the ways in which anti virus programs currently employ machine learning and then go into the potential pitfalls that ML bring.

# ML In the Antivirus Industry

Most current maleware detection falls into two broad categories: static and dynamic analysis.
Static analysis looks at the program without actually running the code.
Static analysis typically looks at things like the file fingerprint, virus scanning, reverse engineering, memory artifacts, packer detection, and debugging. 
Static analysis also encompasses looking up the hashes of the virus against a known database of viruses.
However, it is super easy to fool signature based malware detection using simple obfuscation methods.
Dynamic analysis is a technique where you run the program in a sandbox and monitor all the actions that the virus takes.
If you notice that the program is acting suspicious -ie changing the registry or making suspicious API calls- it is likely a virus.

Antivirus detection is very difficult, but, probably not for the reasons you think
The issue isn't writing programs which can detect these static or dynamic properties of viruses, that is the easy part.
It is also relatively easy to determine a general rule set for what makes a virus a virus.
You can easily whitelist suspicious domains, determine that certain file fingerprints hashes, and behaviours are virus like.

The real problem is that there are hundreds of thousands of maleware applications and more are created every day.
Not only are there tons of pesky maleware applications, there is an absurd amount of normal programs which we don't want maleware applications to block.  
It is impossible for a small team of maleware researchers to create a definitive set of heuristics which can correctly identify all maleware programs.

This is where we turn to the field of Machine Learning.
Humans are bad with big data, but, computers absolutely love big data.
Most antivirus companies use machine learning and it has been a large success so far because it has allowed us to dramatically improve our ability to detect zero day viruses.

## Interesting Examples

### Cylance

[Cylance](https://www.cylance.com) uses supervised learning and static analysis to classify files as being maleware. This product pulls a list of attributes from the file which they can then compare against other known viruses.

### MalwareBytes Anomalous

[Anomalous](https://blog.malwarebytes.com/detections/machinelearning-anomalous-100/) is a machine learning application which simply flags files which appear different from their training set of known normal files.
This does not attempt to classify what makes a virus a virus, but, what makes a normal program a normal program.
Anything which is not a normal program, it alerts you about since it is probably a virus.

### Kaspersky

Kaspersky appears to have a ton of research into using machine learning for maleware detection.
I would highly recommend that you read their [white paper](https://media.kaspersky.com/en/enterprise-security/Kaspersky-Lab-Whitepaper-Machine-Learning.pdf) on this subject.

# Why is this a problem?

It turns out that machine learning systems can be easily fooled by using [Generative Adversarial Networks](https://en.wikipedia.org/wiki/Generative_adversarial_network). Essentially what this boils down to is that you have two 