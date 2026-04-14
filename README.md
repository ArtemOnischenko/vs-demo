# State Store
State store is a place where I store selected Users, Filters for posts, and data for lists as signals with which I can easily filter and sort data using computed, so the list will be updated the moment we select a user or change filters. On initialization, I take parameters for filters and selected users from the query. If we have no query parameters, a default value will be assigned. When I create a form for filters, I’m using the store to take the current state of filters as a default value. As for selecting users, I use the store to retrieve a set of selected users as a signal, and then just add CSS to the element that represents such a user in the list

# Virtual Scrolling
As for the scroller component, I used ngTempleteOutlet to give the user ability to customize header for list and list item itself, you can see that look of user list item and post list item is different; same for header. This is a reusable component that may be needed in other parts of application, which is why it is placed inside shared folder, as for functionality of virtual scroll - I’m using signal“visibleItems” to store items(and then render) that should be visible in the viewport + some buffer items to make the scroll work smoothly. To have correct size of scroll bar I have container with height equal to the total height of rows(which I know since I know length of the list and item height). So visually it looks like full long list but in reality only small part of it is rendered. On scroll event, or if list changes(like during filtering), I recalculate visibleItems.

In order to run it locally:
1. Ensure your Node.js version is v20.19.0 or newer
2. Clone this repo,
3. Open project folder in terminal
4. In the root run “npm install” to install all dependencies.
5. Then, in the root run command “npm run start”
You should be able to access local version via http://localhost:4200/
