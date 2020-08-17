


# adapt-aboutUs

An Adapt extension that adds to the Drawer information about the sponsoring organization.
![An example of the aboutUs extension.](https://github.com/chucklorenz/adapt-aboutUs/raw/master/clip.png "example aboutUs")  

## Usage

This extension adds an item to the Drawer. All text is replaceable/customizable. Graphic/logo that appears in front of the organization is optional. Social media links are optional, but are restricted to the icons available within the extension (see list below). Between the name of the organization and the social media links, any number of title/description items maybe configured. The above titles ("Our Mission," "Contact Us," "Find Us," "Partner with Us") are simply examples. What is seen in the image above is simply an example.

## Installation

* With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:  
`adapt install adapt-aboutUs`

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:  
    `"adapt-aboutUs": "*"`  
    Then running the command:  
    `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

* **About Us**  may be installed using [Plugin Management](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  
<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

The attributes listed below are used in *course.json* to configure **About Us**, and are properly formatted as JSON in [*example.json*](https://github.com/chucklorenz/adapt-aboutUs/blob/master/example.json).  

#### _aboutUs

The name of the extension object as used in the `course.json` file.

#### _isEnabled  
Enable or disable **About Us** by setting this property to `true` or `false`.

#### title, description

The short texts that appear when the Drawer opens. They link to the example view seen in the image above.

#### headline  

The text of the first line that appears to the right of the optional graphic. Typically this would be the name of the organization/company. Its width is set to 87% in order to accommodate the `_graphic`. It expands to 100% when no `_graphic.src` is provided. This style can be altered in `aboutUs.less`.

#### _graphic

The optional image that appears to the left of the organization's name (the `headline`). *An example image is included (ex-logo.png). Its dimensions are 30px x 30px.*

>##### src
>The path to the image. If it is not provided, no image will be displayed.  

>##### alt
>The content of image's `alt` attribute.

#### _aboutUsItems
A list of any number of title/description text pairs that appears between the company name and the social links.

>##### title
>The text that appears as a section header and that toggles open and close the text that appears below it. HTML is acceptable.  

>##### description
>The text that appears below the `title`. It is open and closed when the user clicks on its `title`. HTML is acceptable.

#### _socialLinks
Optional icons linked to social media/networking accounts.
>##### _service
>The name of the social media service. The extension's code will link the `_service` to its icon; therefore, it must be spelled exactly as it appears in this list:

| Supported Services |  |  |  |  |
| ------ | ------ | ------ | ------ | ------ |
| Twitter | Facebook | LinkedIn | GooglePlus | YouTube |
|Pinterest|Instagram|Vimeo|flickr|Picasa|
|Lanyrd|DeviantArt|Steam|Blogger|Tumblr|
|SoundCloud|XING|Feed|qq|sina-weibo|
|tengxun-weibo|wechat|youku|||

>##### _link  
>The URL that will be followed if a user clicks on the icon. It should take the form of a fully qualified internet address, including any parameters that identify the account. If the `_link` is not provided, the icon will not be displayed. If you don't want any icons to appear, don't provide any `_links`. You can, in fact, omit from `course.json` the complete `_socialLinks` section.

## Limitations
 
 - Accessibility and RTL support have not been thoroughly tested.
 
## Thanks 
Thanks to [Zheng Xu](https://github.com/samumist) for the addition of Chinese services.

----------------------------
**Version number:**  2.0.0     
**Framework versions:**  5+ 




