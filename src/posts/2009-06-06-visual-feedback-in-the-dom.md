---
layout : post 
title: Visual feedback in the DOM
categories: jquery mouse
summary: Playing around with jQuery
---
Sometimes it's nice to be able to give users visual feedback when they hover their mouse over an element on the page. It's easy to do, of course, with a little CSS:

```css
#hover-demo1 p:hover { background: #ff0; }
```

That little style rule changes the background of any paragraph that is a descendant of an element with `id="hover-demo"` to a nice bright yellow — but only when you hover your mouse over it. So, if that's all there is to it, what does this have to do with jQuery?

Unfortunately, (yep, you guessed it) Internet Explorer 6 and below don't support the `:hover` pseudo-class. Bummer!

We could just leave it alone at this point and figure that people using real browsers will be rewarded with a little extra eye candy. On the other hand, maybe the right thing to do is to have mercy on the downtrodden. After all, even IE 6 users arguably have some aesthetic sense.

With a few lines of jQuery (one line, actually, if you don't care about making it readable) we can provide the hover effect to those using IE 6 or below, as long as they have JavaScript enabled. We also might as well keep the CSS rule in the stylesheet. Now, the only people who won't see the hover state change are those using Internet Explorer 6 (or below) with JavaScript off. Well, if they're using any browser with JavaScript and CSS turned off, they won't see it either. But that sort of folk ain't hankerin' for the eye candy anyway.

First, we give a simple class the same background as the aforementioned `:hover` pseudo-class:
```css
.pretty-hover, #hover-demo1 p:hover {
  background: #ff0;
}
```

Next, we use jQuery to add `class="pretty-hover"` to each paragraph when the user hovers over it:

```javascript
$('#hover-demo2 p').hover(function() {
  $(this).addClass('pretty-hover');
  }, function() {
  $(this).removeClass('pretty-hover');
});
```

Note: We switched to a different id here so that IE 6 users can see the difference between the two hover demos, but the idea is that you would use the `.hover()` method on the same elements that you applied the `:hover` pseudo-class to.

That's it! Give it a whirl:

If you'd like to replicate the look of a hovered link, you can add another CSS declaration to the "pretty-hover" class:
```css
.pretty-hover {
  background: #fee;
  cursor: pointer;
}
```

**Update 6/26/2016:** Added syntax highlighting.
