# Create an empty list
my_list = []

# Append elements to my_list
my_list.append(10)
my_list.append(20)

my_list.append(30)
my_list.append(40)

# Insert 15 at the second position (index 1)
my_list.insert(1, 15)

# Extend my_list with another list
my_list.extend([50, 60, 70])

# Remove the last element
my_list.pop()

# Sort my_list in ascending order
my_list.sort()

# Find and print the index of value 30
index_30 = my_list.index(30)
print("Index of 30:", index_30)
