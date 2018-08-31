exports.matchTransLocStopName = function(shuttleColor, stopPlaceholder){
    if (stopPlaceholder === "Rabb"){
      return "Rabb (Usdan)";
    } else if (stopPlaceholder === "Charles River Lot"){
      return "Charles River Lot (J-Lot)";
    }

    if (shuttleColor === "Yellow"){ //campus branvan
        if (stopPlaceholder === "Hassenfled Lot"){
          return "Hassenfeld Lot (Massell)";
        } else if (stopPlaceholder === "Lower Charles River Road"){
          return  "Lower Charles River Road (Grad)";
        } else if (stopPlaceholder === "Lemberg Children's Center"){
          return "transLocSucks"; //transLoc does not have arrival information for Lemberg
        } else if (stopPlaceholder === "Foster Apartments (Mods/Gosman)"){
          return "Foster Apartments (Mods/Gosman)";
        }
    } else if (shuttleColor === "Red"){ //daytime campus shuttle
          if (stopPlaceholder === "Lower Charles River Rd (between 150 and 164)"){
            return "Lower Charles River Road (Grad)";
          } else if (stopPlaceholder === "Hassenfeld/Massell"){
            return "Hassenfeld Lot (Massell)";
          } else if (stopPlaceholder === "Admissions"){
            return "transLocSucks";
          } else if (stopPlaceholder === "Main Entrance"){
            return "Main Entrance";
          }
    } else if (shuttleColor === "Orange"){ //Daytime waltham shuttle
        if (stopPlaceholder === "Theater Lot (rear of Spingold)"){
          return "Theater Lot (rear of Spingold Theatre)";
        } else if (stopPlaceholder === "Highland St. at Hope Ave"){
          return "Highland St. at Hope Ave.";
        } else if (stopPlaceholder === "Crescent St. at Cherry St."){
          return "Crescent St. at Cherry St. (in front of Watch Factory)";
        } else if (stopPlaceholder === "Crescent St. at Moody St."){
          return "Crescent St. at Moody St. (near Burger King)";
        } else if (stopPlaceholder === "Moody St. at Maple St./High St."){
          return "Moody St. at Maple St./High St.";
        } else if (stopPlaceholder === "140 Moody St."){
          return "140 Moody St. at Enterprise Rental Car";
        } else if (stopPlaceholder === "Main St. at Exchange St."){
          return "Main St. at Exchange St (near Waltham Public Library)";
        } else if (stopPlaceholder === "Main St across from CVS"){
          return "Main St Across from CVS";
        } else if (stopPlaceholder === "Charles St. at South St."){
          return "Charles St. at intersection with South St.";
        } else if (stopPlaceholder === "South St. at Shakespeare Rd."){
          return "South St. at Shakespeare Rd.";
        } else if (stopPlaceholder === "Shapiro Campus Center"){
          return "Spingold Intersection at Shapiro Campus Center";
        }
    // } else if (shuttleColor === "Blue"
    //           || shuttleColor === "Green"){ //Waltham Branvan
    } else if (shuttleColor === "Purple"
              || shuttleColor === "Pink"){ //Cambridge shuttle
        if (stopPlaceholder === "Marlborough/Mass Ave."){
          return "Mass Ave and Marlborough St.";
        } else if (stopPlaceholder === "Usdan"){
          return "Rabb (Usdan)";
        } else if (stopPlaceholder === "Harvard Square"){
          return "Harvard Square";
        }
    }
};
