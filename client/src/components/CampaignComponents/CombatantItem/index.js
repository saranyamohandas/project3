import React from "react";
import "./style.css";

function CombatantItem(props) {

   if (props.combatant.combatantType === "monster") {
      return (
         <div className="combatant-wrapper">
            <div className={props.combatant.myTurn ? "myTurn" : "notMyTurn"}></div>
            <div
               className={props.id % 2 === 0 ? "combatant-item light" : "combatant-item dark"}
            >
               <div className="combatant-name">
                  {props.combatant.name}
               </div>
               <div className="combatant-ac">
                  AC: {props.combatant.armor_class}
               </div>
               <div className="combatant-health">
                  HP: {props.combatant.hit_points}
                  <div className="hp-buttons">
                     <i
                        className="material-icons"
                        onClick={() => props.changeCombatantHealth(props.combatant.turnNumber, "increment")}
                     >
                        keyboard_arrow_up
                     </i>
                     <i
                        className="material-icons"
                        onClick={() => props.changeCombatantHealth(props.combatant.turnNumber, "decrement")}
                     >
                        keyboard_arrow_down
                     </i>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   else if (props.combatant.combatantType === "character") {
      return (
         <div className="combatant-wrapper">
            <div className={props.combatant.myTurn ? "myTurn" : "notMyTurn"}></div>
            <div
               className={props.id % 2 === 0 ? "combatant-item light" : "combatant-item dark"}
            >
               <div className="combatant-name">
                  {props.combatant.name}
               </div>
            </div>
         </div>
      );
   }
}

export default CombatantItem;

