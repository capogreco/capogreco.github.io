---
layout     : post
title      : "Jekyll & Markdown"
date       : 2022-08-13
categories : RMIT CCS
---

#   Install Jekyll

[Jekyll](https://jekyllrb.com/) is a static website builder that lets you write blog posts in [markdown](https://www.markdownguide.org/).

I will briefly describe my workflow on macOS.  You can find guides for Windows and Linux [here](https://jekyllrb.com/docs/installation/) - things will work slightly differently, but not *that* differently.  Let me know if you are having trouble getting it to work.

As described [here](https://jekyllrb.com/docs/installation/macos/), on macOS you need to:
1.  **install [Homebrew](https://brew.sh/)** by copying the following into terminal, and pressing enter:
    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
2.  **use Homebrew to install chruby and ruby-install**, by entering the following into terminal:
    ```
    brew install chruby ruby-install
    ```
3.  **use ruby-install to install Ruby**, by entering the following into terminal:
    ```
    ruby-install ruby
    ```
4.  **tell your shell to use chruby**, by copying and pasting each of these commands in terminal:
    -   if your shell is zsh:
        -   ```
            echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc
            ```
        -   ```
            echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc
            ```
        -   ```
            echo "chruby ruby-3.1.2" >> ~/.zshrc
            ```
    -   if your shell is bash:
        -   ```
            echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.bash_profile
            ```
        -   ```
            echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.bash_profile
            ```
        -   ```
            echo "chruby ruby-3.1.2" >> ~/.bash_profile
            ```
    -   if your shell is fish, you may need to do something along the lines of [this](https://talk.jekyllrb.com/t/how-to-setup-chruby-for-fish-shell-instead-of-regular-bash-zsh/7390/2)
5.  **quit and relaunch terminal**
6.  **check if ruby is working**, by typing the following command into terminal:
    -   `ruby -v` -> this should output the version of ruby you have installed
7.  **install Jekyll**, by typing the following command into terminal:
    -   `gem install jekyll bundler`    

Jekyll have a [troubleshooting page](https://jekyllrb.com/docs/troubleshooting/) and a [forum](https://talk.jekyllrb.com/) where you can find information & help from the community.

#   Navigate to your github pages repository (on your computer)

Once Jekyll is installed, make sure you have made a github repository according to [these instructions](https://github.io), and cloned it to a location on your computer.

Navigate to the folder at that location in terminal.  You can do this by using the `cd` or change directory command, in conjunction with `ls`, or list, which will tell you what folders and files are in the current directory, and `pwd`, which will output the path of the present working directory.

Alternatively, you can right click on a folder in finder, and select "New Terminal at Folder".

![New Terminal at Folder](/etc/images/new_terminal_at_folder.png)

If you can't see that option, you can enable it via **System Preferences** -> **Keyboard** -> **Shortcuts** -> **Services** -> enable "**New Terminal at Folder**"

![Services, New Terminal at Folder](/etc/images/services_new_terminal.png)

Now you are at the location of your github pages repo on your computer in terminal, typing `pwd` should return a path that looks something like this:

![github pages repo pwd](/etc/images/blog_pwd.png)

The directory should be named your github username follwed by `.github.io`.

Type `jekyll -v` to make sure your shell can see the jekyll command.

Now type: 
```
jekyll new . --force
```
This should initialise a jekyll project.  In finder, it should look like this:

![fresh jekyll in finder](/etc/images/fresh_jekyll.png)

In terminal, typing `ls` lists the contents of the folder.  It should look something like this:

![fresh jekyll in terminal](/etc/images/fresh_jekyll_ls.png)

Note here the `_posts` folder - this will become important in just a moment.

#   Enable `code .`

In terminal, type `code .` including the space and full stop.  This command is very useful as it should open whole folder in VS Code.

If `code .` does not work, you may need to open VS Code manually, and from inside VS Code, bring up the command pallette by pressing `cmd` + `shift` + `P`, and type `code`.  Select **Shell Command: Install 'code' command in PATH**

![install code in path](/etc/images/install_code_in_path.png)

#   Serving locally with Jekyll

Once the folder is open in VS Code, it should look like this:

![fresh jekyll in vscode](/etc/images/fresh_jekyll_code.png)

Press `cmd` + `tab` to cycle back to terminal, and type `jekyll serve --livereload`

**this did not initially work for me -- I had to install webrick as per [this thread](https://talk.jekyllrb.com/t/load-error-cannot-load-such-file-webrick/5417/6)*

With any luck, your terminal should output something like this:

![fresh serve in terminal](/etc/images/fresh_serve_terminal.png)

Copy the URL next to `Server Adress:`.  It will most likely be `http://127.0.0.1:4000/` or something similar.

Cycle to a browser and open a new tab at that URL.  It should look something like this:

![fresh serve in a browser](/etc/images/fresh_serve_browser.png)

This will be the landing page for your blog.  

Clicking on the post **Welcome to Jekyll!** should take you to a page that looks like this:

![freshly served jekyll post](/etc/images/fresh_serve_post.png)

There are some important bits of information on this page.  Note the first line:

>   You'll find this post in your `_posts` directory.

... and the naming convention for post files:

>   `YEAR-MONTH-DAY-title.MARKUP`

Press `cmd` + `tab` to cycle back to VS Code, and click on the `_posts` folder in the file explorer on the left.  You should see one file, named something like `2022-08-14-welcome-to-jekyll.markdown`.  Click on this file to see its contents in the main VS Code pane:

![fresh post, code](/etc/images/fresh_serve_code.png)

At the top of the file, you should see something like this:
```
---
layout: post
title:  "Welcome to Jekyll!"
date:   2022-08-14 02:17:35 +1000
categories: jekyll update
---
```
^ this is  **front matter**, and you will need it in every post.  Highlight it and copy it to your clipboard with `cmd` + `C`.

#   Making a new post

In VS Code, right-click on the `_posts` folder on the left, and click on **New File**.

![New File, in VS Code](/etc/images/new_file_in_post_folder.png)

Now give it a name that conforms with the naming convention we noted earlier.  Also note that we can use the `.md` file extension, rather than from `.MARKUP`, or `.markdown`.

![New File, named, in VS Code](/etc/images/new_file_in_post_folder_named.png)

Here I have named my file `2022-08-14-new_post_who_dis.md`, but you can name yours whatever you want, so long as it conforms to the convention `YYYY-MM-DD-some_creative_title.md`.

Once the file has a name, press enter.  The empty file should appear on the right.

Paste the front matter we copied onto the clipboard earlier:

![Paste front matter](/etc/images/paste_front_matter.png)

Change the title and category fields, and press `cmd` + `S` to save.

Cycle back to the browser, and navigate back to the landing page by pressing "Your awesome title" or pressing back (or `cmd` + `←`).

You should now have a second blog post, featuring the title you gave to your new file in it's front matter.

![a new post appears](/etc/images/a_new_post.png)

If you click on it, you will notice that this new blog post is empty.

![the new post is empty](/etc/images/a_new_post_empty.png)

We can populate it by writing markdown in this new file.  

Plain text seperated by white space become paragraph elements, and different numbers of hashes, ie. `#`, `##`, `###`, etc. will create different styles of headings.

![populated with markdown](/etc/images/newly_populated_md.png)

Saving the file should cause the post in the browser to update.  This behaviour is because we used the `--livereload` flag when we ran `jekyll serve` earlier -- saving the post file will cause the browser to reload the page, showing the changes you made.

#   Links

Use the syntax `[link text](http://URL)` to create hyperlinks.  Lets create a link to this [markdown cheat sheet](https://www.markdownguide.org/cheat-sheet/).

![markdown link syntax](/etc/images/md_links.png)

... for example, looks like this:

![a link appears](/etc/images/md_links_post.png)

#   Images

Showing an image is slightly more complicated.

First **create a new folder** named `etc` in the root directory of the repo:

![a new etc folder](/etc/images/new_etc_folder.png)

Then, **create another new folder** in `etc`, named `images`:

![a new images folder](/etc/images/new_images_folder.png)

Then, put an image in the images folder.  I'm using a screenshot of my new Jekyll blog post.  Take care to note the name of the image file.  In this example, we will name the image `blogception.png`.

The markdown to show this image would look something like:
```markdown
![blogception](/etc/images/blogception.png)
```

![this image is like inception, but in markdown](/etc/images/blogception_md.png)

... which renders the image like this:

![this image is like inception, but in blog format](/etc/images/blogception.png)

There are a bunch of other things you can do in markdown -- experiment with some of the extended syntax from [here](https://www.markdownguide.org/cheat-sheet/). 

#   Embedding a p5 sketch

Because markdown is converted to `html` behind the scenes, you can also just write `html` directly into a markdown file.

Go [here](https://editor.p5js.org/capogreco/sketches/tg2BVPSKS), and then **File** -> **Share** -> **Embed** to grab the embed html for this p5 sketch.

![p5 share](/etc/images/p5_share.png)

Clicking on the **Embed** field should copy the html to the clipboard.

![p5 embed](/etc/images/p5_embed.png)

Simply paste this html into your markdown file, and save.

![embed is too small](/etc/images/embed_too_small.png)

Unfortunately, the default size for the iframe is too small.  We can fix this by adding `width` and `height` attributes inside the `<iframe>` tag:

```html
<iframe width=576 height=366 src="https://editor.p5js.org/capogreco/full/tg2BVPSKS"></iframe>
```

Here we can set the `width` to the width of the sketch (576 pixels), and the `height` to the height of the sketch (324 pixels), plus 42 pixels to account for the p5 header in the `iframe` element.

![embed adjusted](/etc/images/p5_iframe_embed_adjusted.png)

Save this, and voila -- **embedded p5 sketch**.

![p5 sketch embedded](/etc/images/p5_iframe_embedded.png)

#   Add, commit, push.

Return to terminal, and press `ctrl` + `C` to terminate the jekyll server.

If you are using git in the terminal, add your changes with:

```bash
git add .
```

Then commit your changes with a descriptive message:

```bash
git commit -m 'first post using Jekyll'
```

And finally, push your changes to the github server with:

```bash
git push
```

Once pushed, your changes should go live on the internet within a minute or two.
