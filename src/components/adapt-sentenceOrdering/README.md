# adapt-sentenceOrdering

[Visit the **sentenceOrdering** wiki](https://github.com/NayanKhedkar/adapt-sentenceOrdering) for more information about its functionality and for explanations of key properties.

<img src="https://github.com/NayanKhedkar/adapt-sentenceOrdering/blob/master/sentenceOrdering.gif?raw=true" alt="sentenceOrdering.gif">

## Installation

* If **sentenceOrdering** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:
    `adapt install adapt-sentenceOrdering`

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:  
        `"adapt-sentenceOrdering": "*"`  
    Then running the command:  
        `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

## Usage

This component can be used as part of an assessment.

## Settings overview

A complete example of this components settings can be found in the [example.json](https://github.com/NayanKhedkar/adapt-sentenceOrdering/blob/master/example.json) file. A description of the core settings can be found at: [Core model attributes](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes)

### Attributes

Further settings for this component are:

**_component** (string): This value must be: multipleDragNdrop.

**_classes** (string): CSS class name to be applied to multipleDragNdrop's containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are full, left or right.

**instruction** (string): This optional text appears above the component. It is frequently used to guide the learner’s interaction with the component.

**_attempts** (integer): This specifies the number of times a learner is allowed to submit an answer. The default is 1.

**_shouldDisplayAttempts** (boolean): Determines whether or not the text set in remainingAttemptText and remainingAttemptsText will be displayed. These two attributes are part of the core buttons attribute group. The default is false.

**_isRandom** (boolean): Setting this value to true will cause the _items to appear in a random order each time the component is loaded. The default is false.

**_questionWeight** (number): A number which reflects the significance of the question in relation to the other questions in the course. This number is used in calculations of the final score reported to the LMS.

**_itemWeight** (number): A number which reflects the significance of the word/item question in relation to the other questions in the course. This number is used in calculations of the final score reported to the LMS.

**_canShowModelAnswer** (boolean): Setting this to false prevents the _showCorrectAnswer button from being displayed. The default is true.

**_canShowMarking** (boolean): Setting this to false prevents ticks and crosses being displayed on question completion. The default is true.

**_recordInteraction** (boolean) Determines whether or not the learner's answers will be recorded to the LMS via cmi.interactions. Default is true. For further information, see the entry for _shouldRecordInteractions in the README for adapt-contrib-spoor.

**_defaultWidth** (number): Default width of an item.

**_defaultHeight** (number): Default height of an item.
**_isPrefixTitle**(boolean):set 'true' if  sentence prefix title required.
**_shouldScale** (boolean): Select 'true' to scale container based on number of draggable items it contains.

#sentenceOrdering

**_items** (object): This element of the settings contains the  items.

>**id** (number): Sortable Item Id naming convention.

>**prefixTitle** (string): This string of the settings contains the prefix to sentence.

>**sentence** (string): This string of the settings contains the text to sentence.

>**position** (array): Correct position(place) of sentence eg([1]) or multiple correct position of sentence ex([1,5]).

**_feedback** (object): If the Tutor extension is enabled, these various texts will be displayed depending on the submitted answer. _feedback contains values for three types of answers: correct, _incorrect, and _partlyCorrect. Some attributes are optional. If they are not supplied, the default that is noted below will be used.

**correct** (string): Text that will be displayed when the submitted answer is correct.

**_incorrect** (object): Texts that will be displayed when the submitted answer is incorrect. It contains values that are displayed under differing conditions: final and notFinal.

**final** (string): Text that will be displayed when the submitted answer is incorrect and no more attempts are permitted.

**notFinal** (string): Text that will be displayed when the submitted answer is incorrect while more attempts are permitted. This is optional—if you do not supply it, the _incorrect.final feedback will be shown instead.
_partlyCorrect (object): Texts that will be displayed when the submitted answer is partially correct. It contains values that are displayed under differing conditions: final and notFinal.

**final** (string): Text that will be displayed when the submitted answer is partly correct and no more attempts are permitted. This is optional—if you do not supply it, the _incorrect.final feedback will be shown instead.

**notFinal** (string): Text that will be displayed when the submitted answer is partly correct while more attempts are permitted. This is optional—if you do not supply it, the _incorrect.notFinal feedback will be shown instead.

## Limitations

To be completed

##Browser spec

This component has been tested to the standard Adapt browser specification.
