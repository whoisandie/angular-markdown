describe('Test markdown editor: basics', function (){

  var defaults = null, options = null;
  var configOne = {};

  var configTwo = {
    gfm: true,
    toolbar: ['bold', 'italic'],
    statusbar: false
  };

  it('should be configurable', function(){
      module(function($markdownProvider){
        expect($markdownProvider.config()).toBeDefined();
      });
  });

  it('should have a default config when no options passed', function(){
    module(function($markdownProvider){
      defaults = $markdownProvider.defaults;
      $markdownProvider.config(configOne);
      options = $markdownProvider.defaults;
      expect(defaults).toEqual(options);
    });

    defaults = null; options = null;
  });

  it('should be configurable and be different from default', function(){
    module(function($markdownProvider){
      defaults = $markdownProvider.defaults;
      $markdownProvider.config(configTwo);
      options = $markdownProvider.defaults;
      expect(defaults).not.toEqual(options);
    });

    defaults = null; options = null;
  });

});