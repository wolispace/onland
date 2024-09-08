# On land

## A big world for a little adventure.


### storage concept
Each item has a unique ID within the world
We have pre-defined grid lands 0_0, 0_1 etc..
An item is first defined in one of these land files
When we read it we store the item in local storage
It is stored by its id

When the world starts we read all current land files to work out the default items to show

Then we read all local storage items and make one list of known items

We put each item in a land and a suburb in app temp storage

When we move lands we clear our list of items and repeat: load lands, update with all known items, index each into a land and a suburb

When we move suburbs we are only looking at items within our temp storage

- load a set of land files and build a list of items

- loop through all store items, calc their land and either update or add to our current temp list of items

- loop through all temp items and allocate to suburbs

- show we have something to show

- when an item is moved, we calc its land and update it in local storage

