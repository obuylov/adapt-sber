# adapt-contrib-textInput  

**Text Input** is a *question component* bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/textInput01.gif" alt="text input in action">  

**Text Input** allows the user to input a free-form answer in response to an initial question. The author may supply multiple correct answers to accommodate, for example, variations in spelling. The author may also supply a suffix and prefix to be added to the text field.

[Visit the **Text Input** wiki](https://github.com/adaptlearning/adapt-contrib-textInput/wiki) for more information about its functionality and for explanations of key properties. 

## Installation

As one of Adapt's *[core components](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#question-components),* **Text Input** is included with the [installation of the Adapt framework](https://github.com/adaptlearning/adapt_framework/wiki/Manual-installation-of-the-Adapt-framework#installation) and the [installation of the Adapt authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-Adapt-Origin).

* If **Text Input** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:  
`adapt install adapt-contrib-textInput`

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:  
    `"adapt-contrib-textInput": "*"`  
    Then running the command:  
    `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

* If **Text Input** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).

## Settings Overview

The attributes listed below are used in *components.json* to configure **Text Input**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-textInput/blob/master/example.json). Visit the [**Text Input** wiki](https://github.com/adaptlearning/adapt-contrib-textInput/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki). 

### Attributes

In addition to the attributes specifically listed below, [*question components*](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#question-components) can implement the following sets of attributes:   
+ [**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. They have no default values. Like the attributes below, their values are assigned in *components.json*. 
+ [**core buttons**](https://github.com/adaptlearning/adapt_framework/wiki/Core-Buttons): Default values are found in *course.json*, but may be overridden by **Text Input's** model in *components.json*.  

**\_component** (string): This value must be: `textinput`. (One word, all lowercase.)

**\_classes** (string): CSS class name to be applied to [core plug-in]’s containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**\_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.  

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.  

**\_attempts** (integer): This specifies the number of times a learner is allowed to submit an answer. The default is `1`.    

**\_shouldDisplayAttempts** (boolean): Determines whether or not the text set in **remainingAttemptText** and **remainingAttemptsText** will be displayed. These two attributes are part of the [core buttons](https://github.com/adaptlearning/adapt_framework/wiki/Core-Buttons) attribute group. The default is `false`.  

**\_isRandom** (boolean): Setting this value to `true` will cause the `_items` to appear in a random order each time the component is loaded. The default is `false`.   

**\_questionWeight** (number): A number which reflects the significance of the question in relation to the other questions in the course. This number is used in calculations of the final score reported to the LMS.  

**\_canShowModelAnswer** (boolean): Setting this to `false` prevents the [**_showCorrectAnswer** button](https://github.com/adaptlearning/adapt_framework/wiki/Core-Buttons) from being displayed. The default is `true`.

**\_canShowFeedback** (boolean): Setting this to `false` disables feedback, so it is not shown to the user. The default is `true`. 

**\_canShowMarking** (boolean): Setting this to `false` prevents ticks and crosses being displayed on question completion. The default is `true`.

**\_recordInteraction** (boolean) Determines whether or not the learner's answer(s) will be recorded on the LMS via cmi.interactions. Default is `true`. For further information, see the entry for `_shouldRecordInteractions` in the README for [adapt-contrib-spoor](https://github.com/adaptlearning/adapt-contrib-spoor).

**\_allowsAnyCase** (boolean): This setting determines whether or not the learner's input must match the uppercase and lowercase letters of the supplied answer/s. Set to `false` if case-sensitivity is required for a correct answer. The default is `true`.  

**\_allowsPunctuation** (boolean): This setting determines whether the learner's input may include punctuation characters listed below. The default is `true`.  
`) ( ~ _ - = } { : ; * & ^ % £ $ ! # - / , . ` `

**\_answers**  (object array):  An optional two-dimensional array of answers that, if provided, eliminates a required ordering. Used with questions of this model: "List the names of seven continents" where order among the seven responses is irrelevant. May be used in combination with **\_items** in order to provide **prefixes**, **suffixes**, and **placeholders**, but **\_answers** should not be provided a second time.   Example:  
````
    “_answers”: [
       [“Asia”],
       [“Africa”],
       [“North America”,"N America", "N. America"],  
       [“South America”,"S America", "S. America"],
       [Europe],
       [Antartica],
       [Australia]
    ]
````

**\_items** (object array): Each item represents one text input box for this question and contains values for **\_answers**, **prefix**, **suffix**, and **placeholder**.  

>**\_answers** (string array): Text value/s that must be matched by the learner's input. Multiple answers can be created to accommodate, for example, variations in spelling.  Example:  
````
    "_answers": [  
        "2",
        "two"
    ]
````
>**prefix**  (string): Text entered in this setting will appear before the input area.  

>**suffix** (string): Text entered in this setting will appear after the input area.  

>**placeholder** (string): This text supplies a short hint describing the expected value of the input field.  

**\_feedback** (object): If the [**Tutor** extension](https://github.com/adaptlearning/adapt-contrib-tutor) is enabled, these various texts will be displayed depending on the submitted answer. **\_feedback**
contains values for three types of answers: **correct**, **\_incorrect**, and **\_partlyCorrect**. Some attributes are optional. If they are not supplied, the default that is noted below will be used.

>**title** (string): If not set, the component's **displayTitle** is used as the feedback title. If **displayTitle** is not set , **title** will be used instead.

>**correct** (string): Text that will be displayed when the submitted answer is correct.  

>**\_incorrect** (object): Texts that will be displayed when the submitted answer is incorrect. It contains values that are displayed under differing conditions: **final** and **notFinal**. 

>>**final** (string): Text that will be displayed when the submitted answer is incorrect and no more attempts are permitted. 

>>**notFinal** (string): Text that will be displayed when the submitted answer is incorrect while more attempts are permitted. This is optional&mdash;if you do not supply it, the **\_incorrect.final** feedback will be shown instead. 

>**\_partlyCorrect** (object): Texts that will be displayed when the submitted answer is partially correct. It contains values that are displayed under differing conditions: **final** and **notFinal**.  

>>**final** (string): Text that will be displayed when the submitted answer is partly correct and no more attempts are permitted. This is optional&mdash;if you do not supply it, the **\_incorrect.final** feedback will be shown instead.  

>>**notFinal** (string): Text that will be displayed when the submitted answer is partly correct while more attempts are permitted. This is optional&mdash;if you do not supply it, the **\_incorrect.notFinal** feedback will be shown instead.  

### Accessibility
**Text Input** has been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**. This label is not a visible element. It is utilized by assistive technology such as screen readers. Should the region's text need to be customised, it can be found within the **globals** object in [*properties.schema*](https://github.com/adaptlearning/adapt-contrib-textInput/blob/master/properties.schema).   
<div float align=right><a href="#top">Back to Top</a></div>

**Note to developers:**    
**Text Input** varies slightly from other Adapt *question components* in that the answer object does not have a **\_isCorrect**. Only one answer object is supplied and its values determine which responses are correct.

## Limitations

No known limitations.

----------------------------
**Version number:**  4.0.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>  
**Framework versions:** 5+  
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-textInput/graphs/contributors)  
**Accessibility support:** WAI AA  
**RTL support:** Yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 12+13 for macOS/iOS/iPadOS, Opera  
