---
layout     : post
title      : "Jekyll & Markdown"
date       : 2022-08-13
categories : RMIT Creative Coding Specialisation
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

#   Navigate to your github.io repository

Once Jekyll is installed, make sure you have made a github repository according to [these instructions](https://github.io), and cloned it onto your computer.

Navigate to the repository folder in terminal.  You can do this by using the `cd` or change directory command, in conjunction with `ls`, or list, which will tell you what folders and files are in the current directory, and `pwd`, which will output the path of the present working directory.

Alternatively, you can right click on a folder in finder, and select "New Terminal at Folder".

![New Terminal at Folder](/etc/images/new_terminal_at_folder.png)

If you can't see that option, you can enable it via **System Preferences** -> **Keyboard** -> **Shortcuts** -> **Services** -> enable "New Terminal at Folder"

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
