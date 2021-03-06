import React, { Component } from 'react';
import MainDisplay from "../../components/CampaignComponents/MainDisplay";
import CombatantItem from "../../components/CampaignComponents/CombatantItem";
import InitiativeButtons from "../../components/CampaignComponents/InitiativeButtons";
import monsters from "../../dnd-data/monsters.json";
import _ from "lodash";
import "./campaign.css";

class Campaign extends Component {
   state = {
      encounter: [],
      campaignId: "",
      inCombat: false,
      mainDisplay: "monsters",
      currentCombatant: {}
   }

   componentDidMount() {
      // console.log(this.props.campaignId);
      this.setState({
         campaignId: this.props.campaignId
      })
   }

   alterMainDisplay = componentToDisplay => {
      switch (componentToDisplay) {
         case "monsters":
            this.setState({
               mainDisplay: "monsters"
            });
            break;
         case "encounters":
            this.setState({
               mainDisplay: "encounters"
            });
            break;
         case "characters":
            this.setState({
               mainDisplay: "characters"
            });
            break;
         default:
            this.setState({
               mainDisplay: "monsters"
            });
            break;
      }
   }

   addMonsterToCombatants = monsterIndex => {
      // Get current encounter array
      const alteredEncounter = this.state.encounter;
      // Make clone of object for the monster that was clicked
      let newMonster = _.cloneDeep(monsters[monsterIndex - 1]);
      // Add monster key so CombatantItem component knows to render monster
      newMonster.combatantType = "monster";
      // Add newMonster to the current encounter array
      alteredEncounter.push(newMonster);
      console.log("ALTERED ENCOUNTER: ", alteredEncounter);
      // Set state with the altered encounter
      this.setState({
         encounter: alteredEncounter,
      })
   }

   addEncounterToCombatants = encounter => {
      // Get current encounter array
      const alteredEncounter = this.state.encounter;
      // For each monster in the pre-built encounter that was clicked:
      encounter.monsters.forEach(monster => {
         // Add monster key so CombatantItem component knows to render monster
         monster.combatantType = "monster";
         // Add monster to current encounter array
         alteredEncounter.push(_.cloneDeep(monster));
      })
      // Set state with the altered encounter
      this.setState({
         encounter: alteredEncounter
      })
   }

   addCharacterToCombatants = character => {
      // Get current encounter array
      const alteredEncounter = this.state.encounter;
      // Add character key so CombatantItem component knows to render character
      character.combatantType = "character"
      // Add character to current encounter array
      alteredEncounter.push(character);
      // Set state with the altered encounter
      this.setState({
         encounter: alteredEncounter
      })
   }

   rollInitiative = () => {
      // Only execute if a combatant has been added to the encounter
      if (this.state.encounter.length > 0) {
         // Get all current combatants
         const turnOrder = this.state.encounter;
   
         // Roll initiative for each combatant (random number 1-20 plus its dexterity modifier)
         turnOrder.forEach(combatant => {
            combatant.initiativeValue = (Math.floor(Math.random() * 20) + 1) + getModifier(combatant.dexterity);
            combatant.myTurn = false;
            console.log(`${combatant.name}: ${combatant.initiativeValue}`);
         })
   
         // Sort combatants based on initiative rolled
         turnOrder.sort(function (a, b) {
            let initOfA = a.initiativeValue;
            let initOfB = b.initiativeValue;
            if (initOfA > initOfB) return -1;
            if (initOfA < initOfB) return 1;
            return 0;
         });
   
         // console.log("=================");
         // turnOrder.forEach(combatant => {
         //    console.log(`${combatant.name}: ${combatant.initiativeValue}`);
         // })
   
         let turnCounter = 1;
   
         turnOrder.forEach(combatant => {
            combatant.turnNumber = turnCounter;
            turnCounter++;
         })
   
         // Indicate that monster at index 0 has the first turn
         turnOrder[0].myTurn = true;
   
         const firstCombatant = monsters[turnOrder[0].index - 1]
   
         // Set new turn order to state, thus reorganizing the CombatantItems currently displayed to the page
         this.setState({
            encounter: turnOrder,
            inCombat: true,
            currentCombatant: firstCombatant
         });
      }
   }

   nextTurn = () => {
      // Get current encounter array
      const alteredEncounter = this.state.encounter;
      // Find combatant whose turn it is
      const currentTurnCombatant = alteredEncounter.find(combatant => combatant.myTurn === true);
      // Set that combatant's 'myTurn' key to false
      currentTurnCombatant.myTurn = false;

      // If currentTurnCombatant is last combatant in the turn order:
      if (currentTurnCombatant.turnNumber === alteredEncounter.length) {
         // Set first combtatant's myTurn key to true
         alteredEncounter[0].myTurn = true;

         const nextCombatant = monsters[alteredEncounter[0].index - 1];

         // Set altered encounter to state so components will rerender accordingly
         this.setState({
            encounter: alteredEncounter,
            currentCombatant: nextCombatant
         })

         // Otherwise:
      } else {
         // Find the combatant whose turn is next
         const nextTurnCombatant = alteredEncounter.find(combatant => combatant.turnNumber === currentTurnCombatant.turnNumber + 1);
         // Set that combatant's 'myTurn' ket to true
         nextTurnCombatant.myTurn = true;

         const nextCombatant = monsters[nextTurnCombatant.index - 1];

         // Set altered encounter to state so components will rerender accordingly
         this.setState({
            encounter: alteredEncounter,
            currentCombatant: nextCombatant
         })
      }
   }

   endCombat = () => {
      // Toggle all combatants 'myTurn' keys to false while inCombat is false
      const currentCombatants = this.state.encounter
      currentCombatants.forEach(combatant => {
         combatant.myTurn = false;
      });
      // Toggle inCombat to false
      this.setState({
         inCombat: false
      });
   }

   changeCombatantHealth = (turnNumber, upOrDown) => {
      const alteredEncounter = this.state.encounter;      

      if (upOrDown === "increment") {
         const currentTurnCombatant = alteredEncounter.find(combatant => combatant.turnNumber === turnNumber);
         currentTurnCombatant.hit_points = currentTurnCombatant.hit_points + 1;

      } else {
         const currentTurnCombatant = alteredEncounter.find(combatant => combatant.turnNumber === turnNumber);
         if (currentTurnCombatant.hit_points > 0) {
            currentTurnCombatant.hit_points = currentTurnCombatant.hit_points - 1;
         }
      }

      this.setState({
         encounter: alteredEncounter
      })
   }

   clearCombatants = () => {
      // Clear all combatants in current encounter array
      this.setState({
         encounter: []
      });
   }

   render() {
      return (
         <div id="campaign">
            <div id="campaign-sidebar">
               <div id="campaign-nav">
                  <div
                     className="campaign-nav-btn light"
                     onClick={() => this.alterMainDisplay("monsters")}
                  >
                     <span>Monsters</span>
                  </div>
                  <div
                     className="campaign-nav-btn dark"
                     onClick={() => this.alterMainDisplay("encounters")}
                  >
                     <span>Encounters</span>
                  </div>
                  <div
                     className="campaign-nav-btn light"
                     onClick={() => this.alterMainDisplay("characters")}
                  >
                     <span>Characters</span>
                  </div>
               </div>
            </div>
            <div id="campaign-main">
               <div id="info-display">
                  <MainDisplay
                     mainDisplay={this.state.mainDisplay}
                     campaignId={this.state.campaignId}
                     addMonsterToCombatants={this.addMonsterToCombatants}
                     addEncounterToCombatants={this.addEncounterToCombatants}
                     addCharacterToCombatants={this.addCharacterToCombatants}
                     inCombat={this.state.inCombat}
                     monster={this.state.currentCombatant}
                  />
               </div>
               <div id="combatants-display">
                  <h4>Combatants</h4>
                  <div id="combatants-list">
                     {this.state.encounter.map((combatant, i) => (
                        <CombatantItem
                           combatant={combatant}
                           changeCombatantHealth={this.changeCombatantHealth}
                           id={i}
                           key={i}
                        />
                     ))}
                  </div>
                  <InitiativeButtons
                     inCombat={this.state.inCombat}
                     rollInitiative={this.rollInitiative}
                     nextTurn={this.nextTurn}
                     endCombat={this.endCombat}
                     clearCombatants={this.clearCombatants}
                  />
               </div>
            </div>
         </div>
      );
   }
}

export default Campaign;

function getModifier(abilityScore) {

   const check = abilityScore;

   switch (true) {
      case (check === 1):
         return -5;
      case (2 <= check && check <= 3):
         return -4;
      case (4 <= check && check <= 5):
         return -3;
      case (6 <= check && check <= 7):
         return -2;
      case (8 <= check && check <= 9):
         return -1;
      case (10 <= check && check <= 11):
         return 0;
      case (12 <= check && check <= 13):
         return 1;
      case (14 <= check && check <= 15):
         return 2;
      case (16 <= check && check <= 17):
         return 3;
      case (18 <= check && check <= 19):
         return 4;
      case (20 <= check && check <= 21):
         return 5;
      case (22 <= check && check <= 23):
         return 6;
      case (24 <= check && check <= 25):
         return 7;
      case (26 <= check && check <= 27):
         return 8;
      case (28 <= check && check <= 29):
         return 9;
      case (check === 30):
         return 10;
      default:
         return 0;
   }
}