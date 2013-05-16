function Comet(url) {
  var element = $({});
  var etag = 0, lastModified = 0;
  var retries = 0;
  var cometOptions = {
    retryAttempts: 10,
    retryPeriod: 30,
  }
  var ajaxOptions = {
    url: url,
    type: 'GET',
    async: true,
    dataType: 'json',
    success: function(obj, status, xhr) {
      element.trigger('comet.all', obj);
      retries = 0;
      runner();
    },
    complete: function(xhr, status) {
      etag = xhr.getResponseHeader("ETag");
      lastModified = xhr.getResponseHeader("Last-Modified");
    },
    error: function() {
      if (retries < cometOptions.retryAttempts) {
        retries++;
        setTimeout(runner, cometOptions.retryPeriod*1000);
      }      
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("If-None-Match", etag);
      xhr.setRequestHeader("If-Modified-Since", lastModified);
    },
  };
  var runner = function() {
    $.ajax(ajaxOptions);
  }
  runner();

  this.option = function(name, value) {
    if (typeof value === "undefined") {
      return cometOptions[name];
    } else {
      return cometOptions[name] = value;
    }
  }
  
  this.on = function(handler) { 
    element.on('comet.all', handler); return this;
  }
}

jQuery.extend({
  comet: function(url) {
    if ($(window).data('comet') === undefined) {
      $(window).data('comet', new Comet(url))
    }
    return $(window).data('comet');
  }
});
