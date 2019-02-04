import React, { Component } from "react";
import EncounterItem from "../EncounterItem";
import EncounterNew from "../EncounterNew";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EncounterMonsterList from "../SetupEncounters/EncounterMonsterList";
import SelectedMonster from "../SetupEncounters/SelectedMonster";
import monsters from "../../dnd-data/monsters.json";
import API from "../../utils/API";

class SetupEncounters extends Component {
  state = {
    encounters: [],
    newEncounter: [],
    displayItem: null,
    show: false,
    newItem: true,
    encounterName: ""
  };

  componentDidMount = () => {
    API.getEncountersFromCampaign(this.props.campaignId)
      .then(res => {
        // console.log(res)
        this.setState({
          encounters: res.data
        })
      })
};

  handleDisplay = id => {
    this.setState({
      displayItem: this.state.encounters.find(encounter => encounter.id === id)
    });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    // this.setState({
    //   encounterName: ""
    // });

    const newEncounter = {
      name: this.state.encounterName,
      monsters: this.state.newEncounter
    }

    API.addEncounterToCampaign(this.props.campaignId, newEncounter)
      .then(res => {
        // console.log(res)
        API.getEncountersFromCampaign(this.props.campaignId)
        .then(res => {
          // console.log(res)
          this.setState({
            encounters: res.data
          })
        })
      })
      .catch(err => console.log(err));
  };

  addMonsterToEncounter = monsterId => {

    const alteredEncounter = this.state.newEncounter;
    alteredEncounter.push(monsters[monsterId - 1])

    console.log("ALTERED ENCOUNTER: ", alteredEncounter);

    this.setState({
      newEncounter: alteredEncounter
    })
  }

  render() {
    return (
      <div>
        <div id="cta">
          {this.state.encounters.map(encounter => (
            <EncounterItem
              id={encounter.id}
              key={encounter.id}
              name={encounter.name}
              image={encounter.image}
              handleDisplay={this.handleDisplay}
            />
          ))}
          <Button onClick={this.handleShow}>New</Button>
        </div>
        <div id="render">
          {this.state.displayItem && (
            <EncounterItem
              id={this.state.displayItem.id}
              key={this.state.displayItem.id}
              name={this.state.displayItem.name}
              image={this.state.displayItem.image}
            />
          )}
          {this.state.newItem && (
            <div>
              <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>New Encounter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <form className="form">
                      <input
                        value={this.state.firstName}
                        name="encounterName"
                        onChange={this.handleInputChange}
                        type="text"
                        placeholder="Encounter Name"
                      />
                      <button onClick={this.handleFormSubmit}>Submit</button>
                    </form>
                    <div className="row">
                      <div className="col-6" id="monster-list">
                        <EncounterMonsterList addMonsterToEncounter={this.addMonsterToEncounter}/>
                      </div>
                      <div className="col-6" id="selected-monsters">
                        Encounter Monsters
                        {this.state.newEncounter.map( (monster, i) => (
                          <SelectedMonster
                            monster={monster}
                            key={i}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={this.handleClose}>
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SetupEncounters;
