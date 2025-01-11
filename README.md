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
We have pre-defined grid of lands 0_0, 0_1 etc..
Default items are first defined in one of these land files

Read all item from the default files current surrounds (kings square around current pos)
read all modified items from storage (every item not in its default place)
Loop through all modified items:
- Update any items that are in the current surrounds
- Remove any items that are not in the current surrounds
- Add any items that are in the current surrounds

Render items in current list

When a tree is chopped it is removed from 
- the land 
- the suburb
- the world html
- wood is added as a new item into app.gameLists and put in our inventory

When a rock is moved is is updated in
- the land 
- the suburb
- the world html 

When we move to a different land, repeat.


Lists
We have two gamelists: default and moved
All player interactions are stored in moved
Default is loaded from the server
Moved is stored in loca storage
A gamesLists consists of several itemLists
An itemList has an id eg '_s' for surface and a list of items
Decoding is done per gameList and takes a string (\n ignored) 
'_s|a,,rock,,10,20;b,,rock,,30,40 
 _u|x,,gold,,30,55;y,,diamond,,66,77
 ajD|a,,rock;b,,rock;c,,log
'
We only store key info , other info is read from Asset.js as needed like image, collision boxes and behaviour.

The layer id should match an item's id so a checst or an NPC can have an inventory eg a check with id 'ajD' would be encoded in local storage 'ajD|a,,rock;b,,rock;c,,log' 

Auto-generated ids (UniqueId.js) are a-zA-Z0-9 so punctuation can be used for deimiters and underscores for special ids like the surface layer.


