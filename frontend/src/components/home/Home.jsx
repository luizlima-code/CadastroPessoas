import React, { Component } from "react";
import Main from "../template/Main";
import axios from "axios";

const baseUrl = "http://localhost:3001/users";
const initialState = {
  user: { name: "", email: "", date: "", city: "", state: "" },
  list: [],
};

export default class Home extends Component {

  state = { ...initialState };

  componentWillMount() {
    axios(baseUrl).then((resp) => {
     this.setState({ list: resp.data });
    });
  }

  filterCity() {
    return this.state.list.map((user) => { return (user.city)})
  }

  // removeDuplicateCity() {
  //   const listCity = filterCity();
  //   var seen = {};
  //   return a.filter(function(item) {
  //       return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  //   });
  // }

  formatDate(date) {
    const d = new Date(date)

    return (`${d.getDate() + 1} / ${d.getMonth() + 1} / ${d.getFullYear()}`)
  }
  
  removeDuplicateCity(){
    const listCitys = this.state.list.map(({city,state}) => ` ${city}-${state} `)
    const valor = listCitys.filter(function (a) {
      return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
    }, Object.create(null))
    
    return valor
  }

  calculateAge() { 
    const listOfAges = this.state.list.map((user) => { 
      const birthdayYear = user.date.split('-')[0]
      const birthdayMonth = user.date.split('-')[1]

      if (birthdayMonth <= (new Date().getMonth() + 1)) {
        return new Date().getFullYear() - birthdayYear
      }
      else {
        return new Date().getFullYear() - birthdayYear - 1
      }
    })
    return listOfAges;
  }

  calculateMediaAge() {
    const listAge = this.calculateAge().map(age => Number(age))
    return Math.floor(listAge.reduce((acumulador, idade) => acumulador += idade) / listAge.length)
  }
  
  render() {
    return this.state.list.map((user) => {
      return (
        <Main
          icon="home"
          title="Início"
          subtitle="Lista atualizada de cadastros"
        >
          <div className="display-2 d-flex justify-content-center">
            Bem Vindo!
          </div>
          <p className="display-4">Dados atualizados:</p>
          <hr />
          <div key={user.id}>
            <p>Numero de pessoas cadastradas: {this.state.list.length} </p>
            <hr />
            <p>
              Cidades presentes em cadastro:{this.removeDuplicateCity()}.
              
            </p>
            <p>
              Menor idade entre as pessoas cadastradas é: {Math.min(...this.calculateAge())}.
            </p>
            <p>
              Maior idade entre as pessoas cadastradas é: {Math.max(...this.calculateAge())}.
            </p>
            <p>
              Média de idade das pessoas cadastradas é: {this.calculateMediaAge()}.
            </p>
          </div>
        </Main>
      );
    });
  }
}
