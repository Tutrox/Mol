import {languages, questions} from "./config/questions";
import {btn, btnSmall, tell, tellInfo} from "./config/html-utils";
import $ from "jquery";
import {clone, dropRight, isEmpty, pull, random, sample, sampleSize, size, toArray} from "lodash-es";

var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ*";
var realCharacters = toArray(characters);
var gameLanguage, gameType, gameQuestions, gamePlayers = [], currentQuestion;

//Next page
function $next(info){
  return $(".mol-game").empty().hide().html(tell(info)).fadeIn();
}

//Show info-text at the bottom of the page
function $info(info){
  return $(".mol-info").slideUp().clearQueue().empty().html(tellInfo(info)).slideDown().delay(2000).slideUp();
}

function shuffleCharacters(){
  $(".mol-game").append(`<h1 class="opacity-half" id="mol-characters"></h1>`);
  //Shuffle a random number of characters
  $.each(sampleSize(dropRight(realCharacters), random(5, 7)), function(key, values){
    $("#mol-characters").delay(10).fadeOut(10, function(){
      $(this).text(values);
    }).fadeIn();
  });
  //Final character gets zoomed and darker
  $("#mol-characters").fadeOut(100, function(){
    $(this).text(sample(realCharacters));
  }).fadeIn().animate({fontSize: "+=3rem", opacity: 1}, 600, "swing", function(){
    $(this).removeClass("opacity-half");
    //Ask for the winner of the round
    $(".mol-game").append(`<div class="opacity-none" id="mol-round"></div>`);
    $("#mol-round").delay(2000).hide(0, function(){
      //Who was fastest? Add button for each player
      $(this).append(tell("Kuka oli nopein?"));
      $.each(gamePlayers, function(key, value){
        $("#mol-round").append(btn(value.name, "winner", key));
      });
      //Shuffle characters again
      $(this).append(btnSmall("Uusi kirjain", "roll", "go"));
      $("[data-mol-winner]").click(function(){
        //Add point to winner
        gamePlayers[$(this).data("mol-winner")].points += 1;
        runRound();
      });
      //Shuffle characters again
      $("[data-mol-roll]").click(function(){
        $("#mol-round").slideUp(300, function(){
          $(this).remove();
          $("#mol-characters").animate({fontSize: "-=3rem", opacity: 0.5}, 600, "swing", function(){
            shuffleCharacters();
          });
        });
      });
      //Show how many questions are left
      $(".mol-info").html(tellInfo(gameQuestions.length == 0 ? "Viimeinen kysymys!" : gameQuestions.length == 1 ? `${gameQuestions.length} kysymys jäljellä` : `${gameQuestions.length} kysymystä jäljellä`))
        .delay(1500).slideDown();
    }).animate({marginTop: "3rem"}).slideDown().animate({opacity: 1}, 1000, "swing", function(){
      $(this).removeClass("opacity-none");
    });
  });
}

function shuffleQuestion(){
  //Shuffle question
  currentQuestion = sample(gameQuestions);
  $(".mol-game").append(`<div class="mol-question opacity-none d-none"><p>?</p></div>`);
  //Show question
  $(".mol-question").slideDown(300).animate({opacity: 1}, 600, "swing", function(){
    $(this).removeClass("opacity-none d-none");
  });
  $(".mol-question p").text(currentQuestion).animate({fontSize: "+=1rem"}, 600, "swing", function(){
    //Remove asked question from the question list
    pull(gameQuestions, currentQuestion);
  });
}

function runRound(){
  $(".mol-game").fadeOut(600, function(){
    $(this).empty().fadeIn(300, function(){
      if (isEmpty(gameQuestions)){
        //Show points
        $next("Pisteet!");
        $.each(gamePlayers, function(key, value){
          $(".mol-game").append(`<p class="h4"><strong>${value.name}</strong> sai <strong>${value.points}</strong> ${value.points == 1 ? "pisteen" : "pistettä"}!</p>`);
        });
        //Info: Players are not organized by amount of points
        $(this).append(tellInfo("Tiedoksi! Pelaajat eivät ole pisteiden mukaisessa järjestyksessä. Nimetkää halutessanne voittaja.<br>Uusi peli? Lataa sivu uudestaan!"));
      } else{
        //Run round
        shuffleCharacters();
        shuffleQuestion();
      }
    });
  });
  $(".mol-info").clearQueue().slideUp();
}

//Init jQuery (this is where the fun happens!)
$(function(){
  $(".mol-info").delay(1000).slideUp(300, function(){
    $("[data-mol]").prop("disabled", false);
  });
  //Start game
  $("[data-mol]").click(function(){
    //Ask game language
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
        gameQuestions = clone(gameType);
        //Ask for players
        $next("Pelaajat");
        $(".mol-game").append(`<input class="form-control form-control-lg mb-2" id="mol-name" type="text" placeholder="Nimenne, kiitos!">`)
          .append(btnSmall("Lisää", "name", "add") + btn("Aloita möläyttäminen!", "start", "go"));
        //Add player
        $("[data-mol-name]").click(function(){
          if($("#mol-name").val()){
            //Add player and set score to 0
            gamePlayers.push({name: $("#mol-name").val(), points: 0});
            $("#mol-name").val("");
            $info("Lisätty!");
          } else{
            //Invalid name
            $info("Tuo ei näytä nimeltä :(");
          }
        });
        //Start the game
        $("[data-mol-start]").click(function(){
          if(size(gamePlayers) < 2){
            //Cannot start the game with less than 2 players
            $info("Lisää ainakin 2 pelaajaa!");
          } else{
            //Here the game really starts
            $(".mol-info").clearQueue().slideUp();
            $next("Möläytys alkakoon!");
            $(".mol-game .intro").delay(3000).fadeOut(1000, function(){
              //Shuffle characters & question
              runRound();
            });
          }
        });
      });
    });
  });
});
