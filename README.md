# On land

## A big world for a little adventure.


### storage concept
Each item has a unique ID within the world
We have pre-defined grid lands 0_0, 0_1 etc..
An item is first defined in one of these land files

Read all item from the default files
read allItems from storage
Loop through allItems:
- Update any items that are in the current surrounds
- Remove any items that are not in the current surrounds
- Add any items that are in the current surrounds

Render items in current list

When a tree is chopped it is removed from 
- the land 
- the suburb
- the world html
- wood is added as a new item into app.items and put in our inventory

When a rock is moved is is updated in
- the land 
- the suburb
- the world html 

We need a temp list of items we have read from file but not processed yet
We process this temp list with items we know have moved
We use the temp list to populate the grids 
