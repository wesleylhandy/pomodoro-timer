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

  $("#start").click(function(){

    //get values of times
    sessionTime = parseInt($("#session-counter").data("minutes"));
    breakTime = parseInt($("#break-counter").data("minutes"));

    startSessions(sessionTime, breakTime);
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
      $("#countdown-clock").animate({opacity: 1}, 1000);
      $("body").css("animation", "startDay 3s");
      $("#day").css("animation-delay", "3s").css("animation", dayAnimation);
      $("#sun").css("animation-delay", "3s").css("animation", sunAnimation);
      $("#day").css("display", "inherit");
      countdownClock.time = sessionTime * 60;
      countdownClock.start();
    }

    function startNight() {
      $("body").css("animation", "startNight 3s");
      $("#day").css("display", "none");
      $("#night").css("animation-delay", "3s").css("animation", nightAnimation);
      $("#moon").css("animation-delay", "3s").css("animation", moonAnimation);
      $("#night").css("display", "inherit");
      countdownClock.time = breakTime * 60; //from min to s
      countdownClock.start();
    }

    function returnToStart() {
      $("#countdown-clock").animate({opacity: 0}, 1000);
      $("#night").hide("slow")
      $("#input-form").css("opacity",1).show('slow');
      $("#break").show('slow');
      $("#session").show('slow');
      $("#start").show('slow');
    }

    var convertedTime = (sessionTime * 60000) + 1000; //from min to ms + delays
    var nightTimer = setTimeout(startNight, convertedTime);
    convertedTime += (breakTime * 60000);
    var finishTimer = setTimeout(returnToStart, convertedTime);
    startDay();
    
  }

  var tick;
  
  var countdownClock = {

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