var shortcuts = {
  bold: 'Cmd-B',
  em: 'Cmd-I',
  strike: 'Cmd-Alt-S',
  header: 'Cmd-Alt-H',
  quote: "Cmd-'",
  link: 'Cmd-L',
  image: 'Cmd-Alt-I',
  ol: 'Cmd-Alt-O',
  ul: 'Cmd-Alt-U',
  undo: 'Cmd-Z',
  redo: 'Cmd-Y',
  save: 'Cmd-S'
};

var isMac = /Mac/.test(navigator.platform);

function Editor(config){
  this._init(config);
}

Editor.prototype.markdown = function(text) {
  if(!this.marked) return;

  var renderer = new marked.Renderer();
  renderer.heading = function(text, level){
    return '<h' + level + '>' + text + '</h' + level + '>\n';
  };

  renderer.link = function(href, title, text){
    var out = '<a href="' + href + '" target="_blank"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };

  return marked(text, {renderer: renderer});
};

Editor.prototype._init = function(config){
  this.options = config;
  if(!config.element){
    return;
  }
  if(window.marked){
    this.marked = window.marked;
  }
  this.element = angular.element(this.options.element).find('textarea')[0];
  this._render();
};

Editor.prototype._render = function(){
  var keyMaps = {};

  for(var key in shortcuts){
    if(shortcuts.hasOwnProperty(key)){
      mapToolbarShortcut(keyMaps, key, this);
    }
  }
  keyMaps['Enter'] = 'newlineAndIndentContinueMarkdownList';
  keyMaps['Tab'] = 'tabAndIndentContinueMarkdownList';
  keyMaps['Shift-Tab'] = 'shiftTabAndIndentContinueMarkdownList';

  this.codemirror = CodeMirror.fromTextArea(this.element, {
    mode: 'markdown',
    theme: 'paper',
    tabSize: '2',
    indentWithTabs: true,
    lineNumbers: false,
    lineWrapping: true,
    extraKeys: keyMaps,
    autofocus: true
  });

  if(this.options.toolbar !== false){
    this._createToolbar();
  }

  if(this.options.statusbar !== false){
    this._createStatusbar();
  }

  this.codemirror.refresh();
};

Editor.prototype._action = function(name){
  var cm = this.codemirror;
  var replaceSelection;

  replaceSelection = function(start, end){
    var text, stat, startPoint, endPoint;
    stat = getState(cm);
    startPoint = cm.getCursor('start');
    endPoint = cm.getCursor('end');

    if (stat[name]) {
      text = cm.getLine(startPoint.line);
      start = text.slice(0, startPoint.ch);
      end = text.slice(startPoint.ch);
      // NOTE: Decide on when to toggle and when to convert
      switch(name){
        case 'bold':
          start = start.replace(/^(.*)?(\*|_){2}(\S+.*)?$/, '$1$3');
          end = end.replace(/(\*|_){2}(\s+.*)?$/, '$2');
          startPoint.ch -= 2;
          endPoint.ch -= 2;
          break;
        case 'em':
          start = start.replace(/^(.*)?(\*|_)(\S+.*)?$/, '$1$3');
          end = end.replace(/^(.*\S+)?(\*|_)(\s+.*)?$/, '$1$3');
          startPoint.ch -= 1;
          endPoint.ch -= 1;
          break;
        case 'strike':
          start = start.replace(/^(.*)?(~){2}(\S+.*)?/, '$1$3');
          end = end.replace(/^(.*\S+)?(~){2}(\s+.*)?/, '$1$3');
          startPoint.ch -= 2;
          endPoint.ch -= 2;
          break;
        case 'header':
          start = start.replace(/^(.*)?(#\s?){2}(\S+.*)?/, '$1$3');
          end = end.replace(/^(.*\S+)?(\s?#){2}(\s+.*)?$/, '$1$3');
          startPoint.ch -= 3;
          endPoint.ch -= 3;
          break;
        case 'quote':
          start = start.replace(/^(.*)?(>\s?)(\S+.*)?/, '$1$3');
          end = end.replace(/^(.*\S+)?(\s?)(\s+.*)?$/, '$1$3');
          startPoint.ch -= 2;
          endPoint.ch -= 2;
          break;
        case 'link':
          start = start.replace(/^(.*)?(\[)(\S+.*)?/, '$1$3');
          end = end.replace(/(]\(https?:\/\/(www\.)?([\)]|[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*\))))/, '');
          startPoint.ch -= 1;
          endPoint.ch -= 1;
          break;
        case 'image':
          break;
        case 'film':
          break;
        case 'code':
          break;
        default:
          break;
      }
      cm.setLine(startPoint.line, start + end);
      cm.setSelection(startPoint, endPoint);
      cm.focus();
      return;
    }

    text = cm.getSelection();
    end === null ? end = '' : end = end || start;
    //if (text === '' && start === end) return;
    cm.replaceSelection(start + text + end);

    startPoint.ch += start.length;
    endPoint.ch += start.length;
    cm.setSelection(startPoint, endPoint);
    cm.focus();
  };

  // Implement a save function to save the content
  // hook the function to the outsite world, expose
  // the function as public.
  switch(name){
    case 'bold':
      replaceSelection('**');
      break;
    case 'em':
      replaceSelection('*');
      break;
    case 'strike':
      replaceSelection('~~');
      break;
    case 'header':
      replaceSelection('## ', null);
      break;
    case 'quote':
      replaceSelection('> ', null);
      break;
    case 'link':
      replaceSelection('[', '](http://)');
      break;
    case 'image':
      replaceSelection('![image', '](http://)');
      break;
    case 'flim':
      break;
    case 'code':
      replaceSelection('```\n', '```');
      break;
    case 'undo':
      cm.undo();
      break;
    case 'redo':
      cm.redo();
      break;
    case 'save':
      cm.save();
      console.log(this.markdown(this.element.value));
      break;
    default:
      break;
  }
};

Editor.prototype._createToolbar = function(){
  var toolbar, cm, self;

  if(!this.options.toolbar || this.options.toolbar.length === 0) return;

  self = this;
  cm = this.codemirror;
  toolbar = angular.element('<div />').addClass('ng-markdown-toolbar');

  angular.forEach(this.options.toolbar, function(item){
    var element = self._createToolbarElement(item);
    toolbar.append(element);
  });

  var cmWrapper = cm.getWrapperElement();
  cmWrapper.parentNode.insertBefore(toolbar[0], cmWrapper);
  return toolbar;
};

Editor.prototype._createToolbarElement = function(item){
  var self = this;
  var link = document.createElement('a');
  link.href= 'javascript:void(0)';
  if(typeof item === 'object'){
    link.className = 'icon-' + item.name;
    link.onclick = function(){
      return item.action;
    };
    return link;
  }
  link.className = 'icon-' + item;
  link.onclick = function(){
    return self._action(item);
  };
  return link;
};

Editor.prototype._createStatusbar = function(){

};

function fixToolbarShortcut(text){
  if (isMac) {
    text = text.replace('Ctrl', 'Cmd');
  } else {
    text = text.replace('Cmd', 'Ctrl');
  }
  return text;
}

function mapToolbarShortcut(keyMaps, key, editor){
  keyMaps[fixToolbarShortcut(shortcuts[key])] = function () {
    editor._action(key);
  };
}

function getState(cm, pos){
  pos = pos || cm.getCursor('start');
  var stat = cm.getTokenAt(pos);

  if (!stat.type) return {};

  var ret = {}, data, types;
  types = stat.type.split(' ');
  for (var i = 0; i < types.length; i++) {
    data = types[i];
    switch(data){
      case 'strong':
        ret.bold = true;
        break;
      case 'em':
        ret.em = true;
        break;
      case 'strike':
        ret.strike = true;
        break;
      case 'header':
        ret.header = true;
        break;
      case 'atom':
        ret.quote = true;
        break;
      case 'link':
        ret.link = true;
        break;
      case 'variable-2':
        var text = cm.getLine(pos.line);
        if (/^\s*\d+\.\s/.test(text)) {
          ret['ol'] = true;
        } else {
          ret['ul'] = true;
        }
        break;
      default:
        break;
    }
  }
  return ret;
}