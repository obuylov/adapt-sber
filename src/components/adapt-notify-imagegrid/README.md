# adapt-notify-imagegrid

This component is used to add images into a grid format using columns. Each image can have a title and more information in the form of the Notifier popping up.

---

<img src="https://raw.githubusercontent.com/mike-st/adapt-notify-imagegrid/master/notify-imagegrid.gif" alt="Adapt Notify Image Grid Component" width="920" height="628" border="10" /> 

## Installation
This component must be manually installed.

## Settings Overview

The attributes listed below are used in *components.json* to configure **Notifyimagegrid**, and are properly formatted as JSON in [*example.json*](https://github.com/mike-st/adapt-notify-imagegrid/blob/master/example.json). 

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `notify-imagegrid`. (One word.)

**\_classes** (string): CSS class name to be applied to **Notifyimagegrid**’s containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**\_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.

**\_columns** (number): This value determines the number of columns within the grid. Any number of columns can be set however keep in mind the more columns there are the smaller the items will be.

**\_reverseDirection** (number): This value determines reverses the direction of how the image grid displays.

**\_constrainHeight** (string): This value constrains images to all the same height in the grid.

**\_heightAmount** (number): This value adds a custom constrained height amount to each image in the grid.

Notifyimagegrid has a dynamic layout system. If you have 5 items but set the columns to 3, notify-imagegrid will put 3 items in the first row and 2 on the second. The second row then will be automatically centred. This works with any amount of items and columns - ie that last row will always be centred for you.

**\_items** (string): Multiple items may be created. Each item represents one grid item for this component and contains values for **title**, **body**, **\_graphic** and **\_itemGraphic**. 

>**\_graphic** (string): This is the image that displays for each grid item. This graphic requires three state **src** values, with additional values **alt** and **title**.

>>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *course/en/images/c-15.png*).

>>**alt** (string): This text becomes the image’s `alt` attribute.

>>**title** (string): This is optional text which is displayed under the grid item image.

>**\_itemClasses** (string): Allows for individual styling of each grid item.


### Accessibility
**Notifyimagegrid** has a label assigned using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. This label is included within the *example.json* and will need adding to the _globals in *course.json*.

## Limitations
Currently not tested in Adapt Authoring Tool.
Notifyimagegrid automatically switches to 2 columns in mobile mode for the best user experience however this can be overridden in the css.

----------------------------
**Version number:**  1.0.0
**Framework versions:**  2.0     
**Author / maintainer:**   
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, IE Mobile 11, Safari 10+11 for macOS+iOS, Opera 
