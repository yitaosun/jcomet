jcomet
======

jQuery Comet

Small Comet implementation in jQuery.  

Usage:

To subscribe to comet broadcasts at /COMET_PATH

<script>
  $.comet('/COMET_PATH');
  $.comet().on(function(obj) {
    console.log("Comet object received");
    console.log(obj);
  });
</script>
  
