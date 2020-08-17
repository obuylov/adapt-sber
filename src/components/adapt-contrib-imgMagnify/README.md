# adapt-contrib-imgMagnify

This component is basically a contrib-graphic component with notify if needed which turns an image into one that can be magnified or zoomed into.

---

<img src="https://raw.githubusercontent.com/mike-st/adapt-contrib-imgMagnify/master/img-magnify.jpg" alt="Adapt Image Magnify Component" width="800" height="600" border="10" />

## Usage

This component also takes advantage of the notify ability. To show a notify when an anchor is clicked, it must have an `id`:
```
<a id='test' href='#'>link text</a>
```

Use the `_popupData` object to specify the text shown in the notify. The key value in `_popupData` must match the `id` in bodyText.
```
"_popupData": {
  "test": {
      "title": "Test!",
      "message": "This text will show when an a tag with the id 'test' is clicked."
  }
}
```
