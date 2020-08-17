# adapt-carousel-menu  

This is a Carousel type menu which is different from the box styled menu when you select it you can move left or right through your courses of click on the number of course in sequiential order at the bottom of the page. 

<img src="https://raw.githubusercontent.com/mike-st/adapt-carousel-menu/master/screenshot-carousel.jpg" alt="IMAGE ALT TEXT HERE" width="768" height="389" border="10" />

### Attributes

**_id** (string): This is a unique identifier that establishes relationships with other content structures. It is referenced in *articles.json* as the `_parentid` of an article model.   

**_parentId** (string): This value is sourced from the parent element's `_id` found within *course.json*. It must match. 

**_type** (string): This value determines what the learner will access by clicking the provided link/button. Acceptable values are `"page"` and `"menu"`. `"page"` will direct the learner to a page structured with articles, blocks, and components. `"menu"` will direct the learner to a page with more menus. 

**_classes** (string): CSS class name to be applied to menu item's `page` element (*src/core/js/views/pageView.js*). The class must be predefined in one of the Less files. Separate multiple classes with a space.

**title** (string): This text is a reference title for the content object.

**displayTitle** (string):  This text is displayed on the menu item.

**body** (string):  Optional text that appears on the menu item. Often used to inform the learner about the menu choice. If no **pageBody** is supplied, this text will also appear as the body text of the page header.

**pageBody** (string): Optional text that appears as the body text of the page header. If this text is not provided, the **body** text will be used (if it is supplied). Reference [*adapt-contrib-vanilla/templates/page.hbs*](https://github.com/adaptlearning/adapt-contrib-vanilla/blob/master/templates/page.hbs).

**_graphic** (object): The image that appears on the menu item. It contains values for **alt** and **src**.

>**alt** (string): This text becomes the image’s `alt` attribute.

>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *"course/en/images/t05.jpg"*).  
       
**linkText** (string): This text is displayed on the menu item's link/button.  

### Modifing the default text description for the Menu Item Buttons (eg. click or tap text)
To add a custom default text description for the menu item buttons and remove the click or tap verbage. Please use the following coding in the Custom CSS/Less Project settings.

<p><strong>Code example</strong></p>
<p><strong>.carousel-menu-item:not(:first-child) .carousel-menu-item-content:after {<br/>&nbsp;&nbsp;&nbsp;content: 'Cliquez ou tapez sur Voir pour commencer.';</br>}</strong></p>

<img src="https://raw.githubusercontent.com/mike-st/adapt-carousel-menu/master/carousel-custom-language-image.jpg" alt="Modifing the click or tap text for the menu item buttons" name="menutext" width="768" height="389" border="10" />

### Accessibility
Not supported in this menu. I suggest leading the user right into the first page when accessibility is turned on.

<div float align=right><a href="#top">Back to Top</a></div>

## Limitations
This menu is not very accessible so try using the ScrollingTile Menu instead if you need it more accessible or cut out the menu in accessible mode to make it easier on the user...

[ScrollingTile Menu](https://github.com/mike-st/adapt-tilesMenu)

<div float align=right><a href="#top">Back to Top</a></div>  

----------------------------
**Version number:**  2.0.5   
**Framework versions:**  2.0 - 3.xx (See above Instructions for Framework 4 fixes)    
**Author / maintainer:** Mike Stevens work based off of BoxMenu from Adapt Team [contributors](https://github.com/mike-st/adapt-carousel-menu/graphs/contributors)  
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge 12, IE 11, IE10, IE9, IE8, IE Mobile 11, Safari for iPhone (iOS 8+9), Safari for iPad (iOS 8+9), Safari 8, Opera 
