# On land

## A big world for a little adventure.

This is a work-in-progress as I build a game engine to then build a game.

## Aims

- A large scrolling world to explore
- Things to find, quests to do, things to grow?
- Have movement acceleration and velocity like Spindizzy
- Use as few libraries and frameworks as possible (ie build it all myself)
- Run in a web browser (mobile friendly),
- Use local storage to save player state (limit on size!)
- Maybe use the Yoda Stories concept of short 30min adventures
- Somehow make it a mystery like Piranesi (why is the player here? can they escape? do they want to? map the world)

## storage concept
Each item has a unique ID within the world
We have pre-defined grid lands 0_0, 0_1 etc..
An item is first defined in one of these land files

Read all item from the default files current surrounds (kings square around current pos)
read all modified items from storage (every item no in its default place)
Loop through all modified items:
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

When we move to a different land, repeat.

