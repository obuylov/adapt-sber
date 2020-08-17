# adapt-contrib-hotgraphic  

**Hot Graphic** is a *presentation component* bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  
<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/hotgraphic01.gif" alt="Hot Graphic in action">  

When a learner clicks on a hot spot within the image, a pop-up is displayed that consists of text with an image. [Visit the **Hot Graphic** wiki](https://github.com/adaptlearning/adapt-contrib-hotgraphic/wiki) for more information about its functionality and for explanations of key properties. 

## Installation

As one of Adapt's *[core components](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#components),* **Hot Graphic** is included with the [installation of the Adapt framework](https://github.com/adaptlearning/adapt_framework/wiki/Manual-installation-of-the-Adapt-framework#installation) and the [installation of the Adapt authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-Adapt-Origin).

* If **Hot Graphic** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:  
`adapt install adapt-contrib-hotgraphic`

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:  
    `"adapt-contrib-hotgraphic": "*"`  
    Then running the command:  
    `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

* If **Hot Graphic** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  
<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

The attributes listed below are used in *components.json* to configure **Hot Graphic**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-hotgraphic/blob/master/example.json). Visit the [**Hot Graphic** wiki](https://github.com/adaptlearning/adapt-contrib-hotgraphic/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki). 

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**\_component** (string): This value must be: `hotgraphic`. (One word.)

**\_classes** (string): CSS class name to be applied to **Hot Graphic**’s containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**\_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.  

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.  

**mobileBody** (string): This is optional text that will be substituted for **body** when `Adapt.device.screenSize` is `small` (i.e., when viewed on mobile devices).  

**mobileInstruction** (string): This is optional text that will be substituted for **instruction** when `Adapt.device.screenSize` is `small` (i.e., when viewed on mobile devices).  

**\_setCompletionOn** (string): This value determines when the component registers as complete. Acceptable values are `"allItems"` and `"inview"`. `"allItems"` requires each pop-up item to be visited. `"inview"` requires the **Hot Graphic** component to enter the view port completely.  
  
**\_canCycleThroughPagination** (boolean): Enables the pop-ups to be cycled through endlessly using either the previous or next icon. When set to `true`, clicking "next" on the final stage will display the very first stage. When set to `false`, the final stage will display only a "previous" icon. The default is `false`.  

**\_hidePagination** (boolean): When set to `true`, hides the "previous" and "next" icons and progress indicator (e.g., "1/5") on the pop-up's toolbar. The default is `false`.

**\_useNumberedPins** (boolean): If set to `true`, the pin icons will be replaced with the item number. Useful if you want pins to be visited in a set order or show steps in a process. The default is `false`.

**\_useGraphicsAsPins** (boolean): If set to `true`, the image specified by **\_graphic.src** will be ignored and the popup images specified in **\_items[n].\_graphic.src** will instead be laid out in a 2 item width grid system. See [example.json](example.json#L77-L121) for a working example. The default is `false`.

**\_isRound** (boolean): If set to `true`, the popup images will inherit a 50% border radius. Ideal for use with images that are square that are required to be round. The default is `false`.

**\_graphic** (string): The main image that the hot spots appear over. It contains values for **src**, **alt**, and **attribution**.

>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-two.jpg*).

>**alt** (string): This text becomes the image’s `alt` attribute.

>>**attribution** (string): Optional text to be displayed as an [attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). By default it is displayed below the image. Adjust positioning by modifying CSS. Text can contain HTML tags, e.g., `Copyright © 2015 by <b>Lukasz 'Severiaan' Grela</b>`.  

**\_items** (string): Multiple items may be created. Each _item_ represents one hot spot for this component and contains values for **title**, **\_ariaLevel**, **body**, **\_graphic**, **\_pin**, **strapline**, **\_classes**, **\_top**, and **\_left**.

>**title** (string): This is the title text for a hot spot pop-up.

>**\_ariaLevel** (number): Aria level for the title.

>**body** (string): This is the main text for a hot spot pop-up.

>**\_graphic** (string): The image that appears as a hot spot. Its location is controlled by **\_top** and **\_left**. It contains values for **src**, **alt**, **attribution**, and **\_classes**.  

>>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-two.jpg*).

>>**alt** (string): This text becomes the image’s `alt` attribute.   

>>**attribution** (string): Optional text to be displayed as an [attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). By default it is displayed below the image. Adjust positioning by modifying CSS. Text can contain HTML tags, e.g., `Copyright © 2015 by <b>Lukasz 'Severiaan' Grela</b>`.

>>**\_classes** (string): CSS class name to be applied to hotgraphic pin or, alternatively, to the hotspot tile when **\_useGraphicsAsPins** is set to true The class must be predefined in one of the Less files. Separate multiple classes with a space.

>**\_pin** (string): Optional image that can appear instead of the default pin icon. It contains values for **src** and **alt**. 

>>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *course/en/images/origami-menu-two.jpg*).

>>**alt** (string): This text becomes the pin image’s `alt` attribute. 

>**strapline** (string): This text is displayed when `Adapt.device.screenSize` is `small` (i.e., when viewed on mobile devices). It is presented in a title bar above the image.

>**\_classes** (string): CSS class name to be applied to the popup item. Supported classes are `"align-image-left"`, `"hide-desktop-image"`, and `"hide-popup-image"` which aligns the item image to the left, hides the pop up image in desktop view, and hides the pop up image for all screen sizes respectively. The class must be predefined in one of the Less files. Separate multiple classes with a space.

>**\_top** (number): Each hot spot must contain **\_top** and **\_left** coordinates to position them on the hot graphic. Enter a percentage value (0-100) that this hot spot should be from the top border of the main graphic.

>**\_left** (number): Enter a percentage value (0-100) that this hot spot should be from the left border of the main graphic.

### Accessibility
**Hot Graphic** has two elements assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion** and **ariaPopupLabel**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. Should the label texts need to be customised, they can be found within the **globals** object in [*properties.schema*](https://github.com/adaptlearning/adapt-contrib-hotgraphic/blob/master/properties.schema).   
<div float align=right><a href="#top">Back to Top</a></div>

## Limitations

When viewport size changes to the smallest range, this component will behave like a [**Narrative** component](https://github.com/adaptlearning/adapt-contrib-narrative). All information will remain available but formatted as a narrative rather than as hot spots on a graphic.

----------------------------
**Version number:**  5.2.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>  
**Framework versions:**  5.5+  
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-hotgraphic/graphs/contributors)  
**Accessibility support:** WAI AA  
**RTL support:** Yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 12+13 for macOS/iOS/iPadOS, Opera  
