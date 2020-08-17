# adapt-contrib-accordion

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/accordion01.gif" alt="accordion in action" align="right">  **Accordion** is a *presentation component* bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).

The component displays a vertically stacked list of headings. Each heading is associated with a collapsible content panel. Clicking a heading toggles the visibility of its content panel. Content panels may contain text and/or an image.

[Visit the **Accordion** wiki](https://github.com/adaptlearning/adapt-contrib-accordion/wiki) for more information about its functionality and for explanations of key properties.

## Installation

As one of Adapt's *[core components](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#components),* **Accordion** is included with the [installation of the Adapt framework](https://github.com/adaptlearning/adapt_framework/wiki/Manual-installation-of-the-Adapt-framework#installation) and the [installation of the Adapt authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-Adapt-Origin).

* If **Accordion** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:
`adapt install adapt-contrib-accordion`

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:
    `"adapt-contrib-accordion": "*"`
    Then running the command:
    `adapt install`
    (This second method will reinstall all plug-ins listed in *adapt.json*.)

* If **Accordion** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).
<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

The attributes listed below are used in *components.json* to configure **Accordion**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-accordion/blob/master/example.json). Visit the [**Accordion** wiki](https://github.com/adaptlearning/adapt-contrib-accordion/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki).

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**\_component** (string): This value must be: `accordion`.

**\_classes** (string): CSS class name to be applied to **Accordion**’s containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**\_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.

**\_shouldCollapseItems** (boolean): Used to control the auto-collapse of other expanded Accordion items whenever an item is clicked/expanded. Defaulted to 'true'

**\_setCompletionOn** (string): Determines when the component registers as complete. Acceptable values are `"allItems"` and `"inview"`. `"allItems"` (the default) requires the learner to view every single accordion item; `"inview"` requires only that the component has been viewed (i.e. passed completely through the browser viewport).

**\_items** (array): Multiple items may be created. Each _item_ represents one element of the accordion and contains values for **title**, **body**, **\_graphic**, and **\_classes**.

>**title** (string): This text is displayed as the element's header. It is displayed at all times, even when the **body** has been collapsed.

>**body** (string): This content will be displayed when the learner opens this accordion element. It may contain HTML.

>**\_graphic** (object): An optional image which is displayed below the item body when the learner opens this accordion element. It contains values for **src**, **alt**, and **attribution**.

>>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *course/en/images/c-45-1.jpg*).

>>**alt** (string): This text becomes the image’s `alt` attribute.

>>**attribution** (string): Optional text to be displayed as an [attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). By default it is displayed over the bottom of the image. Adjust positioning by modifying CSS. Text can contain HTML tags, e.g., `Copyright © 2015 by <b>Lukasz 'Severiaan' Grela</b>`.

>**\_classes** (string): An optional class that will be applied to the Accordion Item. Supported classes are `"align-image-left"` and `"align-image-right"` which aligns the item image to the left or right in desktop view. On smaller screens the item image defaults underneath the item body text. Additional classes can be used but they must be predefined in one of the Less files. Separate multiple classes with a space.

### Accessibility
**Accordion** has been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**. This label is not a visible element. It is utilized by assistive technology such as screen readers. Should the region's text need to be customised, it can be found within the **globals** object in [*properties.schema*](https://github.com/adaptlearning/adapt-contrib-accordion/blob/master/properties.schema).
<div float align=right><a href="#top">Back to Top</a></div>

## Limitations

No known limitations.

----------------------------

**Version number:**  5.1.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>  
**Framework versions:** 5.5+  
**Author / maintainer:** Adapt Core Team  
**Accessibility support:** WAI AA  
**RTL support:** Yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 12+13 for macOS/iOS/iPadOS, Opera  
