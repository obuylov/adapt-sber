# adapt-contrib-boxMenu  

**Box Menu** is a *menu* bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/boxmenu01.png" alt="image of two rectangular menu options produced by box menu">

Menu choices are framed within a box element and arranged in a grid. **Box Menu** allows you to direct the learner to either further menus (sub menus) or to one or more pages of content. The **Box Menu** default is show a title, an image, some body text, duration, a progress indicator and a link button.

[Visit the **Box Menu** wiki](https://github.com/adaptlearning/adapt-contrib-boxMenu/wiki) for more information about its functionality and for explanations of key properties. Options include an estimated time for completion (duration) and a progress bar to indicate the percentage of components that have been completed.

## Installation

As Adapt's *[core menu](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#menu),* **Box Menu** is included with the [installation of the Adapt framework](https://github.com/adaptlearning/adapt_framework/wiki/Manual-installation-of-the-Adapt-framework#installation) and the [installation of the Adapt authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-Adapt-Origin).

* If **Box Menu** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:  
`adapt install adapt-contrib-boxMenu`

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:  
    `"adapt-contrib-boxMenu": "*"`  
    Then running the command:  
    `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

* If **Box Menu** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).

## Uninstallation  
The Adapt framework does not allow the installation of more than one menu at a time. In order to replace **Box Menu** it must be uninstalled. With the root of your framework installation as your current working directory, run the following command:  
`adapt uninstall adapt-contrib-boxMenu`  

<div float align=right><a href="#top">Back to Top</a></div>  

## Settings Overview

The attributes listed below are used in *course.json* and *contentObjects.json* to configure **Box Menu**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-boxmenu/blob/master/example.json). Visit the [**Box Menu** wiki](https://github.com/adaptlearning/adapt-contrib-boxMenu/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki). 

### Attributes

#### *course.json*
The following attributes, set within *course.json*, configure the defaults for **Box Menu**.

**\_boxMenu** (object): The boxMenu object that contains value for **\_menuHeader**.

**\_menuHeader** (object): The menuHeader object that contains values for **\_backgroundImage** and **\_minimumHeights**.

**\_backgroundImage** (object): The backgroundImage object that contains values for **\_large**, **\_medium** and **\_small**.

>**\_large** (string): File name (including path) of the image used with large device width. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-one.jpg*).

>**\_medium** (string): File name (including path) of the image used with medium device width. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-one.jpg*).

>**\_small** (string): File name (including path) of the image used with small device width. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-one.jpg*).

**\_minimumHeights** (object): The minimumHeights object that contains values for **\_large**, **\_medium** and **\_small**.

>**\_large** (number): The minimum height should only be used in instances where the menu header height needs to be greater than the content e.g. to prevent a background image being cropped.

>**\_medium** (number): The minimum height should only be used in instances where the menu header height needs to be greater than the content e.g. to prevent a background image being cropped.

>**\_small** (number): The minimum height should only be used in instances where the menu header height needs to be greater than the content e.g. to prevent a background image being cropped.

#### *contentObjects.json*
The following attributes, set within *contentObjects.json*, configure the defaults for **Box Menu**.

**\_id** (string): This is a unique identifier that establishes relationships with other content structures. It is referenced in *articles.json* as the `_parentid` of an article model.   

**\_parentId** (string): This value is sourced from the parent element's `_id` found within *course.json*. It must match. 

**\_type** (string): This value determines what the learner will access by clicking the provided link/button. Acceptable values are `"page"` and `"menu"`. `"page"` will direct the learner to a page structured with articles, blocks, and components. `"menu"` will direct the learner to a page with more menus. 

**\_classes** (string): CSS class name to be applied to menu item's `page` element (*src/core/js/views/pageView.js*). The class must be predefined in one of the Less files. Separate multiple classes with a space.

**\_isHidden** (boolean): If you want to hide a content object from the menu, set this to `true`. This can be useful if, for example, you have a content object defined as a 'start page' for the course which you therefore don't want to be listed on the menu since the user will have already seen it.

**title** (string): This text is a reference title for the content object.

**displayTitle** (string):  This text is displayed on the menu item.

**body** (string):  Optional text that appears on the menu item. Often used to inform the learner about the menu choice. If no **pageBody** is supplied, this text will also appear as the body text of the page header.

**pageBody** (string): Optional text that appears as the body text of the page header. If this text is not provided, the **body** text will be used (if it is supplied). Reference [*adapt-contrib-vanilla/templates/page.hbs*](https://github.com/adaptlearning/adapt-contrib-vanilla/blob/master/templates/page.hbs).

**\_graphic** (object): The image that appears on the menu item. It contains values for **alt** and **src**.

>**alt** (string): This text becomes the image’s `alt` attribute.

>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *"course/en/images/t05.jpg"*).  

**linkText** (string): This text is displayed on the menu item's link/button.  

**durationLabel** (string): Optional text which precedes **duration** (e.g., `"Duration:"`).  

**duration** (string): Optional text which follows **durationLabel** (e.g., `"2 mins"`).  

**\_boxMenu** (object): The boxMenu object that contains value for **\_renderAsGroup**.

>**\_renderAsGroup** (boolean): Enable this option to render items into a group on the menu. Groups can display a title, body, and instruction text. 

>Framework: Change the group content object type to `menu` and update the `_parentId` of the children content objects to match the group content object `_id`. Authoring Tool: Add a submenu and check the 'Enable as menu group?' setting. All users: If accessibility is required update the aria level values in config settings so the title heirarchy remains intact. 

<div float align=right><a href="#top">Back to Top</a></div>  

### Accessibility
Several menu-related elements are assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**, **menuItem**, and **menuEnd**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. Should the label texts need to be customised, they can be found within the **globals** object in [*properties.schema*](https://github.com/adaptlearning/adapt-contrib-boxmenu/blob/master/properties.schema).   
<div float align=right><a href="#top">Back to Top</a></div>

## Limitations

No known limitations.

----------------------------
**Version number:**  5.0.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>  
**Framework versions:**  5.5+  
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-boxmenu/graphs/contributors)  
**Accessibility support:** WAI AA  
**RTL support:** Yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 12+13 for macOS/iOS/iPadOS, Opera  
