---
layout     : post
title      : "Blogging in Browser Mode"
date       : 2022-08-19
categories : RMIT CCS
---

If you have not yet managed to get Jekyll to initialise a new blog on your machine, I have some good news -- you can set up your blog, customise it, add posts, etc. entirely through the browser.

#   Initialising your blog

If you already have a github repo named `username.github.io` - delete it.  You can find instructions about how to delete a repo [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/deleting-a-repository).

Then go [here](https://github.com/capogreco/fresh_jekyll), and click **Use this template**.  Alternatively, you should be able to just click [here](https://github.com/capogreco/fresh_jekyll/generate).

In either case, you should be asked to give the new repo a name -- give it the name `your-username.github.io`, where `your-username` is your github username.

After few minutes, the blog should be live at the URL: `your-username.github.io`

#   Customising your blog

Navigate back to your blog repo on `github.com`, and press `.`

This should open VS Code *in the browser*.  

If the file explorer is not already open on the left, `cmd` + `shift` + `E` should open it.

Click on `_config.yml`.  You can change the title and description of the blog here, as well as your github and twitter usernames, etc.

#   Adding a post

Right click on the `_posts` directory, and select **New File**.

Give it a name that conforms to the format: `YYYY-MM-DD-some_creative_title.md`

Paste at the top of the blank page the following front-matter:

```yaml
---
layout     : post
title      : "Blogging in Browser Mode"
date       : 2022-08-19
categories : RMIT CCS
---
```

Choose a title and category for your post, and change the date to be whatever the date is.

Underneath, you can write your blog post in markdown.  You can learn markdown's basic syntax [here](https://www.markdownguide.org/basic-syntax/), and some extended techniques [here](https://www.markdownguide.org/extended-syntax/).

#   Embedding a p5 sketch

To embed a p5 sketch, navigate to the sketch in the p5 online editor, and go to **File** -> **Share**.  Click **Embed** to copy the relevant html to your clipboard.  Take note of the dimensions of the sketch.

Copy the clipboard into your markdown file.  It should look something like this:

```html
<iframe src="https://editor.p5js.org/capogreco/full/CLb2LWbBU"></iframe>
```

As is, this will render an iframe that is too small:  

<iframe src="https://editor.p5js.org/capogreco/full/CLb2LWbBU"></iframe>


To adjust the size, add `width` and `height` parameters inside the opening `<iframe>` tag, like this:

```html
<iframe width=400 height=442 src="https://editor.p5js.org/capogreco/full/CLb2LWbBU"></iframe>
```

The value for `width` will be the width of the canvas you created in the p5 sketch.  The `height` will be the height of the canvas, plus 42 pixels, to account for the p5 header that comes with the embed.

<iframe width=400 height=442 src="https://editor.p5js.org/capogreco/full/CLb2LWbBU"></iframe>

#   Commit & Push

When you have finished, hit `shift` + `ctrl` + `G` to go to source control (or click the source control icon on the left).

Type a commit message, like `github pages blog init, first post`, and press `ctrl` + `enter` on Windows (or `cmd` + `enter` on macOS) to commit and push.
