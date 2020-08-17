# adapt-contrib-MultipleNotify

This component is basically a contrib-text which hijacks any anchor tag clicks in the bodyText (`component-body`), and shows a notify popup instead of navigating to the href.

---

**IMPORTANT NOTES**:
- This component is dependant on [this commit](https://github.com/taylortom/adapt_framework/commit/a7af2e3f8713979f3b8933ed6c443f254ec6eb27) to the core framework which is yet to be merged.
- Requires adapt-contrib-text to be installed.**

---

## Usage

To show a notify when an anchor is clicked, it must have an `id`:
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
