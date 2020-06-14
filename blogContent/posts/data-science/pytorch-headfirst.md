This post dives headfirst into PyTorch: a powerful open-source ML library for Python. 
Google's flagship ML library is TensorFlow, whereas Facebook developed PyTorch. 
Researchers are gravitating towards PyTorch due to its flexibility and efficiency. This tutorial goes over the basics of PyTorch, including tensors and a simple perceptron. 
This tutorial requires knowledge of Python, Numpy, and neural networks.
If you don't know anything about neural networks, I suggest that you watch this amazing video by 3Blue1Brown:

<youtube src="aircAruvnKk" />

You can install both Numpy and PyTorch using pip. Check out the [PyTorch](https://pytorch.org/) website to get the version of PyTorch that works with your version of CUDA installed on your computer. If you don't have an NVIDIA GPU with CUDA, you can still run PyTorch, but you won't be able to run your programs on the GPU.


```python
!pip install numpy
!pip install torch torchvision
```

Pro tip: if you are in a notebook adding a "!" will execute your command on the terminal. 


```python
!pwd
```

```
    /home/jeff/Documents/python
```

# Tensors

The core of the PyTorch library is centered around Tensors. Tensors are analogous to Numpy matrices, however, the benefit of tensors is their ability to get placed on the GPU. Tensors also allow you to do auto gradients, which makes doing backpropagation in neural networks a lot faster. 

Creating an empty tensor is similar to creating a new C array: anything can be in the memory that you grabbed, so don't expect it to be zero, ones, or "random."


```python
import torch

torch.empty(5, 2)
```


```
    tensor([[4.8132e-36, 4.5597e-41],
            [1.4906e-11, 3.0957e-41],
            [4.4842e-44, 0.0000e+00],
            [8.9683e-44, 0.0000e+00],
            [7.7759e-13, 3.0957e-41]])
```


If you explicitly create a random matrix, you will get values between zero and one. 


```python
x = torch.rand(5, 3)
print(x)
print(x.shape)
```

```
    tensor([[0.7825, 0.7864, 0.1257],
            [0.7588, 0.6572, 0.9262],
            [0.4881, 0.6329, 0.3424],
            [0.1333, 0.4235, 0.6760],
            [0.9737, 0.6657, 0.9946]])
    torch.Size([5, 3])
```

Similarly, there is a function for random integers.


```python
torch.randint(low=0, high=5, size=(3,3))
```

```
    tensor([[4, 2, 1],
            [2, 0, 3],
            [2, 2, 2]])
```



```python
torch.ones(3,1)
```

```
    tensor([[1.],
            [1.],
            [1.]])
```

Similar to numpy, you can also specify an empty array filled with zeros and specify a data type.

Common data types:
- torch.long
- torch.bool
- torch.float
- torch.int
- torch.int8
- torch.int16
- torch.int32
- torch.int64
- torch.double


```python
x = torch.zeros(5, 2, dtype=torch.long)
print(x)
```

```
    tensor([[0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]])
```

Size returns a tuple. In PyTorch it is common to do .size(), however .shape will return the same thing.


```python
print(x.size())
print(x.shape)
```

```
    torch.Size([5, 2])
    torch.Size([5, 2])
```

Like Numpy, Pytorch supports a ton of operators on a Tensor.

Check out the documentation at the [official website](https://pytorch.org/docs/stable/tensors.html).


```python
y = torch.rand(5,2)

x + y # same as torch.add(x, y)

result = torch.add(x, y)

torch.add(x, y, out= result) 
```

```
    tensor([[0.4942, 0.7370],
            [0.9927, 0.7068],
            [0.1702, 0.9578],
            [0.6510, 0.4992],
            [0.2482, 0.4928]])
```

Pytorch added multiple functions with "_" for standard operators that operate on the calling tensor.

```python
# adds the result to y
y.add_(result)
```

```
    tensor([[0.9885, 1.4740],
            [1.9855, 1.4135],
            [0.3405, 1.9155],
            [1.3020, 0.9984],
            [0.4964, 0.9856]])
```

Tensors support pythonic ways of accessing each element. 

```python
print(y[0][0]) # first element as a tensor
print(y[0, 0]) # same thing as y[0][0]
print(y[0][0].item()) # grabs data inside tensor
print(y[:, 0]) # gets first col
print(y[1, :]) # gets second row
```

```
    tensor(0.9885)
    tensor(0.9885)
    0.98846435546875
    tensor([0.9885, 1.9855, 0.3405, 1.3020, 0.4964])
    tensor([1.9855, 1.4135])
```

You can resize the tensor using the view function.


```python
print(y.view(1,10))

print(y.view(2,5))
```

```
    tensor([[0.9885, 1.4740, 1.9855, 1.4135, 0.3405, 1.9155, 1.3020, 0.9984, 0.4964,
             0.9856]])
    tensor([[0.9885, 1.4740, 1.9855, 1.4135, 0.3405],
            [1.9155, 1.3020, 0.9984, 0.4964, 0.9856]])
```

## CUDA

One of the great things about PyTorch is that you can run everything on either the GPU or the CPU. To make code more flexible to run on either device, most people set the device dynamically. Keeping your devices consistent is crucial because you can't do operations to a "CUDA" tensor by a "CPU" tensor-- this makes sense because one is on the GPU's memory, where the other is in the computer's main memory -- RAM. 


```python
torch.cuda.is_available() # prints if CUDA is available on system
```

```
    True
```



```python
device = torch.device("cpu")
if torch.cuda.is_available():
    device = torch.device("cuda")
x.to(device) # puts the x matrix on device selected
```


```
    tensor([[0.7825, 0.7864, 0.1257],
            [0.7588, 0.6572, 0.9262],
            [0.4881, 0.6329, 0.3424],
            [0.1333, 0.4235, 0.6760],
            [0.9737, 0.6657, 0.9946]], device='cuda:0')
```

## NumPy to Tensor

It is possible to switch between Numpy arrays and Tensors. Note, that this is now a shadow reference. Anything done to the NumPy array will get reflected in the original tensor and vice versa. 


```python
import numpy as np

g = np.zeros(5)

gg = torch.from_numpy(g)

print(gg)
```

```
    tensor([0., 0., 0., 0., 0.], dtype=torch.float64)
```

## CUDA Performance

Without question, the performance of matrix operations on the GPU is lightyears faster than on the CPU. The following code is an example of the speed difference.

```python
import time # times in seconds
def time_torch(size):
    x = torch.rand(size, size, device=torch.device("cuda"))
    start = time.time()
    x.sin_()
    end = time.time()
    return(end - start)

def time_numpy(size):
    x = np.random.rand(size, size)
    start = time.time()
    np.sin(x, out=x)
    end = time.time()
    return(end - start)

print(time_numpy(10000))
print(time_torch(10000))
```

```
    1.8906972408294678
    0.003466367721557617
```

On the CPU, it took 1.9 seconds to take the sin of a 10k by 10k matrix, on my GPU (Nvidia 1060), it only took 0.003 seconds!
It is worth pointing out that there is some overhead when transferring data from the GPU's memory to the main memory. 
For this reason, when designing algorithms, you should avoid swapping data on and off the GPU.

# Basic Perceptron

Now that we have seen Tensors, we can look at a basic neural network example.
In this example, we are merely going to be doing linear regression.
IE: our algorithm takes in a single input and tries to predict the output using the equation:

$$
y = mx+b
$$

The "x" is our input, and the "m" is the weight, and the b is the bias.

```python
import torch
from torch.autograd import Variable
import torch.nn as nn
import torch.nn.functional as F
```

There is a lot to be said about how you define a neural network in PyTorch; however, most follow this basic example.
The constructor creates each layer, and the forward function defines how data gets calculated as it gets pushed through the network.


```python
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(1,1)
    def forward(self, x):
        x = self.fc1(x)
        return x
```


```python
net = Net()
net.cuda() # puts the NN on the GPU
print(net) # displays NN structure
```

```
    Net(
      (fc1): Linear(in_features=1, out_features=1, bias=True)
    )
```

Printing the network like this is useful because you can see the dimensions of the data going in and out of the neural net.


```python
print(list(net.parameters()))
```

```
    [Parameter containing:
    tensor([[0.2431]], device='cuda:0', requires_grad=True), Parameter containing:
    tensor([0.3372], device='cuda:0', requires_grad=True)]
```

As to be expected, we see that the NN has two parameters initialized to random values.

Next, we have to define our loss function before we can train.
Our loss measures the magnitude of how incorrect our prediction made by the network was.
For this example, we are using the squared difference; this can be changed to other loss functions.
The important thing is that the loss is positive so that we can do backpropagation on it. 


```python
def criterion(out, label):
    return (label - out)**2
```

An optimizer is a special object by Pytorch that will adjust the neural network weights based on how they affected the gradient of the error.


```python
import torch.optim as optim
optimizer = optim.SGD(net.parameters(), lr=0.01, momentum=0.5)
```

The dummy data simply follows the equation y = 3x + 0.


```python
data = [(1,3), (2,6), (3,9), (4,12), (5,15), (6,18)]
```

All training loops look something like the following example. An epoch is simply how many iterations the neural network looks at the data. Optionally people will include another outer loop for "runs" this will simply run this training process multiple times to see if we are always converging on the same answer or are we getting stuck at local minimums.


```python
for epoch in range(100):
    for i, data2 in enumerate(data):
        X, Y = iter(data2)
        X, Y = Variable(torch.FloatTensor([X]), requires_grad=True).cuda(), Variable(torch.FloatTensor([Y])).cuda()
        optimizer.zero_grad()
        outputs = net(X)
        loss = criterion(outputs, Y)
        loss.backward()
        optimizer.step()
        if (i % 10 == 0):
            print("Epoch {} - loss: {}".format(epoch, loss.data[0]))
```

```
    Epoch 0 - loss: 5.854729652404785
    Epoch 1 - loss: 2.294259548187256
    Epoch 2 - loss: 0.5001814961433411
    Epoch 3 - loss: 0.8155164122581482
    Epoch 4 - loss: 0.6028059720993042
...
    Epoch 95 - loss: 4.468947372515686e-05
    Epoch 96 - loss: 4.02352525270544e-05
    Epoch 97 - loss: 3.622113945311867e-05
    Epoch 98 - loss: 3.2605526939732954e-05
    Epoch 99 - loss: 2.934764779638499e-05
```


```python
print(list(net.parameters()))
```

```
    [Parameter containing:
    tensor([[2.9989]], device='cuda:0', requires_grad=True), Parameter containing:
    tensor([0.0063], device='cuda:0', requires_grad=True)]
```

We can see that our NN has extimated the data generated by "y= 3x" to be "y= 2.999x + 0.006".

We can now use this network to make predictions.
Note: the shape of the input has to comply with the forward function, and the device of your input tensor must be the same device that the network is on. 


```python
input = Variable(torch.ones(1,1,1).cuda())
print(input)
print(net(input))
```

```
    tensor([[[1.]]], device='cuda:0')
    tensor([[[3.0051]]], device='cuda:0', grad_fn=<AddBackward0>)
```

From this example, we can quickly create more intricate neural networks. By adding a few lines of code, we can create a multi-layer perceptron. 


```python
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(1,10)
        self.fc2 = nn.Linear(10,1)
    def forward(self, x):
        x = self.fc2(self.fc1(x))
        return x
```


```python
net = Net().cuda()
net
```

```
    Net(
      (fc1): Linear(in_features=1, out_features=10, bias=True)
      (fc2): Linear(in_features=10, out_features=1, bias=True)
    )
```


```python
criterion = nn.MSELoss() # mean squared error for loss function
optimizer = optim.SGD(net.parameters(), lr=0.01, momentum=0.01)
for epoch in range(100):
    for i, data2 in enumerate(data):
        X, Y = iter(data2)
        X, Y = Variable(torch.FloatTensor([X]), requires_grad=True).cuda(), Variable(torch.FloatTensor([Y])).cuda()
        optimizer.zero_grad()
        outputs = net(X)
        loss = criterion(outputs, Y)
        loss.backward()
        optimizer.step()
        if (i % 10 == 0):
            print("Epoch {} - loss: {}".format(epoch, loss.data))
```

```
    Epoch 0 - loss: 7.190098285675049
    Epoch 1 - loss: 1.51701192407927e-06
    Epoch 2 - loss: 0.1253584325313568
    Epoch 3 - loss: 0.5402220487594604
    Epoch 4 - loss: 1.1704645156860352
... 
    Epoch 95 - loss: 3.3565470403118525e-09
    Epoch 96 - loss: 5.913989298278466e-10
    Epoch 97 - loss: 1.8417267710901797e-11
    Epoch 98 - loss: 2.3283064365386963e-10
    Epoch 99 - loss: 7.130438461899757e-10
```
