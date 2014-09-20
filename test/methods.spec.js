describe('Test markdown editor: methods', function (){

  // implement and test other stuff like
  // image, link, ul, ol, etc...
  var md, heading;

  beforeEach(module('ngMarkdown'));
  beforeEach(inject(function($markdown){
    var html = '<div class="ng-markdown"><textarea></textarea></div>';
    var elem = angular.element(html);
    md = $markdown({
      element: elem
    });

    spyOn(md, 'html').andCallThrough();
    heading = md.html('#heading');
  }));

  it('should not be null when initialized', function(){
    expect(md).not.toBeNull();
  });

  it('should call method html on it', function(){
    expect(md.html).toHaveBeenCalled();
  });

  it('should call method html passed with argument', function(){
    expect(md.html).toHaveBeenCalledWith('#heading');
  });

  it('should return valid html when markdown passed', function(){
    expect(heading).toEqual('<h1 id="heading">heading</h1>\n');
  });

});