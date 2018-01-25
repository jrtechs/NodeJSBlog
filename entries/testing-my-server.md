#THIS IS A H1

This page is merely for testing -- go away

```
include <stdio.h>
void main(int argc, char * argv[])
{
	int vals[1000];

	//value will overflow a 32 bit int!!!
	long int max = 0;
	
	char * data = argv[1];
	for(int i = 0; i < 1000; i++)
	{
		vals[i] = (int)data[i] - 48;
	}

	for(int i = 0; i < 1000 - 13; i ++)
	{
		long int tempMax = 1;
		for(int t = i; t < i + 13; t++)
		{
			tempMax *= vals[t];
		}
		if(tempMax > max)
		{
			max = tempMax;
		}
	}

	printf("the max number is %ld", max);
}
```