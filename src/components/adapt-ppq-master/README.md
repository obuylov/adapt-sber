# adapt-ppq

A question component that requires users to correctly position one or more pins on an image. The component has one or more targets. The user is required to place a single pin in each target. In SCORM terms it is a type `choice` activity, though for technical reasons it must be implemented as a type `performance` activity. Type `performance` activities are not supported in the underlying SCORM API wrapper, therefore SCORM interactions tracking is not currently supported for this component.

# Rationale

The existing PPQ component was found to have the following problems:

1. Changing orientation resets pins - unnecessary when image and aspect not affected (usability)
2. Resizing browser window breaks pin positions (bug)
3. Possible to overlap pins (usability)
4. Attempting to move a pin to a target that already has a pin sends pin back to original position (information leak)
5. Cannot add new pin if selected position is in a target that already has a pin (usability)
6. Broken restore user answer functionality
7. Uses deprecated (and removed) properties e.g. _isInteractionsComplete
8. Does not follow modern conventions (e.g. missing superclass overrides)
9. Does not handle restoring desktop answers in mobile and vice versa
10. Lots of unnecessary string parsing and positional conversions
11. Additional issues listed on GitHub

It was decided that a rewrite would be the best course of action to address these problems.

# The new PPQ component

At present most of the problems of the original component have been addressed. Points 3 and 9 will be resolved shortly as follows:

## 3 Possible to overlap pins

A user can drop an active pin near or directly onto an incumbent pin.

A configuration will allow the author to specify a level of sensitivity that determines if two pins should be considered overlapping. This sensitivity will be based on the percentage difference in their respective positions. If two pins overlap a policy property will determine whether the active pin is returned to its origin or "nudged" to the side of the incumbent pin. If the pin is "nudged" it will be moved along the vector defined by the two pins' positions.

**UPDATE**: this is unlikely to be implemented due to complexity (mainly due to edge cases). It would be better to consider indicating overlapping pins visually (e.g. a different opacity).

## 9 Does not handle restoring desktop answers in mobile and vice versa

A user may complete the component on desktop and then view the component on mobile (or vice versa). This only becomes an issue if two separate images have been specified for desktop/mobile that have different content/targets and/or different aspect ratios. The problem was discussed in group and the following approach has been agreed:

1. If user has completed component on a desktop and views it on mobile, the component simply shows a message to explain that “the component has been completed on [mobile|desktop]”.
2. If the component has multiple attempts and the user has made one attempt on desktop and then views the component on mobile, the component should reset the user answer (but preserving attempt count).

**UPDATE**: this has now been resolved, but point 2 has not been implemented because (i) if the user answers correctly, it is counter-intuitive to reset the component and goes against the standard behaviour of Adapt questions and; (ii) if the user has not answered correctly and has attempts remaining the component is automatically reset by the question superclass anyway.

## Notes

- For data persistence efficiency pin positions are rounded to 2 d.p. (pixel accuracy for up to 10000px x 10000px images) - the values are factored up to allow storage as integers (due to serializer support and better encoding efficiency)

# Configuration

`_minSelection` (`number`): the minimum number of pins the user must add before being able to submit. Optional.
`_maxSelection` (`number`): the maximum number of pins the user can add to the image. Optional.

`_resetPinsOnPinboardChange` (`boolean`): set to `true` if the image content/aspect ratio varies between the desktop and mobile pinboards. If the user completes the question on one pinboard (e.g. desktop) and later attempts to view the question on the other pinboard (e.g. mobile) a message will be displayed in place of the pinboard. This message can be configured in `course.json` via the `_globals._components._ppq.otherDeviceCompletionMessage` property. Optional.

`_pinboardDesktop` (`object`): the image to use when the component is displayed on a desktop-sized display
- `src` (`string`): path to image
- `alt` (`string`): alt text
- `title` (`string`): image title

`_pinboardMobile` (`object`): the image to use when the component is displayed on a mobile-sized display
- `src` (`string`): path to image
- `alt` (`string`): alt text
- `title` (`string`): image title

`_items` (`array`): a list of areas, in each of which the user is expected to place a single pin
- `left` (`number`): left position (x-coordinate) of area (percentage)
- `top` (`number`): top position (y-coordinate) of area (percentage)
- `width` (`number`): width of the area (percentage)
- `height` (`number`): height of the area (percentage)
