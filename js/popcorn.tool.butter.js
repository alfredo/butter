(function($){

  $(function(){

    var p = Popcorn('#video')
      .image({
        start   : 1,
        end     : 8,
        target  : 'image-container',
        src     : 'http://upload.wikimedia.org/wikipedia/en/0/06/MMPR_Logo.png'
      })
      .image({
        start   : 12,
        end     : 19,
        target  : 'image-container',
        src     : 'http://upload.wikimedia.org/wikipedia/en/0/06/MMPR_Logo.png'
      })
      .image({
        start   : 29,
        end     : 50,
        target  : 'image-container',
        src     : 'http://upload.wikimedia.org/wikipedia/en/0/06/MMPR_Logo.png'
      })
      .image({
        start   : 54,
        end     : 100,
        target  : 'image-container',
        src     : 'http://upload.wikimedia.org/wikipedia/en/0/06/MMPR_Logo.png'
      })

      .text({
        start   : 9,
        end     : 22,
        target  : 'text-container',
        text     : 'testing'
      })
    ;

    var track1 = $('.track1').track({
      target  : $('#video'),
      duration: 100
    });

    var track2 = $('.track2').track({
      target  : $('#video'),
      duration: 100
    });

    var zoomBar = $('.zoomBar').track({
      duration     : 100,
      mode         : 'smartZoom',
      linkedTracks : [ track1, track2 ]
    });





    var cap = function( aString ){
      return aString.charAt(0).toUpperCase() + aString.slice(1);
    };

    //// EVENT EDITOR //////////////////////////////////////////////////////////

    eventEditor = $('#event-editor');
    eventEditor.tabs();
    eventEditor.css({display:'none'});
    //eventEditor.find('button.OK').click(function(){ editEventOK(); });
    //eventEditor.find('button.Apply').click(function(){ editEventApply(); });
    //eventEditor.find('button.Cancel').click(function(){ editEventCancel(); });

    var selectedEvent = null,
        lastSelectedEvent = null;

    var editEventOK = function(){
      editEventApply();
      eventEditor.dialog('close');
    };

    var editEventApply = function(){
      var popcornEvent = selectedEvent.popcornEvent,
          manifest = popcornEvent.natives.manifest;
      for( var i in manifest.options ){
        popcornEvent[i] = selectedEvent.manifestElems[i].val();
      }
      selectedEvent.inPoint = popcornEvent.start;
      selectedEvent.outPoint = popcornEvent.end;
      selectedEvent.parent._draw();
    };

    var editEventCancel = function(){
      var popcornEvent = selectedEvent.popcornEvent;
      for( var i in selectedEvent.previousValues ){
        popcornEvent[i] = selectedEvent.previousValues[i];
      }
      selectedEvent.inPoint = popcornEvent.start;
      selectedEvent.outPoint = popcornEvent.end;
      selectedEvent.parent._draw();
      eventEditor.dialog('close');
    };
   

    var editTrackEventCallback = function editTrackEventCallback(){

      try{ eventEditor.dialog('close'); }
      catch(e){ if(console && console.log){ console.log(e); } }
      
      selectedEvent = this;      

      var manifest    = selectedEvent.popcornEvent.natives.manifest,
          about       = manifest.about,
          aboutTab    = eventEditor.find('.about'),
          options     = manifest.options,
          optionsTab  = eventEditor.find('.options'),
          elemType,
          input,
          label,
          opt
      ;

      aboutTab.children('*').remove(); // Rick, not sure if this is good practice here. Any ideas?
      $('<h3/>').text(about.name).appendTo(aboutTab),
      $('<p/>').html('<b>Version:</b> '+about.version).appendTo(aboutTab);
      $('<p/>').html('<b>Author:</b> '+about.author).appendTo(aboutTab);
      $('<a/>').html('<b>Website:</b> <a href="'+about.website+'">'+about.website+'</a>').appendTo(aboutTab);
      
      optionsTab.children('*').remove(); // Rick, not sure if this is good practice here. Any ideas?
      for(var i in options){
        var opt = options[i],
            elemType = opt.elem,
            elemLabel = opt.label
        ;
        elem = $('<'+elemType+'/>');
        if( !selectedEvent.manifestElems ){ selectedEvent.manifestElems = {}; }
        if( !selectedEvent.previousValues ){ selectedEvent.previousValues = {}; }
        
        selectedEvent.manifestElems[i] = elem;
        
        if(lastSelectedEvent != selectedEvent){
          selectedEvent.previousValues[i] = selectedEvent.popcornEvent[i];
        }
        
        if(elemType === 'input'){
          label = $('<label/>').attr('for', elemLabel).text(elemLabel);
          elem.val( selectedEvent.popcornEvent[i] );
          elem.appendTo(label);
          label.appendTo(optionsTab);
        }
      }

      lastSelectedEvent = this;

      eventEditor.dialog({
        title: 'Edit ' + cap(this.type) + ' Event',
        buttons: {
          //'Delete': editEventDelete,
          'OK'    : editEventOK,
          'Apply' : editEventApply,
          'Cancel': editEventCancel
        }
      });
    };



    var trackEventsByStart = p.data.trackEvents.byStart, i_trackEvent, type;

    for(var i=1, l=trackEventsByStart.length; i< l; i++){
      i_trackEvent = trackEventsByStart[i];
      type = i_trackEvent.natives.type;

      if( type === "image" ) {

        track1.track( 'addTrackEvent', {
            inPoint           : i_trackEvent.start,
            outPoint          : i_trackEvent.end,
            type              : type,
            popcornEvent      : i_trackEvent,
            popcorn           : p,
            editEvent         : function(){ editTrackEventCallback.call(this); }
        });

      } else if( type === "text" ) {

        track2.track('addTrackEvent', {
          inPoint             : i_trackEvent.start,
          outPoint            : i_trackEvent.end,
          type                : type,
          popcornEvent        : i_trackEvent,
          popcorn             : p,
            editEvent         : function(){ editTrackEventCallback.call(this); }
        });

      }
    }

  });

})(jQuery);