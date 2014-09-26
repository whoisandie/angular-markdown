angular.module('ngMarkdown', []);

/**
 * The markdown editor provider which can
 * be fully configurable during the config
 * phase of initializing the app
 */
angular.module('ngMarkdown').provider('$markdown', function(){

  this.defaults = {
    gfm: true,
    toolbar: ['bold', 'italic', 'strike', 'header', 'quote', 'ul', 'ol', 'link', 'image', 'video', 'code'],
    statusbar: ['lines', 'words', 'cursor']
  };

  this.config = function(config){
    this.defaults = angular.extend({}, this.defaults, config);
  };

  // Inject all required providers in the $get function
  this.$get = function($window){
    var defaults = this.defaults, EditorFactory;
    EditorFactory = function(config){
      var options = angular.extend({}, defaults, config), $editor;
      $editor = new Editor(options);

      $editor.html = function(text){
        if($window.marked){
          return marked(text);
        }
      };

      return $editor;
    };

    angular.extend(EditorFactory.prototype, Editor.prototype);

    return EditorFactory;
  };
});

/**
 * Directive to be used
 * Use it in your html document as shown below
 * E.g. <markdown class="post-content></markdown>
 */
angular.module('ngMarkdown').directive('markdown', function($markdown){
  return {
    restrict: 'EA',
    replace: true,
    template: '<div class="ng-markdown-wrap"><textarea></textarea></div>',
    link: function(scope, elem){
      $markdown({
        element: elem
      });
    }
  };
});