The main goal is this post is to document a bugfix I made as a part of RIT's HFOSS class.
However, I feel that documenting the process of making a bugfix will help other people looking to contribute towards open source projects.

# Identify the Bug

The first step in a bug fix quest is to find a bug.
If you happen to find a bug, it is important that you check current issues to make sure that that bug has not already been reported. 
If you have no clue where to begin, I found it helpful to look for issues tagged as 
help wanted in a repository.


The other day I was notified about an issue opened on the RITlug (RIT Linux Users Group) website.
I got this notification via Github.
If you are active on a project, it is useful to be subscribed to their mailing list or issue tracker so you are alerted when a issue that you can work on comes up.
I really like Github because it gives you a lot of freedom in what issues/users/projects you are notified about.

[https://github.com/RITlug/ritlug.github.io/issues/263](https://github.com/RITlug/ritlug.github.io/issues/263)

Since I had familiarity with web development and was flagged as help wanted, I decided to fix this issue. 

# Communicate with Project

After you find a bug it is best to communicate with the project that you wish to fix this bug.
In my case I did this by leaving a comment on the issue and assigning the issue to myself.
This is very helpful because on very active projects, if you don't assign yourself the issue, there is a chance that two or more people would try to fix the issue at the same time.
Making yourself know for solving the issue is also enables you initiate a dialog with other people in the project interested in this issue.
This is also a great time to solicit feedback about how exactly the issue should get resolved.

# Fix the Bug

Just do it!
For the bug that I found I just had to modify some HTML and validate that it worked by running the
[Jeckyll](https://jekyllrb.com/) project.

# Submit Patch and Make Additional Changes

The last thing you need to do is submit your code for a code review so you can get your changes merged into the project.
To do this on Github you simply file a pull request.
This is where I find that a lot of back and forth happens.
Code reviews are places for you to fix mistakes, resolve, misunderstandings and improve
your code in general.
If you are reviewing code it is essential to give constructive feedback so people can effectively
work on the project.
