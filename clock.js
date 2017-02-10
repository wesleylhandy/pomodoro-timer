$(document).ready(function(){
  var alarm = false;

  if(window.screen.width > 575) {
    var left = ((window.screen.width - 575)/2) + "px";
    console.log(left);
    $("#input-form").css("left", left);
    $("#sun").css("left", left);
  } else {
    $("#input-form").css("left", 0).css("height", window.screen.width).css("width", window.screen.width);
    $("#sun").css("left", 0).css("height", window.screen.width).css("width", window.screen.width);
    $("#countdown-clock").css("left", 0).css("width", window.screen.width);
  }

  $("#hamburger").on("mouseenter", function() {
    $("#hamburger").hide('fast');
    $("#header").show('fast');
  });

  $("#header").on("mouseleave", function(){
    $("#header").hide('fast');
    $("#hamburger").show('fast');
  });
  
  $(".up").click(function(){
    var typeCounter = "#" + $(this).data("period") + "-counter";
    var typeCount = "#" + $(this).data("period") + "-count";
    var count = parseInt($(typeCounter).data("minutes"));
    count++;
    console.log(count);
    $(typeCounter).data("minutes", count);
    $(typeCount).html(count);
  });

  $(".down").click(function(){
    var typeCounter = "#" + $(this).data("period") + "-counter";
    var typeCount = "#" + $(this).data("period") + "-count";
    var count = parseInt($(typeCounter).data("minutes"));
    count--;
    if (count === 0) {
      count = 1;
    }
    console.log(count);
    $(typeCounter).data("minutes", count);
    $(typeCount).html(count);
  });

  var breakTime;
  var sessionTime;
  var startClicked = false;

  $("#start").click(function(){
    if (!startClicked) {
      //get values of times
      startClicked = true;
      sessionTime = parseInt($("#session-counter").data("minutes"));
      breakTime = parseInt($("#break-counter").data("minutes"));

      startSessions(sessionTime, breakTime);
    }
  });

  function startSessions(sessionTime, breakTime) {
    var dayTime = sessionTime * 60 + "s";
    var dayAnimation = "daySky " + dayTime;
    var sunAnimation = "sunRise " + dayTime;
    var nightTime = breakTime * 60 + "s";
    var nightAnimation = "nightSky " + nightTime;
    var moonAnimation = "moonRise " + nightTime;

    function startDay () {
      $("#break").css("display", "none");
      $("#session").css("display", "none");
      $("#start").css("display", "none");
      $("#input-form").animate({opacity: 0}, 1000, function() {
        $("#input-form").css("display", "none");});
      $("#countdown-clock").css("display", "inherit").animate({opacity: 1}, 1000);
      $("body").css("animation", "startDay 3s");
      $("#day").css("animation-delay", "3s").css("animation", dayAnimation);
      $("#sun").css("animation-delay", "3s").css("animation", sunAnimation);
      $("#day").css("display", "inherit");
      countdownClock.time = sessionTime * 60;
      countdownClock.start();
    }

    function startNight() {
      countdownClock.stop();
      chime.sound.play();
      var fade = setTimeout(chime.fadeout, 2000);
      $("body").css("animation", "startNight 3s");
      $("#day").css("display", "none");
      $("#night").css("animation-delay", "3s").css("animation", nightAnimation);
      $("#moon").css("animation-delay", "3s").css("animation", moonAnimation);
      $("#night").css("display", "inherit");
      countdownClock.time = breakTime * 60; //from min to s
      countdownClock.start();
    }

    function returnToStart() {
      bell.ring.play();
      var fade = setTimeout(bell.fadeout, 2000);
      $("#countdown-clock").animate({opacity: 0}, 1000);
      $("#night").hide("slow")
      $("#input-form").css("opacity",1).show('slow');
      $("#break").show('slow');
      $("#session").show('slow');
      $("#start").show('slow');
      startClicked = false;
    }

    var convertedTime = (sessionTime * 60000) + 1000; //from min to ms + delays
    var nightTimer = setTimeout(startNight, convertedTime);
    convertedTime += (breakTime * 60000);
    var finishTimer = setTimeout(returnToStart, convertedTime);
    startDay();
    
  }

  var tick;
  
  const countdownClock = {

    time: 0,

    start : function() {
        tick = setInterval(countdownClock.countdown, 1000);
      },

    stop : function() {
      clearInterval(tick);
    },

    countdown : function() {
      countdownClock.time--;
      let currentTime = countdownClock.timeConverter(countdownClock.time);
      $("#countdown-clock").html(currentTime);
      if (countdownClock.time === 0) {
          countdownClock.stop();
      }
    },

    timeConverter: function(t) {
        //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
        var hours = Math.floor(t/3600);
        var minutes = Math.floor((t - (hours * 3600))/60);
        var seconds = t - (hours * 3600)- (minutes * 60);

        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        if (minutes === 0) {
          minutes = "00";
        }

        else if (minutes < 10) {
          minutes = "0" + minutes;
        }

        if (hours === 0) {
          hours = "00"
        }

        else if (hours < 10) {
          hours = "0" + hours;
        }

        return "<span class='clock'>" + hours + "</span>&nbsp;:&nbsp;<span class='clock'>" 
                  + minutes + "</span>&nbsp;:&nbsp;<span class='clock'>" 
                  + seconds + "</span>";
      }
  }

});

//set up audio
let vol = 1.0, //initial volume setting
  interval = 250; //interval used in music.fadeout();

const bell = {
  ring: new Audio ("doorbell-1.mp3"),
  fadeout: function() {
        let fade = setInterval(
          function() {
            // Reduce volume by ~.10 as long as it is above 0
            if (vol > 0.05) {
              vol -= 0.04999;
              bell.ring.volume = vol;
            }
            else {
              // Stop the setInterval when 0 is reached
              clearInterval(fade);
              vol = 1.0;
              bell.ring.volume = vol;
            }
          }, interval)
      }
}

const chime = {
  sound: new Audio ("wind-chime-2.mp3"),
  fadeout: function() {
        let fade = setInterval(
          function() {
            // Reduce volume by ~.10 as long as it is above 0
            if (vol > 0.05) {
              vol -= 0.04999;
              chime.sound.volume = vol;
            }
            else {
              // Stop the setInterval when 0 is reached
              clearInterval(fade);
              vol = 1.0;
              chime.sound.volume = vol;
            }
          }, interval)
      }
}
