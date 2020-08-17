# adapt-tilesmenu  

**Scrolling Tiles Menu** is a *menu* that works with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

<img src="https://raw.githubusercontent.com/mike-st/adapt-tilesMenu/master/screenshot-tile.jpg" alt="IMAGE ALT TEXT HERE" width="768" height="389" border="10" />

Menu choices are framed within a box element and arranged in a grid. **Scrolling Tiles Menu** allows you to direct the learner to either further menus (sub menus) or to one or more pages of content. The **Box Menu** default is show a title, an image, some body text, duration, a progress indicator and a link button.

<div float align=right><a href="#top">Back to Top</a></div>  

## Settings Overview

The attributes listed below are used in *contentObjects.json* to configure **Box Menu**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-tilesmenu/blob/master/example.json). Visit the [**Box Menu** wiki](https://github.com/adaptlearning/adapt-tilesmenu/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki). 

### Attributes

**_id** (string): This is a unique identifier that establishes relationships with other content structures. It is referenced in *articles.json* as the `_parentid` of an article model.   

**_parentId** (string): This value is sourced from the parent element's `_id` found within *course.json*. It must match. 

**_type** (string): This value determines what the learner will access by clicking the provided link/button. Acceptable values are `"page"` and `"menu"`. `"page"` will direct the learner to a page structured with articles, blocks, and components. `"menu"` will direct the learner to a page with more menus. 

**_classes** (string): CSS class name to be applied to menu item's `page` element (*src/core/js/views/pageView.js*). The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_isHidden** (boolean): If you want to hide a content object from the menu, set this to `true`. This can be useful if, for example, you have a content object defined as a 'start page' for the course which you therefore don't want to be listed on the menu since the user will have already seen it.

**title** (string): This text is a reference title for the content object.

**displayTitle** (string):  This text is displayed on the menu item.

**body** (string):  Optional text that appears on the menu item. Often used to inform the learner about the menu choice. If no **pageBody** is supplied, this text will also appear as the body text of the page header.

**pageBody** (string): Optional text that appears as the body text of the page header. If this text is not provided, the **body** text will be used (if it is supplied). Reference [*adapt-contrib-vanilla/templates/page.hbs*](https://github.com/adaptlearning/adapt-contrib-vanilla/blob/master/templates/page.hbs).

**_graphic** (object): The image that appears on the menu item. It contains values for **alt** and **src**.

>**alt** (string): This text becomes the image’s `alt` attribute.

>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *"course/en/images/t05.jpg"*).  

**linkText** (string): This text is displayed on the menu item's link/button.  

**durationLabel** (string): Optional text which precedes **duration** (e.g., `"Duration:"`).  

**duration** (string): Optional text which follows **durationLabel** (e.g., `"2 mins"`).  

<div float align=right><a href="#top">Back to Top</a></div>  

### Modifing the default text description for the Menu Item Buttons (eg. click or tap text)
To add a custom default text description for the menu item buttons and remove the click or tap verbage. Please use the following coding in the Custom CSS/Less Project settings.

<p><strong>Code example</strong></p>
<p><strong>.menu-item-button:after {<br/>&nbsp;&nbsp;&nbsp;content: 'Cliquez ou tapez sur Voir pour commencer.';</br>}</strong></p>

<img src="https://raw.githubusercontent.com/mike-st/adapt-tilesMenu/master/carousel-custom-language-image.jpg" alt="Modifing the click or tap text for the menu item buttons" name="menutext" width="768" height="389" border="10" />

### Accessibility
Several menu-related elements are assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**, **menuItem**, and **menuEnd**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. Should the label texts need to be customised, they can be found within the **globals** object in [*properties.schema*](https://github.com/adaptlearning/adapt-tilesmenu/blob/master/properties.schema).   
<div float align=right><a href="#top">Back to Top</a></div>

## Limitations
 
No known limitations.  

----------------------------
**Version number:**  3.0.3   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a> 
**Framework versions:**  2.1+     
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-tilesmenu/graphs/contributors)  
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, IE Mobile 11, Safari 10+11 for macOS+iOS, Opera 


