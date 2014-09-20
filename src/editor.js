var shortcuts = {
  bold: 'Cmd-B',
  italic: 'Cmd-I',
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

Editor.prototype._init = function(config){
  this.options = config;
  if(!config.element){
    return;
  }
  this._render();
};

Editor.prototype._render = function(){
  var el = angular.element(this.options.element).find('textarea')[0];
  var keyMaps = {};

  for(var key in shortcuts){
    if(shortcuts.hasOwnProperty(key)){
      mapShortcut(keyMaps, key, this);
    }
  }
  keyMaps['Enter'] = 'newlineAndIndentContinueMarkdownList';
  keyMaps['Tab'] = 'tabAndIndentContinueMarkdownList';
  keyMaps['Shift-Tab'] = 'shiftTabAndIndentContinueMarkdownList';

  this.codemirror = CodeMirror.fromTextArea(el, {
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
    //console.log('Create toolbar here');
  }

  if(this.options.statusbar !== false){
    //console.log('Creating statusbar here');
  }

  this.codemirror.refresh();
};

Editor.prototype._action = function(name){
  var cm = this.codemirror;
  var stat = getState(cm);
  var replaceSelection;

  replaceSelection = function(start, end){
    var text;
    var startPoint = cm.getCursor('start');
    var endPoint = cm.getCursor('end');
    if (stat[name]){
      text = cm.getLine(startPoint.line);
      start = text.slice(0, startPoint.ch);
      end = text.slice(startPoint.ch);
      if (name === 'bold') {
        start = start.replace(/^(.*)?(\*|_){2}(\S+.*)?$/, '$1$3');
        end = end.replace(/^(.*\S+)?(\*|_){2}(\s+.*)?$/, '$1$3');
        startPoint.ch -= 2;
        endPoint.ch -= 2;
      } else if (name === 'italic') {
        start = start.replace(/^(.*)?(\*|_)(\S+.*)?$/, '$1$3');
        end = end.replace(/^(.*\S+)?(\*|_)(\s+.*)?$/, '$1$3');
        startPoint.ch -= 1;
        endPoint.ch -= 1;
      }
      cm.setLine(startPoint.line, start + end);
      cm.setSelection(startPoint, endPoint);
      cm.focus();
      return;
    }
    if (end === null) {
      end = '';
    } else {
      end = end || start;
    }
    text = cm.getSelection();
    cm.replaceSelection(start + text + end);

    startPoint.ch += start.length;
    endPoint.ch += start.length;
    cm.setSelection(startPoint, endPoint);
    cm.focus();
  };

  switch(name){
    case 'italic':
      replaceSelection('*');
      break;
    case 'bold':
      replaceSelection('**');
      break;
    case 'undo':
      cm.undo();
      cm.focus();
      break;
    case 'redo':
      cm.redo();
      cm.focus();
      break;
    default:
      break;
  }
};

function fixShortcut(text) {
  if (isMac) {
    text = text.replace('Ctrl', 'Cmd');
  } else {
    text = text.replace('Cmd', 'Ctrl');
  }
  return text;
}

function mapShortcut(keyMaps, key, editor){
  keyMaps[fixShortcut(shortcuts[key])] = function () {
    editor._action(key);
  };
}

function getState(cm, pos) {
  pos = pos || cm.getCursor('start');
  var stat = cm.getTokenAt(pos);
  if (!stat.type) return {};

  var types = stat.type.split(' ');

  var ret = {}, data, text;
  for (var i = 0; i < types.length; i++) {
    data = types[i];
    if (data === 'strong') {
      ret.bold = true;
    } else if (data === 'variable-2') {
      text = cm.getLine(pos.line);
      if (/^\s*\d+\.\s/.test(text)) {
        ret['ol'] = true;
      } else {
        ret['ul'] = true;
      }
    } else if (data === 'atom') {
      ret.quote = true;
    } else if (data === 'em') {
      ret.italic = true;
    }
  }
  return ret;
}