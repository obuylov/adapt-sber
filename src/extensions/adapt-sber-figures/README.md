adapt-article-background
===============

Adds the option to implement a background graphic or colour to a article element.

The graphic defaults to a fullscreen 'cover' to act as a banner (if you implement a 'blank' component within the article).

You can set the min-height of this article to achieve the banner height you require. 

You can also set the 'background-size' and 'background-position' to allow different effects.  

NB: the background height will grow with the height of the components added to the article element.

Full credit for original code goes to Dave Gosling (https://github.com/davegosling/adapt-block-background).

Usage
------


##Settings overview

Extends article data/model

####_articleBackground

Article background options object


####_articleBackground.src

This is the background image source used when page is viewed at desktop resolution

####_articleBackground.mobileSrc

This is the background image source used when page is viewed at mobile resolution

####_articleBackground.bannerHeight

This is the min-height of the article element when the page is viewed at desktop resolution

####_articleBackground.mobileBannerHeight
This is the min-height of the article element when the page is viewed at mobile resolution

####_articleBackground.backgroundSize

This is mapped to the background-size css attribute. Options are "cover", "auto" or "contain"

####_articleBackground.backgroundPosition

This is mapped to the background-position css attribute.  Options are "left","right","center","top","bottom".

####_articleBackground.backgroundRepeat

This is mapped to the background-repeat css attribute.  Options are "repeat","repeat-x","repeat-y","no-repeat".

####_articleBackground.backgroundColor

This is mapped to the background-color css attribute.

##Limitations

Background-position is limited to preset pairs of "left", "center", "right", "top", "bottom"

Background-size is limied to "cover","auto","contain".

##Browser spec

To Be Completed
