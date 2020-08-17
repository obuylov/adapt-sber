# Hotspot Menu

A menu with absolutely-positioned buttons.

![](https://user-images.githubusercontent.com/922987/43205041-51a6517c-901a-11e8-976d-c7677c000db4.jpg)

## Installation

* Add the [example JSON](example.json) to `contentObjects.json` to position the menu items.
* Specify a background image for the menu by adding the following to `course.json`:
```json
"_hotspotMenu": {
	"_backgroundSrc": ""
}
```
* With [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run `adapt install hotspotMenu`. Alternatively, download the ZIP and extract into the src > menu directory.
* Run an appropriate Grunt task.

## Attributes

### Course

Attribute | Type | Description | Default
--------- | ---- | ----------- | -------
`_backgroundSrc` | String | Background graphic | `""`

### Content object

Hotspot Menu inherits Adapt’s standard [content object](https://github.com/adaptlearning/adapt_framework/wiki/Creating-your-first-course#contentobjectsjson) attributes with the following additions:

Attribute | Type | Description | Default
--------- | ---- | ----------- | -------
`_top` | Number | Vertical position as a percentage | 0
`_left` | Number | Horizontal position as a percentage | 0
