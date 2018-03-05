var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ?";
var realCharacters = _.toArray(characters);
var gameLanguage, gameType, gameQuestions, gamePlayers = {}, currentQuestion;
var languages = {
  finnish: {
    name: "Suomeksi",
    types: {
      classic: "Classic (alkuperäinen versio)",
      tech: "Teknologia"
    }
  },
  swedish: {
    name: "På svenska",
    types: {
      classic: "Classic (den ursprungliga versionen)"
    }
  }
};
var questions = {
  finnish: {
    classic: ["kauppakeskus", "maa"],
    tech: ["ohjelmointikieli", "tietokonevalmistaja"]
  },
  swedish: {
    classic: ["köpcenter", "land"]
  }
};

//Light button
function btn(text, dataname, datavalue){
  return "<button type=\"button\" class=\"btn btn-light btn-lg btn-block\" data-mol-" + dataname + "=" + datavalue + ">" + text + "</button>";
}

//Small dark button
function btnSmall(text, dataname, datavalue){
  return "<button type=\"button\" class=\"btn btn-dark btn-block\" data-mol-" + dataname + "=" + datavalue + ">" + text + "</button>";
}

//Marker-style title
function tell(text){
  return "<h2 class=\"intro\">" + text + "</h2>";
}

//Info-text in the bottom of the page
function tellInfo(text){
  return "<p class=\"text-muted\">" + text + "</p>";
}

//Next page
function $next(info){
  return $(".mol-game").empty().hide().html(tell(info)).fadeIn();
}

//Show info-text at the bottom of the page
function $info(info){
  return $(".mol-info").slideUp().clearQueue().empty().html(tellInfo(info)).slideDown().delay(2000).slideUp();
}

function shuffleCharacters(){
  $(".mol-game").append("<h1 class=\"opacity-half\" id=\"mol-characters\"></h1>");
  $.each(_.sampleSize(_.dropRight(realCharacters), _.random(5, 7)), function(key, values){
    $("#mol-characters").delay(100).fadeOut(100, function(){
      $(this).text(values);
    }).fadeIn();
  });
  //Final character
  $("#mol-characters").fadeOut(100, function(){
    $(this).text(_.sample(realCharacters));
  }).fadeIn().animate({fontSize: "+=3rem", opacity: 1}, 600, "swing", function(){
    $(this).removeClass("opacity-half");
    //Ask for the winner of the round
    $(".mol-game").append("<div class=\"mt-5 opacity-none\" id=\"mol-round\"></div>");
    $("#mol-round").delay(2000).hide(0, function(){
      $(this).append(tell("Kuka oli nopein?"));
      $.each(gamePlayers, function(key, values){
        $("#mol-round").append(btn(key, "winner", key));
      });
      $(this).append(btnSmall("Uusi kirjain", "roll", "go"));
      $("[data-mol-winner]").click(function(){
        gamePlayers[$(this).data("mol-winner")] += 1;
        runRound();
      });
      $("[data-mol-roll]").click(function(){
        $("#mol-round").slideUp(300, function(){
          $(this).remove();
          $("#mol-characters").animate({fontSize: "-=3rem", opacity: 0.5}, 600, "swing", function(){
            shuffleCharacters();
          });
        });
      });
    }).slideDown().animate({opacity: 1}, 1000, "swing", function(){
      $(this).removeClass("opacity-none");
    })
  });
}

function shuffleQuestion(){
  currentQuestion = _.sample(gameQuestions);
  $(".mol-game").append("<div class=\"mol-question opacity-none\"><p>?</p></div>");
  //Show question
  $(".mol-question").animate({opacity: 1}, 600, "swing", function(){
    $(this).removeClass("opacity-none");
  });
  $(".mol-question p").text(currentQuestion).animate({fontSize: "+=1rem"}, 600, "swing", function(){
    _.pull(gameQuestions, currentQuestion);
  });
}

function runRound(){
  $(".mol-game").fadeOut(600, function(){
    $(this).empty().fadeIn(300, function(){
      if (_.isEmpty(gameQuestions)){
        $next("Pisteet!");
        $.each(gamePlayers, function(key, values){
          $(".mol-game").append("<p class=\"h4\"><strong>" + key + "</strong> sai <strong>" + values + "</strong> pistettä!</p>");
        });
        $(this).append(tellInfo("Tiedoksi! Pelaajat eivät ole pisteiden mukaisessa järjestyksessä. Nimetkää halutessanne voittaja.<br>Uusi peli? Lataa sivu uudestaan!"));
      } else {
        shuffleCharacters();
        shuffleQuestion();
      }
    });
  });
}

//Init jQuery (this is where the fun happens!)
$(function(){
  $(".mol-info").delay(1000).slideUp(300, function(){
    $("[data-mol]").prop("disabled", false);
  });
  //Start game
  $("[data-mol]").click(function(){
    //Ask language
    $next("Valitse kysymysten kieli");
    $.each(languages, function(key, value){
      $(".mol-game").append(btn(value.name, "language", key));
    });
    //Select game language
    $("[data-mol-language]").click(function(){
      gameLanguage = $(this).data("mol-language");
      //Ask game type
      $next("Valitse pelityyppi");
      $.each(languages[gameLanguage].types, function(key, value){
        $(".mol-game").append(btn(value, "type", key));
      });
      //Select game type
      $("[data-mol-type]").click(function(){
        gameType = questions[gameLanguage][$(this).data("mol-type")];
        gameQuestions = _.clone(gameType);
        //Ask for players
        $next("Pelaajat");
        $(".mol-game").append("<input class=\"form-control form-control-lg mb-2\" id=\"mol-name\" type=\"text\" placeholder=\"Nimenne, kiitos!\">")
        .append(btnSmall("Lisää", "name", "add") + btn("Aloita möläyttäminen!", "start", "go"));
        //Add player
        $("[data-mol-name]").click(function(){
          if($("#mol-name").val()){
            //Add player and set score to 0
            gamePlayers[$("#mol-name").val()] = 0;
            $("#mol-name").val("");
            $info("Lisätty!");
          } else{
            //Invalid name
            $info("Tuo ei näytä nimeltä :(");
          }
        });
        //Start the game
        $("[data-mol-start]").click(function(){
          if(_.size(gamePlayers) < 2){
            //Cannot start the game with less than 2 players
            $info("Lisää ainakin 2 pelaajaa!");
          } else{
            //Here the game really starts
            $next("Möläytys alkakoon!");
            $(".mol-game .intro").delay(3000).fadeOut(1000, function(){
              //Shuffle characters
              //Shuffle question
              runRound();
            });
          }
        });
      });
    });
  });
});
