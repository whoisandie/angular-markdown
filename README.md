ngMarkdown (βeta)

------

> Full-Blown-Fully-Configurable Markdown Service

##Overview
An [AngularJS](https://angularjs.org) module that integrates a full-blown, fully configurable Markdown editor
into your angularjs applications. Contains a simple directive and a service.

ngMarkdown isn't a WYSISYG editor. Its just a plain text markdown editor, with a few extra few features enabled.
Depends on [CodeMirror](https://codemirror.net)(customized, minimized & built into the project), [Marked](https://github.com/chjj/marked) & [AngularJS](https://angularjs.prg) projects.

Inspiration from [Lepture](https://github.com/lepture/editor) was the kickstart of the project.

**NOTE:** The module is still under its beta development. Please keep checking the master branch for changes.

---------

## Quickstart
- Install ngMarkdown using bower

```bash
$ bower install ngMarkdown -save
```

- Include the required libraries in your applications index page

```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/marked/lib/marked.js"></script>
```

- Inject the module into your angularjs application

```javascript
var app = angular.module('app', ['ngMarkdown']);
```

- To configure the editor on config phase, use the `$markdownProvider`

```javascript
app.config(function($markdownProvider){
  $markdownProvider.config({
    gfm: false,
    toolbar: false,
    statusbar: false,
    ...
  });
});
```

Options will be coming soon.

- Use the markdown directive where ever you want the editor to be placed

```html
<body ng-app="app">
  <markdown class="post"></markdown>
</body>
```

---------

## Developers
Clone the repo using `git clone https://github.com/whoisandie/ngMarkdown.git`.
ngMarkdown builds are automated by `gulp` and tested by `karma`.

Run the below two commands to get started.

```bash
$ npm install
$ gulp
```

You can build the latest version of ngMarkdown using

```bash
$ gulp build
```

As mentioned earlied, all the module is tested by karma. Run the tests using

```bash
$ gulp test
```

---------

##Contribution
Want to make a contribution ? Cool! Fork the repo, tweak, add your changes, submit a pull request :)
And yes contributions will be appreciated !

##License
The MIT License (MIT)

Copyright (c) 2014 Bhargav Anand

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.